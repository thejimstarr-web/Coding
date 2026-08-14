"use strict";

/* ---- Club location: Kalamunda, WA (adjust if your range is elsewhere) ---- */
const CLUB = {
  name: "Kalamunda Governor Stirling Archers",
  lat: -31.947258519626708,
  lon: 116.02860491761463,
  timezone: "Australia/Perth",
};

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${CLUB.lat}&longitude=${CLUB.lon}` +
  `&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation` +
  `&hourly=wind_speed_10m` +
  `&daily=sunrise,sunset` +
  `&forecast_days=1` +
  `&wind_speed_unit=kmh&timezone=${encodeURIComponent(CLUB.timezone)}`;

const els = {
  time: document.getElementById("current-time"),
  date: document.getElementById("current-date"),
  daylightStatus: document.getElementById("daylight-status"),
  daylightWindow: document.getElementById("daylight-window"),
  weatherStatus: document.getElementById("weather-status"),
  weatherGrid: document.getElementById("weather-grid"),
  windSpeed: document.getElementById("wind-speed"),
  windGusts: document.getElementById("wind-gusts"),
  windDir: document.getElementById("wind-dir"),
  temperature: document.getElementById("temperature"),
  refreshBtn: document.getElementById("refresh-btn"),
  weatherVerdictBadge: document.getElementById("weather-verdict-badge"),
  weatherVerdictText: document.getElementById("weather-verdict-text"),
  daylightVerdictBadge: document.getElementById("daylight-verdict-badge"),
  daylightVerdictText: document.getElementById("daylight-verdict-text"),
  recTimes: document.getElementById("rec-times"),
  recBows: document.getElementById("rec-bows"),
  recDistances: document.getElementById("rec-distances"),
  bestWindow: document.getElementById("best-window"),
  hourlyChart: document.getElementById("hourly-chart"),
  bowButtons: document.getElementById("bow-buttons"),
  bowResult: document.getElementById("bow-result"),
  shootsList: document.getElementById("shoots-list"),
};

/* Latest fetched conditions, kept around so the bow picker can react
   without re-fetching. */
const state = {
  windCat: null,
  tempC: null,
  isDaylight: null,
  selectedBow: null,
};

/* ---------------- Clock ---------------- */

function tickClock() {
  const now = new Date();
  els.time.textContent = now.toLocaleTimeString("en-AU", {
    timeZone: CLUB.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  els.date.textContent = now.toLocaleDateString("en-AU", {
    timeZone: CLUB.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ---------------- Helpers ---------------- */

function degreesToCompass(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function windCategory(kmh) {
  if (kmh < 8) return { key: "calm", label: "Calm" };
  if (kmh < 15) return { key: "light", label: "Light breeze" };
  if (kmh < 25) return { key: "moderate", label: "Moderate wind" };
  if (kmh < 35) return { key: "strong", label: "Strong wind" };
  return { key: "very-strong", label: "Very strong wind" };
}

function getSeason(date, tz) {
  const month = Number(
    new Intl.DateTimeFormat("en-AU", { timeZone: tz, month: "numeric" }).format(date)
  );
  // Southern Hemisphere seasons
  if ([12, 1, 2].includes(month)) return "summer";
  if ([3, 4, 5].includes(month)) return "autumn";
  if ([6, 7, 8].includes(month)) return "winter";
  return "spring";
}

function localHour(date, tz) {
  return Number(
    new Intl.DateTimeFormat("en-AU", { timeZone: tz, hour: "numeric", hour12: false }).format(date)
  );
}

function formatLocalTime(isoString, tz) {
  return new Date(isoString).toLocaleTimeString("en-AU", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/* ---------------- Upcoming shoots ---------------- */

function localISODate(date, tz) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatShootDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntilLabel(dateStr, todayStr) {
  const diffDays = Math.round(
    (new Date(`${dateStr}T00:00:00`) - new Date(`${todayStr}T00:00:00`)) / 86400000
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `In ${diffDays} days`;
}

function renderUpcomingShoots() {
  const todayStr = localISODate(new Date(), CLUB.timezone);
  const upcoming = KGSA_SHOOTS.filter((s) => s.date >= todayStr).slice(0, 2);

  els.shootsList.innerHTML = "";

  if (upcoming.length === 0) {
    els.shootsList.innerHTML =
      '<div class="muted">No upcoming shoots listed — check back once the calendar is updated.</div>';
    return;
  }

  for (const shoot of upcoming) {
    const tile = document.createElement("div");
    tile.className = "shoot-tile";

    const when = document.createElement("div");
    when.className = "shoot-when";
    when.textContent = `${daysUntilLabel(shoot.date, todayStr)} · ${formatShootDate(shoot.date)}`;
    tile.appendChild(when);

    const name = document.createElement("div");
    name.className = "shoot-name";
    name.textContent = shoot.name;
    tile.appendChild(name);

    if (shoot.arrows) {
      const arrows = document.createElement("div");
      arrows.className = "shoot-detail";
      arrows.textContent = `${shoot.arrows} arrows`;
      tile.appendChild(arrows);
    }
    if (shoot.distance) {
      const distance = document.createElement("div");
      distance.className = "shoot-detail";
      distance.textContent = shoot.distance;
      tile.appendChild(distance);
    }
    if (shoot.face) {
      const face = document.createElement("div");
      face.className = "shoot-detail";
      face.textContent = `Face size: ${shoot.face}cm`;
      tile.appendChild(face);
    }

    els.shootsList.appendChild(tile);
  }
}

/* ---------------- Recommendations ---------------- */

function buildTimeRecommendations(season, sunriseISO, sunsetISO, nowHour) {
  const sunrise = formatLocalTime(sunriseISO, CLUB.timezone);
  const sunset = formatLocalTime(sunsetISO, CLUB.timezone);
  const items = [];

  if (season === "summer") {
    items.push(`Early morning: ${sunrise}–09:00 — cool and usually calmest wind of the day.`);
    items.push("Avoid 11:00–16:00 — peak heat, higher UV, and afternoon sea breeze ('the Fremantle Doctor') tends to pick up.");
    items.push(`Late afternoon/evening: 17:00–${sunset} — cooling down as the sea breeze eases.`);
  } else if (season === "winter") {
    items.push(`Mid-morning: 09:00–12:00 — mild temperatures, frontal winds usually haven't built yet.`);
    items.push("Early afternoon: 12:00–14:30 — often the warmest, calmest window in winter.");
    items.push(`Avoid late in the day close to ${sunset} — light fades fast and squally showers are more likely.`);
  } else {
    items.push(`Morning: ${sunrise}–10:30 — generally settled conditions.`);
    items.push("Midday–early afternoon: comfortable temperatures, keep an eye on building breeze.");
    items.push(`Late afternoon can turn gusty before sunset (${sunset}) — check wind before committing to long distances.`);
  }

  items.push(
    nowHour >= Number(sunrise.split(":")[0]) && nowHour < Number(sunset.split(":")[0])
      ? "Right now is within today's daylight window."
      : "It's currently outside daylight hours — outdoor shooting isn't recommended."
  );

  return items;
}

