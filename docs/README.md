# Kalamunda Governor Stirling Archers — Shoot Conditions App

A simple static web app for the club that:

- Shows the current date and time in Perth, WA.
- Fetches live wind speed, gusts, direction and temperature for the club's
  range from [Open-Meteo](https://open-meteo.com) (free, no API key required).
- Works out whether it's currently daylight (using today's sunrise/sunset).
- Gives an overall shoot verdict (Good / OK / Not recommended).
- Recommends shooting times, bow types, and distances based on current
  wind, temperature, season and daylight.
- Shows an hourly wind outlook for the rest of today's daylight hours and
  highlights the best 2-hour window to shoot.
- Lets you pick your bow type (recurve / compound / barebow / longbow) for
  wind-based advice tailored to whatever shoot is actually next on the
  calendar (its name, date, arrows and distances), not a generic round.
- Shows the next two upcoming KGSA shoots from the club's 2026 calendar,
  which automatically advance as each date passes, with an "Add to
  calendar" button that downloads a `.ics` file for each one.
- Shows UV index and rain chance for the current hour alongside wind and
  temperature.

## Running it

No build step or server-side code — it's plain HTML/CSS/JS.

```bash
cd kalamunda-archers-app
python3 -m http.server 8080
# then open http://localhost:8080 in a browser
```

Or just open `index.html` directly in a browser (the weather fetch needs
network access to `api.open-meteo.com`).

## Configuring the location

Club coordinates are set in `script.js`:

```js
const CLUB = {
  name: "Kalamunda Governor Stirling Archers",
  lat: -31.947258519626708,
  lon: 116.02860491761463,
  timezone: "Australia/Perth",
};
```

Update `lat`/`lon` if your actual range is at a different spot, and the
weather/sunrise/sunset data will follow.

## Recommendation logic

Wind bands (10m wind speed, km/h):

| Band | Range | Guidance |
|---|---|---|
| Calm | < 8 | Ideal — all bow types, full outdoor distances |
| Light breeze | 8–15 | Fine for all bow types, minor drift at long range |
| Moderate | 15–25 | Compound holds steadiest; shorten distance / add stabiliser weight for recurve, barebow, longbow |
| Strong | 25–35 | Outdoor scoring not advised for recurve/barebow/longbow; short distances or indoor recommended |
| Very strong | ≥ 35 | Outdoor shooting not recommended for any bow type |

Shooting-time suggestions vary by season (Southern Hemisphere: summer
Dec–Feb, winter Jun–Aug) to steer around Perth's midday summer heat and
short winter daylight. Distance suggestions follow standard World Archery
outdoor distances (90/70/60/50/40/30m) and the 18m/25m indoor distances.

This is general club-level guidance, not an official ruling — always
follow your Range Officer's call on the day.

## Updating the shoot calendar

`shoots.js` holds the full 2026 shoot list as a plain array of
`{ date, name, arrows, distance, face }` objects (`date` is `YYYY-MM-DD`).
The app always shows whichever two entries have the soonest date that
hasn't passed yet — no other code needs to change as the year progresses.
To add, remove, or correct a shoot, edit that array directly.

## Notes

This app's live weather fetch couldn't be exercised inside this build
sandbox (outbound network policy blocks `api.open-meteo.com` here), but it
uses Open-Meteo's public, CORS-enabled JSON API and will work in any
normal browser with internet access. Please do a quick check in a browser
after pulling this branch to confirm wind data loads as expected.
