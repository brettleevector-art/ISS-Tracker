# ISS Live Tracker

A live world map showing the real-time position of the International Space Station, updated every 5 seconds, with its recent orbital trail and current stats.

**Live demo:** https://brettleevector-art.github.io/ISS-Tracker/

![ISS Live Tracker screenshot](screenshot.png)

## What it does

- Plots the ISS's current latitude and longitude on an interactive map and moves the marker every 5 seconds
- Draws the recent orbital trail, split where the ISS crosses the ±180° longitude line so no line streaks across the map
- Shows altitude, speed and last-updated time in a stats panel
- Attempts to list the current ISS crew (see Known limits)
- Recovers from network or API errors and shows a retry message instead of crashing

## How it works

The browser calls the [Where the ISS at?](https://wheretheiss.at/w/developer) API every 5 seconds. Each response contains the ISS's position, altitude, velocity and a timestamp.

- **Marker:** created once on the first response, then moved with Leaflet's `setLatLng` on every update.
- **Trail:** the last 100 positions (about 8 minutes) are kept in an array. On each update the positions are rebuilt into line segments, and a new segment starts whenever longitude jumps by more than 180 degrees, which is how the date-line crossing is handled.
- **Errors:** each request is wrapped in `try/catch`, so a failed call shows a retry message and the next poll tries again.

There is no backend and no build step. It is plain HTML, CSS and JavaScript, with [Leaflet](https://leafletjs.com/) for the map.

## Run it locally

No API keys are needed.

```
git clone https://github.com/brettleevector-art/ISS-Tracker.git
cd ISS-Tracker
```

Then open the folder in VS Code, install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.

Any static file server also works, for example `python -m http.server 5500`, then open `http://localhost:5500`.

## Tech

- HTML, CSS, vanilla JavaScript
- [Leaflet](https://leafletjs.com/) 1.9.4 for the map
- [OpenStreetMap](https://www.openstreetmap.org/copyright) map tiles
- [wheretheiss.at](https://wheretheiss.at/w/developer) API for position, altitude and speed
- [Open Notify](http://open-notify.org/) API for the crew list
- GitHub Pages for hosting

## Known limits

- **Crew list:** Open Notify only serves plain HTTP. Browsers block HTTP requests made from an HTTPS page (mixed content), so on the deployed site the crew list shows a fallback message. Fixing it properly needs a small serverless proxy.
- **Trail history:** the trail only covers the time since the page was opened. It does not load past positions.
- **Third-party dependency:** position data comes from a public API. If it is down or rate-limiting, the marker stops updating until it recovers.

## What I learned

- Why the marker is created once and moved afterwards, instead of being added on every update
- How the date line breaks a naive polyline, and how to split it into segments
- Why HTTP APIs break on HTTPS sites, and why `.env` files don't hide keys in a browser-only app
- How Git branches and GitHub Pages fit together: Pages was serving `main`, while my work was on another branch

## Possible next steps

- Countdown to the next visible ISS pass for the viewer's location
- Browser notification shortly before an overhead pass
- Serverless proxy so the crew list works on the HTTPS site

## Credits

Position data: [wheretheiss.at](https://wheretheiss.at). Crew data: [Open Notify](http://open-notify.org/). Map tiles: &copy; OpenStreetMap contributors.