function buildBowRecommendations(windCat) {
  switch (windCat.key) {
    case "calm":
      return [
        "Recurve — ideal, full stabiliser setup will perform predictably.",
        "Compound — ideal for long-distance precision work.",
        "Barebow — great conditions to work on fine bare-shaft tuning.",
        "Longbow / Traditional — safe and pleasant conditions.",
      ];
    case "light":
      return [
        "Recurve — fine; expect very slight arrow drift at 60–70m.",
        "Compound — no real issue at any distance.",
        "Barebow — fine; hold a touch firmer on release.",
        "Longbow — manageable, watch for gusts on the release.",
      ];
    case "moderate":
      return [
        "Compound — best choice today; holds steadiest in the wind.",
        "Recurve — usable, but add stabiliser weight and expect noticeable drift long-distance.",
        "Barebow — use heavier/stiffer arrows and shorten your distance if grouping suffers.",
        "Longbow — will be affected the most; consider a shorter session or indoor instead.",
      ];
    case "strong":
      return [
        "Compound — usable with full stabilisation, but expect gust effects on aim.",
        "Recurve / Barebow — outdoor scoring rounds not advised; drill or short-distance practice only.",
        "Longbow — not recommended outdoors in this wind.",
        "Consider moving the whole squad to the indoor range if available.",
      ];
    default:
      return [
        "No bow type is well suited to outdoor shooting in this wind.",
        "Move to the indoor range, or stand the session down and reschedule.",
      ];
  }
}

