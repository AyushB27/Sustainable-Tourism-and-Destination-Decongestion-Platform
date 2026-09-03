# EcoRoute Bharat Features Specification

This document provides a comprehensive, non-technical explanation of all capabilities and features within **EcoRoute Bharat**. It is written for team members, product owners, evaluators, and stakeholders who want to understand what each feature does, why it exists, and its current implementation state.

> **Problem Statement Alignment**: All features in this platform directly address the requirements of Smart India Hackathon problem statement **SIH26204 (AI-Powered Sustainable Tourism & Destination Decongestion Platform)**. For a detailed requirement-by-requirement mapping, see [PROBLEM_STATEMENT.md](./PROBLEM_STATEMENT.md).

---

## Table of Features

1. [Multi-Stakeholder Role Gatekeeper (RBAC)](#1-multi-stakeholder-role-gatekeeper-rbac)
2. [Live Corridor Telemetry & Sensor Monitoring](#2-live-corridor-telemetry--sensor-monitoring)
3. [Dynamic Carrying Capacity (DCC) Metering](#3-dynamic-carrying-capacity-dcc-metering)
4. [4D Vector Cosine Similarity Twin Destination Recommender](#4-4d-vector-cosine-similarity-twin-destination-recommender)
5. [Public Citizen & Tourist Experience Portal](#5-public-citizen--tourist-experience-portal)
6. [12-Hour Diurnal Demand Forecasting & Visiting Windows](#6-12-hour-diurnal-demand-forecasting--visiting-windows)
7. [Multi-Day Decongested Holiday Itinerary Planner](#7-multi-day-decongested-holiday-itinerary-planner)
8. [Digital Green Yatra Pass with Toll Plaza QR Voucher](#8-digital-green-yatra-pass-with-toll-plaza-qr-voucher)
9. [District GIS Incident & Disaster Command Center](#9-district-gis-incident--disaster-command-center)
10. [Ecological Vulnerability Gauges & Emergency Entry Controls](#10-ecological-vulnerability-gauges--emergency-entry-controls)
11. [Regional Tourist Mobility Diffusion Matrix](#11-regional-tourist-mobility-diffusion-matrix)
12. [MTDC Accredited Homestay & Operator Console](#12-mtdc-accredited-homestay--operator-console)
13. [Off-Peak Subsidy Schemes & Promotional Vouchers](#13-off-peak-subsidy-schemes--promotional-vouchers)
14. [24x7 AI Tourism Helpline Assistant ("Sahyadri Guide")](#14-24x7-ai-tourism-helpline-assistant-sahyadri-guide)
15. [Trilingual Accessibility (English, Hindi, Marathi)](#15-trilingual-accessibility-english-hindi-marathi)

---

## 1. Multi-Stakeholder Role Gatekeeper (RBAC)

### What it does
Protects administrative, law-enforcement, and hospitality operations behind a role-gated authentication gateway styled after the Government of India's *Jan Parichay* portal.

### Why it exists
Different stakeholders require tailored tools: tourists need travel discovery, police officers need emergency broadcast tools, and homestay owners need room occupancy controls. Sensitive controls must not be accessible to casual visitors.

### How it works
The portal manages three explicit roles:
- **Tourist / Citizen**: Unrestricted access to crowd meters, twin recommendations, and travel passes.
- **District Authority**: Restricted access to the GIS Command Center, emergency broadcast dispatcher, and carrying capacity threshold tables.
- **Tourism Provider**: Restricted access to homestay room occupancy reporting and off-peak discount publishing.

Attempting to switch to Authority or Provider roles opens an authentication dialog featuring 1-click verified demo profiles (Pune District Collector IAS, Raigad Police SP IPS, Matheran Homestay Operator) as well as credential inputs.

### User Experience
Users select their portal from the top navigation bar or mobile drawer. Switching to an administrative view instantly prompts the officer login modal. Logging in grants immediate access, displaying an official badge and department attribution in the header.

### Current Status
DONE

### Limitations
Uses a pre-configured in-memory stakeholder credentials directory and local fallback storage rather than a live government single sign-on (SSO) OAuth server.

---

## 2. Live Corridor Telemetry & Sensor Monitoring

### What it does
Continuously tracks environmental weather hazards, vehicular highway delays, attraction footfall busyness, and infrastructure capacity across 7 key destinations in Maharashtra's Western Ghats.

### Why it exists
Weekend travelers typically head toward popular spots without knowing current conditions, discovering severe highway gridlocks or landslide closures only after arriving. Real-time multi-source data enables early proactive decisions.

### How it works
A background pipeline executes every 60 seconds, combining data from:
- **Open-Meteo**: Measures live rainfall (mm/hr), wind velocity, and ambient temperature, computing an environmental landslide/hazard score.
- **TomTom Traffic Flow**: Measures vehicular speed reductions and congestion multipliers along mountain access highways.
- **BestTime.app**: Measures attraction footfall density and venue saturation.
- **OpenStreetMap Overpass**: Counts registered parking facilities and scenic viewpoints within a 3km radius.
- **Open Government Data (data.gov.in)**: Ingests official state tourism baselines and growth rates.

### User Experience
Users see live status pills (`🟢 Python Live Sensors Active`) in the portal header. Selecting any destination reveals live temperature, weather conditions, highway delay estimates (+45 mins), and parking occupancy percentages.

### Current Status
PARTIAL

### Limitations
In production, external API keys for TomTom and BestTime must be configured; when running locally without keys, the system operates on realistic heuristic weekend diurnal models.

---

## 3. Dynamic Carrying Capacity (DCC) Metering

### What it does
Calculates a mathematical index between 0.00 and 1.00 that represents the operational load and safety threshold of any tourist destination.

### Why it exists
Static carrying capacity (e.g., maximum daily visitors) ignores real-world conditions like heavy downpours, fog, or vehicle breakdowns on narrow mountain passes. A dynamic score accurately reflects whether a destination is safe and enjoyable right now.

### How it works
The DCC index balances physical capacity against current inflow, weighted by weather hazards:
$$\text{DCC} = (0.70 \times \text{Capacity Utilization}) + (0.30 \times \text{Weather Hazard Risk})$$

The score is classified into three plain-text operational tiers:
- **OPTIMAL (< 0.70)**: Safe, free-flowing tourist experience.
- **MODERATE (0.70 – 0.84)**: Approaching saturation; queues may begin forming.
- **CRITICAL (≥ 0.85)**: Severe overcrowding, parking exhaustion, or environmental hazard. Queuing delays are calculated in minutes.

### User Experience
Destinations display clear colored meters: green for Optimal, yellow for Moderate, and bold red for Critical Overload. Overloaded destinations display explicit queue estimates (e.g., "+45 mins on ghat road").

### Current Status
DONE

### Limitations
Dwell time currently relies on destination-specific baseline averages (3.0 to 5.0 hours) rather than individual GPS tracking.

---

## 4. 4D Vector Cosine Similarity Twin Destination Recommender

### What it does
Analyzes overcrowded destinations and traveler preferences to recommend certified, uncrowded "twin destinations" that offer the same scenic vibe, activities, and budget profile.

### Why it exists
Telling a tourist "do not go to Lonavala" rarely works because they have already planned a vacation. Recommending a specific, equally beautiful spot just 35 minutes away with 80% fewer crowds and hotel discounts provides an actionable, positive alternative.

### How it works
Every destination is mapped into a 4-dimensional feature vector:
1. **Scenic**: Waterfalls, viewpoints, green valleys.
2. **Budget**: Pocket-friendly accommodations and dining.
3. **Adventure**: Trekking trails, water sports, forts.
4. **Family**: Paved walkways, child-friendly amenities, accessibility.

When a tourist searches for an overloaded destination, the engine blends the destination's profile with the tourist's selected preference tags (e.g., prioritizing Scenic + Family) and computes the mathematical cosine angle against all unsaturated destinations (DCC < 0.70). The best matches are ranked using a multi-objective utility score balancing vibe match and available crowd headroom.

### User Experience
When viewing an overloaded spot (such as Lonavala), the user sees prominent recommendation cards highlighting certified twins (e.g., Matheran Eco-Zone or Bhandardara). Each card displays the match score (e.g., "94% Vibe Match"), driving time comparison, crowd reduction ("80% Fewer Crowds"), and an animated reroute button.

### Current Status
PARTIAL

### Limitations
The underlying mathematical engine is complete and verified in both backend and frontend, but the primary `TouristView.tsx` screen currently displays a fixed Lonavala-to-Matheran comparison card created for hackathon demos.

---

## 5. Public Citizen & Tourist Experience Portal

### What it does
A modern, responsive public web portal designed for citizens to plan unhurried vacations across Maharashtra and the Western Ghats.

### Why it exists
Empowers tourists with transparent information before they depart, helping them avoid stressful traffic jams, overcrowded attractions, and unsafe weather conditions.

### How it works
Presents a landscape layout with quick search, category filters (Hill Stations, Coastal & Beaches, Heritage Forts, Lakes & Waterfalls), live crowd meters, twin alternative cards, hourly departure schedules, and digital green passes.

### User Experience
A tourist opens the site, searches for their intended getaway, instantly sees if it is overcrowded, and can choose an alternative destination with a single click.

### Current Status
PARTIAL

### Limitations
The modular components (`HeroDCCStatus.tsx`, `TouristFilters.tsx`, `TwinAlternativeCards.tsx`, `DemandCurveChart.tsx`, `FutureTripPlanner.tsx`, `EcoPassCard.tsx`) exist in the codebase but are currently unlinked in `TouristView.tsx` in favor of a fixed demo layout.

---

## 6. 12-Hour Diurnal Demand Forecasting & Visiting Windows

### What it does
Forecasts hour-by-hour tourist velocity and checkpoint wait times from 06:00 AM to 06:00 PM.

### Why it exists
Many tourist spots are overcrowded only during specific peak midday hours (11:00 AM – 03:00 PM). Providing hourly arrival curves helps travelers depart during early dawn or late afternoon off-peak windows.

### How it works
Uses Gaussian diurnal surge modeling based on historical weekend arrival patterns, combined with current day inflow baselines, to project arrival curves and pinpoint optimal green-window visiting slots.

### User Experience
Tourists inspect an interactive Area chart that visually charts anticipated visitor volume throughout the day. Below the chart, 4 distinct departure slots (Dawn, Morning, Afternoon, Evening) show anticipated highway conditions and potential time savings.

### Current Status
PARTIAL

### Limitations
The forecast endpoint and Recharts chart component are operational, but the chart is not yet embedded into the main tourist container.

---

## 7. Multi-Day Decongested Holiday Itinerary Planner

### What it does
Generates personalized 1-day, 2-day, or 3-day travel itineraries that guide tourists through decongested routes and scenic twin spots.

### Why it exists
Weekend tourists often struggle with trip planning and default to well-known, overcrowded routes. A structured itinerary distributes visitors across multiple points of interest.

### How it works
The planner accepts travel date, duration, and style (Scenic, Adventure, Family, Budget). It schedules early morning arrivals at key viewpoints before peak crowds, routes afternoon hours through peaceful eco-zones, and recommends accredited MTDC homestays.

### User Experience
Tourists select their travel weekend and duration to generate a clear schedule detailing arrival times, recommended activities, estimated time saved (e.g. "Save 110 mins"), and a 1-click print export button.

### Current Status
PARTIAL

### Limitations
Backend itinerary generation is verified, but frontend currently renders a static 2-day sample card in the tourist layout.

---

## 8. Digital Green Yatra Pass with Toll Plaza QR Voucher

### What it does
Issues an official digital green travel voucher with a unique pass ID and dynamic QR code to travelers who choose under-visited twin destinations.

### Why it exists
Incentivizes positive travel choices by providing tangible recognition, potential fast-track toll perks, and clear feedback on carbon footprint reductions.

### How it works
When a traveler reroutes to a certified eco-twin, the system issues a pass (e.g. `ECO-MH-2026-092`), calculates estimated avoided CO₂ emissions based on bypassed highway idling, and generates a verification QR code payload.

### User Experience
Tourists see an official voucher with their name, destination, carbon saved (~18.5 kg CO₂), and a prominent QR code suitable for saving on a mobile device or presenting at participating checkpoints.

### Current Status
PARTIAL

### Limitations
Pass generation currently updates local frontend state; the backend `POST /api/passes/issue` endpoint exists but is not yet triggered by the frontend reroute action.

---

## 9. District GIS Incident & Disaster Command Center

### What it does
An administrative command dashboard providing district authorities with real-time geographic oversight of tourism density, road hazards, and active emergencies.

### Why it exists
District collectors, police chiefs, and disaster management officers need centralized situational awareness across multi-district corridors to dispatch personnel, enforce traffic diversions, and issue public warnings.

### How it works
Integrates an interactive Leaflet GIS map with custom markers, color-coded capacity circles (green, amber, pulsing red), detailed destination telemetry popups, corridor KPI summary metrics, and destination threshold comparison tables.

### User Experience
District officials log in, view high-level metrics (total active visitors, critical red zones, capacity utilization), click on map pins to inspect specific choke points, and monitor real-time sensor updates.

### Current Status
DONE

### Limitations
Currently tracks 7 predefined Western Ghats destinations in Maharashtra; adding new destinations requires updating configuration registries.

---

## 10. Ecological Vulnerability Gauges & Emergency Entry Controls

### What it does
Enables authorities to monitor environmental strain (vegetation stress, water availability, wildfire risk) and simulate municipal vehicle entry restrictions during critical alerts.

### Why it exists
Fragile highland ecosystems experience acute resource degradation during peak tourist influxes. Authorities require both environmental monitoring and direct levers to test carrying capacity adjustments.

### How it works
Displays localized environmental health gauges and interactive sliders that allow authorities to reduce baseline capacity caps (e.g., imposing an emergency 50% vehicle restriction during landslide threats).

### User Experience
Officials view clear ecological status bars and can adjust vehicle entry cap sliders to test the impact of administrative diversions on corridor-wide capacity scores.

### Current Status
DONE

### Limitations
Simulated capacity adjustments currently update frontend state and do not trigger physical automated toll gate barriers.

---

## 11. Regional Tourist Mobility Diffusion Matrix

### What it does
Visualizes how tourist traffic from primary urban hubs (Mumbai, Pune, Thane) disperses into Sahyadri mountain gateways.

### Why it exists
Decongestion requires understanding where tourists originate. Managing traffic at urban exit points is far more effective than trying to manage bottlenecks after vehicles have already entered narrow mountain roads.

### How it works
Calculates origin-destination flow shares and recommends strategic alternate routes (e.g., diverting Mumbai-bound vehicles via northern bypasses to circumvent the Khandala tunnel bottleneck).

### User Experience
Officials click on an origin city (e.g., Pune) to view the percentage split of holiday traffic headed to Lonavala, Mahabaleshwar, or coastal getaways, along with active diversion recommendations.

### Current Status
DONE

### Limitations
Flow percentages are based on calibrated model estimates rather than real-time mobile cellular tower triangulation data.

---

## 12. MTDC Accredited Homestay & Operator Console

### What it does
A specialized console for local homestay hosts, hotel managers, and tour operators to manage property visibility and report live room occupancy.

### Why it exists
Local hospitality operators are essential partners in sustainable tourism. Real-time room availability data prevents tourists from traveling to saturated towns with no available lodging.

### How it works
Operators log in using their MTDC registration ID, select their property, and update room vacancy counters using an interactive occupancy slider. The console also displays the destination's 12-hour predicted tourist arrival curve.

### User Experience
A homestay owner adjusts their room occupancy slider to report 85% occupancy, immediately seeing the impact on local capacity metrics and reviewing expected arrival peaks for the evening.

### Current Status
DONE

### Limitations
Occupancy updates are currently maintained in active application state; persistent storage in the backend database requires completing the provider sync endpoint.

---

## 13. Off-Peak Subsidy Schemes & Promotional Vouchers

### What it does
Allows accredited tourism operators to publish special discount coupons (e.g., 25% off homestay bookings) to encourage tourists to visit during off-peak windows or travel to under-visited twin spots.

### Why it exists
Financial incentives are one of the most effective ways to shift tourist demand from overcrowded weekends to weekdays or from crowded hubs to rural homestays.

### How it works
Operators submit promotional campaigns detailing discount percentages, validity periods, and voucher codes (e.g. `HOMESTAY25`). Active subsidies are automatically attached to twin recommendation cards shown to tourists.

### User Experience
An operator publishes a weekend promo voucher; tourists viewing the matching twin destination see a badge advertising the discount code with instructions for claiming it.

### Current Status
PARTIAL

### Limitations
Promotions are defined in frontend data and Zustand state; the backend database table exists, but the corresponding REST API endpoints for publishing new promotions need to be added.

---

## 14. 24x7 AI Tourism Helpline Assistant ("Sahyadri Guide")

### What it does
A floating conversational AI chatbot widget representing the National Tourism Helpline (1363), answering tourist queries about crowd conditions, weather warnings, and route suggestions.

### Why it exists
Tourists want quick, conversational answers without digging through complex charts and tables.

### How it works
The bot provides quick-prompt chips ("Is Lonavala crowded right now?", "Alternative to Alibaug beaches?", "Live Weather & Rain Alert") and evaluates tourist questions against live destination telemetry to formulate grounded, factual replies.

### User Experience
A visitor clicks the bottom-right chat bubble, selects a quick question or types their own, and receives an immediate response with live visitor numbers, delay estimates, and twin spot suggestions.

### Current Status
PARTIAL

### Limitations
The bot currently runs on an intelligent client-side keyword matcher and response generator; the backend `POST /api/ai/chat` endpoint is operational but not yet wired to the frontend widget.

---

## 15. Trilingual Accessibility (English, Hindi, Marathi)

### What it does
Provides user interface localization in English, Hindi (हिन्दी), and Marathi (मराठी).

### Why it exists
Ensures complete accessibility for local residents, regional district officers, and domestic tourists from across India.

### How it works
A comprehensive translation dictionary covers more than 55 interface keys across all three languages in `frontend/src/lib/i18n.ts`.

### User Experience
Users will be able to toggle their preferred language from the top navigation bar to render all portal headers, buttons, and alert notices in their chosen language.

### Current Status
PARTIAL

### Limitations
The translation dictionary is fully compiled, but the language switcher UI dropdown is not yet wired to switch active dictionary state across all components.
