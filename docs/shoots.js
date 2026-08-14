"use strict";

// KGSA shoot calendar, transcribed from the club's 2026 shoot list.
// Update this array to add/change shoots; the app always shows the next two from today.
const KGSA_SHOOTS = [
  {
    "date": "2026-08-01",
    "name": "90 Arrows - Melville/Beechboro Rounds",
    "arrows": 90,
    "distance": "Melville 60/50/40m; Beechboro 50/40/30m (30 arrows/distance - round depends on archer/class)",
    "face": "80"
  },
  {
    "date": "2026-08-02",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-08-08",
    "name": "Field 2 x 12 targets - Club Championships",
    "arrows": null,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-08-09",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-08-15",
    "name": "120 Arrows - Sydney Rounds",
    "arrows": 120,
    "distance": "Long Sydney 90/70/60/50m; Sydney 70/60/50/40m; Short Sydney 60/50/40/30m; Junior Sydney 50/40/30/20m; Short Junior Sydney 40/30/20/10m (30 arrows/distance - round depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-08-16",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-08-22",
    "name": "72 Arrows - WA720 Rounds",
    "arrows": 72,
    "distance": "WA70/720 = 70m; WA60/720 = 60m; WA50/720 = 50m",
    "face": null
  },
  {
    "date": "2026-08-23",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-08-29",
    "name": "72 arrows - Woolongong / Townsville / Wyndham / Kalgoorlie / Geraldton",
    "arrows": 72,
    "distance": "Wollongong 90/70m; Townsville 70/60m; Wyndham 60/50m; Kalgoorlie 50/40m; Geraldton 40/30m (36 arrows/distance - round depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-08-30",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-09-05",
    "name": "90 Arrows - Hobart/Perth Canberra - Club Championships",
    "arrows": 90,
    "distance": "Hobart 90/70/50m; Perth 70/60/50m; Short Canberra 50/40/30m; Junior Canberra 40/30/20m (30 arrows/distance - round depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-09-06",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-09-12",
    "name": "72 Arrows - Launceston/Plantagenet/Kalamunda",
    "arrows": 72,
    "distance": "Launceston 50/30m; Plantagenet 40/30m; Kalamunda 30/20m (36 arrows/distance - round depends on archer/class)",
    "face": "80"
  },
  {
    "date": "2026-09-13",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-09-19",
    "name": "120 Arrows - Brisbane/Adelaide Rounds",
    "arrows": 120,
    "distance": "Brisbane 70/60m + 50/40m; Adelaide 60/50m + 40/30m (30 arrows/distance - round depends on archer/class)",
    "face": "122/80"
  },
  {
    "date": "2026-09-20",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-09-26",
    "name": "144 Arrows - WA1440 Rounds",
    "arrows": 144,
    "distance": "WA90/1440 90/70m + 50/30m; WA70/1440 70/60m + 50/30m; WA60/1440 60/50m + 40/30m (36 arrows/distance - round depends on archer/class)",
    "face": "122/80"
  },
  {
    "date": "2026-09-27",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-01",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-03",
    "name": "108 Arrows - Sorrento Rounds",
    "arrows": 108,
    "distance": "Long Sorrento 90/70/60m; Sorrento 70/60/50m; Short Sorrento 60/50/40m; Junior Sorrento 50/40/30m; Short Junior Sorrento 40/30/20m (36 arrows/distance - round shot depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-10-04",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-06",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-08",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-10",
    "name": "72 Arrows - WA720 Rounds",
    "arrows": 72,
    "distance": "WA70/720 = 70m; WA60/720 = 60m; WA50/720 = 50m",
    "face": "122/80"
  },
  {
    "date": "2026-10-11",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-11",
    "name": "STATE TARGET CHAMPIONSHIPS 2026",
    "arrows": null,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-13",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-15",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-17",
    "name": "Field 2 x 12 targets - Club Championships",
    "arrows": null,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-18",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-20",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-22",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-24",
    "name": "120 Arrows - Sydney Rounds",
    "arrows": 120,
    "distance": "Long Sydney 90/70/60/50m; Sydney 70/60/50/40m; Short Sydney 60/50/40/30m; Junior Sydney 50/40/30/20m; Short Junior Sydney 40/30/20/10m (30 arrows/distance - round depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-10-25",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-27",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-29",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-10-31",
    "name": "90 Arrows - Benara/Lockridge/Grange/Melbourne/Darwin/Geelong/Newcastle 2",
    "arrows": 90,
    "distance": "Benara 90m; Lockridge 70m; Grange 60m; Melbourne 50m; Darwin 40m; Geelong 30m; Newcastle 20m (single distance, 90 arrows - round depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-10-31",
    "name": "TICKET SHOOT - 90 Arrows - Benara/Lockridge/Grange/Melbourne",
    "arrows": 90,
    "distance": "Benara 90m; Lockridge 70m; Grange 60m; Melbourne 50m (single distance, 90 arrows - round depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-11-03",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-05",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-07",
    "name": "90 Arrows - Hobart/Perth/Canberra Rounds - CLUB CHAMPIONSHIPS",
    "arrows": 90,
    "distance": "Hobart 90/70/50m; Perth 70/60/50m; Short Canberra 50/40/30m; Junior Canberra 40/30/20m (30 arrows/distance - round depends on archer/class)",
    "face": "122"
  },
  {
    "date": "2026-11-08",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-10",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-12",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-14",
    "name": "90 Arrows - Joondalup/Holt/Gnangara/Drake Rounds",
    "arrows": 90,
    "distance": "Joondalup 60m; Holt 50m; Samford(Gnangara) 40m; Drake 30m (single distance, 90 arrows - round depends on archer/class)",
    "face": "80"
  },
  {
    "date": "2026-11-15",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-17",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-19",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-21",
    "name": "120 Arrows - Brisbane/Adelaide Rounds",
    "arrows": 120,
    "distance": "Brisbane 70/60m + 50/40m; Adelaide 60/50m + 40/30m (30 arrows/distance - round depends on archer/class)",
    "face": "122/80"
  },
  {
    "date": "2026-11-22",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-24",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-26",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-11-28",
    "name": "144 Arrows - WA1440 rounds",
    "arrows": 144,
    "distance": "WA90/1440 90/70m + 50/30m; WA70/1440 70/60m + 50/30m; WA60/1440 60/50m + 40/30m (36 arrows/distance - round depends on archer/class)",
    "face": "122/80"
  },
  {
    "date": "2026-11-29",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-01",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-03",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-05",
    "name": "The Jimmy Barlas 800",
    "arrows": null,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-06",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-08",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-09",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-13",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-15",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-17",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-19",
    "name": "72 Arrows - Launceston/Plantagenet/Kalamunda",
    "arrows": 72,
    "distance": "Launceston 50/30m; Plantagenet 40/30m; Kalamunda 30/20m (36 arrows/distance - round depends on archer/class)",
    "face": "80"
  },
  {
    "date": "2026-12-20",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-22",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  },
  {
    "date": "2026-12-26",
    "name": "72 Arrows - WA720 Rounds",
    "arrows": 72,
    "distance": "WA70/720 = 70m; WA60/720 = 60m; WA50/720 = 50m",
    "face": null
  },
  {
    "date": "2026-12-27",
    "name": "72 Arrows - Early Sunday Shoot",
    "arrows": 72,
    "distance": null,
    "face": "122/80"
  },
  {
    "date": "2026-12-29",
    "name": "72 Arrows - Night Shoot",
    "arrows": 72,
    "distance": null,
    "face": null
  }
];