function buildDistanceRecommendations(windCat) {
  switch (windCat.key) {
    case "calm":
      return [
        "Recurve / Barebow: full 70m / 60m outdoor distances.",
        "Compound: 50m or the full WA1440/900 round.",
        "Great day to attempt a personal best at your longest distance.",
      ];
    case "light":
      return [
        "Recurve: 70m / 60m still fine.",
        "Compound: 50m, holding steady.",
        "Barebow / Longbow: consider capping at 50m if drift becomes noticeable.",
      ];
    case "moderate":
      return [
        "Step in to 50m or 40m for recurve and barebow.",
        "Compound can usually still hold 50–70m with good form.",
        "Longbow: 30m–40m recommended.",
      ];
    case "strong":
      return [
        "Limit outdoor shooting to 30m or shorter.",
        "Consider a 25m or 18m indoor-style session instead.",
        "Skip long-distance scoring rounds today.",
      ];
    default:
      return [
        "18m indoor range only, if available.",
        "Otherwise, stand down outdoor sessions until wind eases.",
      ];
  }
}

function buildWeatherVerdict(windCat, tempC) {
  if (windCat.key === "very-strong") {
    return { level: "bad", text: "Wind is too strong for outdoor shooting — move indoors or stand down." };
  }
  if (tempC !== null && tempC >= 38) {
    return { level: "bad", text: "Extreme heat — high risk of heat stress, postpone outdoor shooting." };
  }
  if (windCat.key === "strong" || (tempC !== null && tempC >= 34)) {
    return { level: "ok", text: "Shootable with adjustments — shorten distances and stay hydrated." };
  }
  if (windCat.key === "moderate") {
    return { level: "ok", text: "Good shooting conditions with minor adjustments for wind." };
  }
  return { level: "good", text: "Great wind and temperature for outdoor shooting." };
}

function buildDaylightVerdict(isDaylight, sunriseISO, sunsetISO) {
  if (isDaylight) {
    return { level: "good", text: "It's currently daylight — safe to shoot outdoors." };
  }
  const sunrise = formatLocalTime(sunriseISO, CLUB.timezone);
  const sunset = formatLocalTime(sunsetISO, CLUB.timezone);
  return {
    level: "bad",
    text: `It's outside today's daylight window (sunrise ${sunrise}, sunset ${sunset}) — outdoor shooting isn't recommended.`,
  };
}

const BOW_LABELS = {
  recurve: "Recurve",
  compound: "Compound",
  barebow: "Barebow",
  longbow: "Longbow",
};

function buildRoundSuggestion(bow, windCat) {
  const table = {
    recurve: {
      calm: "Full WA1440 or WA70 (70/60/50/30m) — great conditions for a long-distance round.",
      light: "WA70 (70/60/50/30m) — still very shootable at full distance.",
      moderate: "WA900 (60/50/40m) — step in from 70m if grouping opens up.",
      strong: "30m practice only, or move to indoor 18m.",
      "very-strong": "Indoor 18m round recommended.",
    },
    compound: {
      calm: "Full WA1440 (50m) or WA70 (50m) — ideal precision conditions.",
      light: "WA70 (50m) — holding steady.",
      moderate: "WA900 (50/40/30m) — still comfortable for compound.",
      strong: "50m with full stabilisation, or indoor 18m if the squad wants consistency.",
      "very-strong": "Indoor 18m round recommended.",
    },
    barebow: {
      calm: "WA900 (60/50/40m) or a full barebow round at 50m.",
      light: "50m round — comfortable conditions.",
      moderate: "Step in to 40/30m — drift builds quickly without sights.",
      strong: "30m practice only.",
      "very-strong": "Indoor 18m round recommended.",
    },
    longbow: {
      calm: "Traditional round at 50/40/30m.",
      light: "50/40/30m — pleasant conditions.",
      moderate: "30m practice — expect real drift at longer distances.",
      strong: "Not recommended outdoors — indoor 18m or stand down.",
      "very-strong": "Indoor 18m round recommended, or stand the session down.",
    },
  };
  return table[bow][windCat.key];
}

