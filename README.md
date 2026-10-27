# Unfold Dhaka

A full-screen Greater Dhaka explorer built with Next.js, TypeScript and MapLibre GL. The primary experience is an interactive 3D map, inspired by the walkable map experience in [Cholo Puran Dhaka](https://github.com/SifatSwapnil2022/cholo-puran-DHAKA).

## Implemented

### Phase 2 — 3D city map
- Full-viewport, pitched 3D map. There is no 2D map mode or 2D/3D switch.
- MapLibre GL using the OpenFreeMap Liberty style and OpenStreetMap-based vector tiles.
- Extruded building geometry where the source data provides building footprints and height attributes.
- Orbit, pan, rotate, pitch, zoom, compass and scale controls.
- Map markers for curated Greater Dhaka landmarks; selecting a place flies the camera to it.
- Area filters, category filters, English/Bangla place names, and responsive map overlays.

### Phase 3 — Explore and navigate
- Add places to a custom journey, remove stops and load curated starter itineraries.
- Draw a route through selected stops using the public OpenStreetMap-based foot-routing service.
- Display route geometry on the 3D map, distance and an approximate duration from the routing response.
- Save and unsave favourite places in browser local storage.
- Optional browser geolocation and nearest-place ordering; the coordinates are handled in the browser.
- Place detail cards, neighbourhood filtering and search.

## Current data limitations

The app currently has a **starter set of 16 curated places**, not exhaustive coverage of Greater Dhaka. Place hours are explicitly marked as unverified. Building extrusion depends on the coverage and quality of the public vector tiles; it does not mean every building has a verified height or detailed 3D model. Routing and map tiles depend on third-party public services and network access, and their availability or usage limits can change.

Walking distance/time are routing-service estimates, not guaranteed travel times. Verify opening hours, access conditions and place details before travelling.

## Stack

- Next.js 15 / React 19 / TypeScript
- MapLibre GL JS
- OpenFreeMap Liberty vector style and OpenStreetMap-based data
- Public OpenStreetMap-based foot-routing service

## Local development

Install dependencies with npm install, then run npm run dev.

## Attribution and service policies

Keep visible map attribution. Review the [OpenFreeMap](https://openfreemap.org/) and [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/) before scaling traffic or introducing offline tile caching.