function renderBowResult(bow) {
  if (!bow || !state.windCat) return;
  const suggestion = buildRoundSuggestion(bow, state.windCat);
  els.bowResult.innerHTML =
    `<strong>${BOW_LABELS[bow]}</strong> in current ${state.windCat.label.toLowerCase()}: ${suggestion}`;
}

/* ---------------- Hourly outlook ---------------- */

function renderHourlyOutlook(hourly, sunriseISO, sunsetISO) {
  const sunriseHour = localHour(new Date(sunriseISO), CLUB.timezone);
  const sunsetHour = localHour(new Date(sunsetISO), CLUB.timezone);

  const daylightIdx = [];
  hourly.time.forEach((t, i) => {
    const hour = Number(t.slice(11, 13));
    if (hour >= sunriseHour && hour <= sunsetHour) daylightIdx.push(i);
  });

  if (daylightIdx.length === 0) {
    els.bestWindow.textContent = "No daylight hours remaining today.";
    els.hourlyChart.innerHTML = "";
    return;
  }

  // Find the 2-hour contiguous window with the lowest average wind.
  let best = null;
  for (let k = 0; k < daylightIdx.length - 1; k++) {
    const i = daylightIdx[k];
    const j = daylightIdx[k + 1];
    const avg = (hourly.wind_speed_10m[i] + hourly.wind_speed_10m[j]) / 2;
    if (!best || avg < best.avg) {
      best = { startIdx: i, endIdx: j, avg };
    }
  }

  const hourLabel = (idx) => hourly.time[idx].slice(11, 16);
  const addHour = (label) => {
    const [h, m] = label.split(":").map(Number);
    return `${String((h + 1) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };
  els.bestWindow.innerHTML = best
    ? `Best 2-hour window: <strong>${hourLabel(best.startIdx)}–${addHour(hourLabel(best.endIdx))}</strong> (avg ${Math.round(best.avg)} km/h)`
    : "";

  const maxSpeed = Math.max(...daylightIdx.map((i) => hourly.wind_speed_10m[i]), 10);
  els.hourlyChart.innerHTML = "";
  for (const i of daylightIdx) {
    const speed = hourly.wind_speed_10m[i];
    const cat = windCategory(speed);
    const col = document.createElement("div");
    col.className = "hour-col";

    const bar = document.createElement("div");
    bar.className = `hour-bar ${cat.key}`;
    if (best && (i === best.startIdx || i === best.endIdx)) bar.classList.add("best-hour");
    bar.style.height = `${Math.min(90, Math.max(4, (speed / Math.max(maxSpeed, 20)) * 90))}px`;
    bar.title = `${hourly.time[i].slice(11, 16)} — ${Math.round(speed)} km/h`;

    const label = document.createElement("div");
    label.className = "hour-label";
    label.textContent = hourly.time[i].slice(11, 13);

    col.appendChild(bar);
    col.appendChild(label);
    els.hourlyChart.appendChild(col);
  }
}

function renderList(el, items) {
  el.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  }
}

/* ---------------- Weather fetch + render ---------------- */

async function loadWeather() {
  els.weatherStatus.textContent = "Fetching live weather…";
  els.weatherGrid.hidden = true;
  els.refreshBtn.disabled = true;

  try {
    const res = await fetch(WEATHER_URL);
    if (!res.ok) throw new Error(`Weather service returned ${res.status}`);
    const data = await res.json();

    const windKmh = data.current.wind_speed_10m;
    const gustKmh = data.current.wind_gusts_10m;
    const windDeg = data.current.wind_direction_10m;
    const tempC = data.current.temperature_2m;
    const sunriseISO = data.daily.sunrise[0];
    const sunsetISO = data.daily.sunset[0];

    els.windSpeed.textContent = `${Math.round(windKmh)} km/h`;
    els.windGusts.textContent = `${Math.round(gustKmh)} km/h`;
    els.windDir.textContent = `${degreesToCompass(windDeg)} (${Math.round(windDeg)}°)`;
    els.temperature.textContent = `${Math.round(tempC)}°C`;

    els.weatherStatus.textContent = `Updated ${new Date().toLocaleTimeString("en-AU", { timeZone: CLUB.timezone, hour12: false })}`;
    els.weatherGrid.hidden = false;

    const now = new Date();
    const nowHour = localHour(now, CLUB.timezone);
    const sunriseHour = localHour(new Date(sunriseISO), CLUB.timezone);
    const sunsetHour = localHour(new Date(sunsetISO), CLUB.timezone);
    const isDaylight = nowHour >= sunriseHour && nowHour < sunsetHour;

    els.daylightStatus.textContent = isDaylight ? "Daylight" : "Dark";
    els.daylightWindow.textContent =
      `Sunrise ${formatLocalTime(sunriseISO, CLUB.timezone)} · Sunset ${formatLocalTime(sunsetISO, CLUB.timezone)}`;

    const windCat = windCategory(windKmh);
    const season = getSeason(now, CLUB.timezone);
    const weatherVerdict = buildWeatherVerdict(windCat, tempC);
    const daylightVerdict = buildDaylightVerdict(isDaylight, sunriseISO, sunsetISO);

    els.weatherVerdictBadge.textContent = `${windCat.label} · ${weatherVerdict.level.toUpperCase()}`;
    els.weatherVerdictBadge.className = `badge ${weatherVerdict.level}`;
    els.weatherVerdictText.textContent = weatherVerdict.text;

    els.daylightVerdictBadge.textContent = `${isDaylight ? "Daytime" : "Night"} · ${daylightVerdict.level.toUpperCase()}`;
    els.daylightVerdictBadge.className = `badge ${daylightVerdict.level}`;
    els.daylightVerdictText.textContent = daylightVerdict.text;

    renderList(els.recTimes, buildTimeRecommendations(season, sunriseISO, sunsetISO, nowHour));
    renderList(els.recBows, buildBowRecommendations(windCat));
    renderList(els.recDistances, buildDistanceRecommendations(windCat));
    renderHourlyOutlook(data.hourly, sunriseISO, sunsetISO);

    state.windCat = windCat;
    state.tempC = tempC;
    state.isDaylight = isDaylight;
    if (state.selectedBow) renderBowResult(state.selectedBow);
  } catch (err) {
    els.weatherStatus.textContent =
      `Couldn't load live weather (${err.message}). Check your connection and try again.`;
  } finally {
    els.refreshBtn.disabled = false;
  }
}

/* ---------------- Init ---------------- */

tickClock();
setInterval(tickClock, 1000);
loadWeather();
els.refreshBtn.addEventListener("click", loadWeather);
setInterval(loadWeather, 5 * 60 * 1000); // auto-refresh every 5 minutes

renderUpcomingShoots();
setInterval(renderUpcomingShoots, 5 * 60 * 1000); // keeps "Today"/"Tomorrow" labels current

els.bowButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".bow-btn");
  if (!btn) return;
  els.bowButtons.querySelectorAll(".bow-btn").forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  state.selectedBow = btn.dataset.bow;
  if (state.windCat) {
    renderBowResult(state.selectedBow);
  } else {
    els.bowResult.textContent = "Still loading current conditions…";
  }
});
