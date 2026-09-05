# EcoRoute Bharat Features Specification

This document provides a comprehensive explanation of all capabilities and features within **EcoRoute Bharat**. It is written for team members, product owners, evaluators, and stakeholders who want to understand what each feature does, why it exists, and its current implementation state.

> **Problem Statement Alignment**: All features in this platform directly address the requirements of Smart India Hackathon problem statement **SIH26204 (AI-Powered Sustainable Tourism & Destination Decongestion Platform)**. For a detailed requirement-by-requirement mapping, see [PROBLEM_STATEMENT.md](./PROBLEM_STATEMENT.md).

---

## Table of Features

1. [Canonical Destination Spot Page (`/spot/:spotId`)](#1-canonical-destination-spot-page-spotspotid)
2. [3-Tier Fuzzy Search & Intent Resolution (Fuse.js)](#2-3-tier-fuzzy-search--intent-resolution-fusejs)
3. [Algorithmic Demand Diffusion Feed (`/discover`)](#3-algorithmic-demand-diffusion-feed-discover)
4. [Smart 4-Step Trip Wizard & Progressive Profiling (`/plan/new`)](#4-smart-4-step-trip-wizard--progressive-profiling-plannew)
5. [Confirmed Green Yatra Plan & Digital Pass Certificate (`/plan/:tripId`)](#5-confirmed-green-yatra-plan--digital-pass-certificate-plantripid)
6. [Data Tier 1–4 Telemetry Provenance & Confidence Scoring](#6-data-tier-14-telemetry-provenance--confidence-scoring)
7. [Dynamic Carrying Capacity (DCC) Metering](#7-dynamic-carrying-capacity-dcc-metering)
8. [4D Cosine Similarity Twin Destination Recommender](#8-4d-cosine-similarity-twin-destination-recommender)
9. [12-Hour Diurnal Demand Forecasting & Visiting Windows](#9-12-hour-diurnal-demand-forecasting--visiting-windows)
10. [Official Gazette Travel Advisories & Emergency Broadcasts (`/advisories`)](#10-official-gazette-travel-advisories--emergency-broadcasts-advisories)
11. [District GIS Incident & Disaster Command Center (`/authority`)](#11-district-gis-incident--disaster-command-center-authority)
12. [MTDC Homestay & Tour Operator Console (`/provider`)](#12-mtdc-homestay--tour-operator-console-provider)
13. [Multithreaded Telemetry Pipeline & OSM POI Caching](#13-multithreaded-telemetry-pipeline--osm-poi-caching)
14. [24x7 AI Tourism Helpline Assistant ("Sahyadri Guide")](#14-24x7-ai-tourism-helpline-assistant-sahyadri-guide)
15. [Multi-Stakeholder Role Gatekeeper (RBAC) & Profile Gateway (`/account`)](#15-multi-stakeholder-role-gatekeeper-rbac--profile-gateway-account)
16. [Dedicated Portal Workspace Selection Screen (`/`)](#16-dedicated-portal-workspace-selection-screen-)
17. [Dedicated Modern Authentication Page (`/login`) & Fast Demo Profiles](#17-dedicated-modern-authentication-page-login--fast-demo-profiles)
18. [Independent Multi-Portal Token Session Manager (`sessionManager.ts`)](#18-independent-multi-portal-token-session-manager-sessionmanagerts)

---

## 1. Canonical Destination Spot Page (`/spot/:spotId`)

### What it does
Acts as the single authoritative source of truth for every destination in the corridor. Instead of segregating destinations across role-specific screens, every tourist, district collector, and homestay owner accesses the same canonical URL (e.g., `/spot/LON`, `/spot/MAT`, `/spot/BHA`).

### Why it exists
Disconnected role views create fragmented data realities: tourists see one set of information while administrators see another. The canonical model guarantees that all stakeholders share the same ground-truth metrics, with administrative tools conditionally attached directly to the destination.

### How it works
Contains 8 universal sections rendered for all visitors:
1. **Header & GIS Preview**: Hero image, category pill, travel time from hub, and interactive Leaflet map preview with carrying capacity boundary polygon.
2. **Real-Time Crowd & Capacity Telemetry**: DCC status pill (`OPTIMAL`, `MODERATE`, `CRITICAL`), queue delay in minutes, 12h diurnal hourly forecast bar, historical weekly rhythm strip (Mon–Sun), and tap-to-expand Data Tier Provenance breakdown.
3. **Cosine Similarity Twin Alternatives**: Live alternatives with identical aesthetic vibes and available headroom.
4. **Practical Travel Amenities**: Verified homestays/hotels with room counts, OpenStreetMap verified food & clean water points, nearby attractions, and transit directions.
5. **Community Check-Ins**: Crowdsourced congestion ratings (1★–5★) with geofence verification badge.
6. **Active Official Advisories**: Direct dispatches from District Police and Disaster Cells.
7. **Trip CTA & Social Sharing**: 1-click plan integration and WhatsApp-formatted travel card.
8. **Role-Conditional Panels**:
   - **Authority Panel**: Visible only to authenticated officers; enables capacity limit overrides and emergency advisory dispatching.
   - **Provider Panel**: Visible to operators; enables room occupancy updates and off-peak voucher publishing.

### Current Status
DONE (Operational across all Western Ghats destinations).

---

## 2. 3-Tier Fuzzy Search & Intent Resolution (Fuse.js)

### What it does
Provides an un-opinionated, instant autocomplete search bar in the global navigation and landing page that routes queries without guessing or false assumptions.

### Why it exists
Travelers search with varying intent: some type a specific spot name or abbreviation (`LON`, `Lonavala`), others search by district (`Pune`, `Raigad`), and others by state (`Maharashtra`). Treating all queries identically produces confusing search results.

### How it works
Powered by `Fuse.js` with weighted fuzzy thresholds:
- **Tier 1 (Spots)**: Matches destination title, acronym, or category. Clicking immediately opens `/spot/:spotId`.
- **Tier 2 (Districts)**: Matches administrative districts (`Pune`, `Raigad`, `Satara`, `Ahmednagar`). Clicking routes to `/region/district/:name`.
- **Tier 3 (States)**: Matches state names (`Maharashtra`). Clicking routes to `/region/state/:name`.
- **Full Search Fallback**: Submitting a query opens `/search?q=`, displaying categorized cards with crowd status indicators.

### Current Status
DONE.

---

## 3. Algorithmic Demand Diffusion Feed (`/discover`)

### What it does
A personalized discovery feed that surfaces uncrowded and under-visited destinations tailored to the traveler's individual travel vector.

### Why it exists
Popular destinations face excessive concentration because standard search engines rank exclusively by historical popularity. EcoRoute Bharat deliberately applies algorithmic demand diffusion to promote hidden gems.

### How it works
Each destination is scored by a multi-objective formula:
$$\text{Rank Score} = (0.45 \times \text{Travel Style Affinity}) + (0.30 \times \text{Crowd Headroom}) + (0.25 \times \text{UnderVisitedBoost})$$
- Under-visited spots (e.g. Bhandardara, Kas Plateau) receive an automatic +28% algorithmic promotion weight.
- Includes quick-filter chips for Day Trips ($\le 110\text{ km}$), Weekend Getaways ($> 110\text{ km}$), and Under-Visited Only.

### Current Status
DONE.

---

## 4. Smart 4-Step Trip Wizard & Progressive Profiling (`/plan/new`)

### What it does
Generates an eco-balanced, crowd-aware travel itinerary across 4 simple steps, capturing traveler preferences through a progressive profiling modal rather than an intrusive survey.

### Why it exists
Lengthy registration surveys cause user drop-off. Progressive profiling asks only 2 non-intrusive questions (home origin city/state and 4 style tap-cards) when the user saves their trip, immediately delivering value.

### How it works
- **Step 1**: Select primary destination (pre-filled if linked from a Spot Page) and optional secondary stop.
- **Step 2**: Select travel dates (with automatic weekend peak warning).
- **Step 3**: Select budget band (₹, ₹₹, ₹₹₹).
- **Step 4**: Select group dynamic (Solo, Couple, Family, Friends).
- If unauthenticated, prompts the progressive profile modal to compute exact travel distances, ETA, and carbon savings.

### Current Status
DONE.

---

## 5. Confirmed Green Yatra Plan & Digital Pass Certificate (`/plan/:tripId`)

### What it does
Displays the confirmed multi-day itinerary with an official, printable **Government Verified Green Pass Certificate** featuring a verifiable QR code and MTDC homestay discount voucher.

### Why it exists
Incentivizes tourists to bypass overcrowded bottleneck hubs by awarding tangible commercial discounts at eco-friendly homestays in twin destinations.

### How it works
- Outlines day-by-day morning, afternoon, and evening slots optimized to avoid peak congestion hours.
- Computes total carbon emissions avoided (e.g. `~18.5 kg CO2 Saved`).
- Generates a unique Green Pass voucher code (`ECO-MH-...`) offering 15%–30% discounts redeemable at accredited homestays.
- Includes 1-click WhatsApp itinerary sharing and print formatting.

### Current Status
DONE.

---

## 6. Data Tier 1–4 Telemetry Provenance & Confidence Scoring

### What it does
Displays a transparent, expandable audit breakdown of every sensor reading on the canonical Spot Page, along with an authoritative confidence score (50%–98%).

### Why it exists
Citizens and district administrators need to trust the numbers. Black-box estimations breed skepticism; showing the exact data source, refresh timestamp, and fallback status establishes credibility.

### How it works
- **Tier 1 (Ground-Truth)**: Toll gate FASTag counts, parking geofences, and municipal check-in counts.
- **Tier 2 (Calibrated Live Feeds)**: Open-Meteo weather hazard, TomTom highway delay, and BestTime attraction busyness.
- **Tier 3 (Algorithmic Rhythm)**: 7-day historical weekly diurnal models used when live sensors are unavailable.
- **Tier 4 (Statutory Baseline)**: Authoritative carrying capacity citations (e.g., *Maharashtra Forest Dept Carrying Capacity Study 2023*).
- **Confidence Formula**: Dynamic calculation based on live sensor health and community ground-truth reports.

### Current Status
DONE.

---

## 7. Dynamic Carrying Capacity (DCC) Metering

### What it does
Calculates a mathematical index between 0.00 and 1.00 that represents the real-time operational strain and ecological capacity of any tourist destination.

### How it works
$$\text{DCC} = (0.70 \times \text{Capacity Utilization}) + (0.30 \times \text{Weather Hazard Risk})$$
- **OPTIMAL (< 0.70)**: Normal visiting conditions.
- **MODERATE (0.70 – 0.84)**: Approaching capacity; advisory warnings active.
- **CRITICAL ($\ge 0.85$)**: Severe congestion or severe weather; queue delay in minutes calculated and twin alternatives triggered.

### Current Status
DONE.

---

## 8. 4D Cosine Similarity Twin Destination Recommender

### What it does
Recommends alternate destinations that share aesthetic, budget, and cultural characteristics with an overcrowded spot, but have low DCC pressure.

### How it works
Computes normalized cosine similarity across 4 feature dimensions:
$$\text{Features} = [\text{Scenic}, \text{Budget}, \text{Adventure}, \text{Family}]$$
$$\text{Utility} = (0.60 \times \text{Similarity}) + (0.40 \times (1.0 - \text{DCC}_{\text{candidate}}))$$

### Current Status
DONE.

---

## 9. 12-Hour Diurnal Demand Forecasting & Visiting Windows

### What it does
Displays a 12-hour hourly forecast strip (06:00 AM – 06:00 PM) indicating when crowd pressure will peak and highlighting the optimal time window to visit.

### Current Status
DONE.

---

## 10. Official Gazette Travel Advisories & Emergency Broadcasts (`/advisories`)

### What it does
A centralized, searchable official bulletin board for urgent public advisories dispatched by District Disaster Management Cells and Highway Police.

### How it works
- Supports severity tiers: `critical` (red alert), `high` (severe warning), `medium` (caution), and `low` (informational).
- Each advisory links directly into the affected destination's live Spot Page.
- Authorized officers can dispatch advisories directly from any Spot Page or the Authority Command Center.

### Current Status
DONE.

---

## 11. District GIS Incident & Disaster Command Center (`/authority`)

### What it does
An operational dashboard for District Magistrates and Police Superintendents to monitor corridor-wide carrying capacity and test mitigation policies.

### How it works
- Corridor KPI statistics bar (Total Inflow, Capacity Utilization, Critical Hubs Count, Active Advisories).
- Full Leaflet GIS corridor map with interactive spot markers and status rings.
- **Policy Impact Simulator**: Interactive capacity throttle slider predicting queue time reductions before issuing public restrictions.
- Threshold monitoring table that drills down into each destination's canonical Spot Page.

### Current Status
DONE (Provisional hub integrated with canonical spot pages).

---

## 12. MTDC Homestay & Tour Operator Console (`/provider`)

### What it does
A dashboard for registered local hospitality businesses to manage property visibility, monitor local crowd trends, and publish off-peak tourist incentives.

### How it works
- Aggregates registered homestay and hotel listings across Western Ghats hubs.
- Direct links to manage occupancy and publish promotional discount vouchers on each spot's canonical page.

### Current Status
DONE (Provisional hub integrated with canonical spot pages).

---

## 13. Multithreaded Telemetry Pipeline & OSM POI Caching

### What it does
A background telemetry pipeline in the Python backend that concurrently gathers live data for all destinations every 60 seconds without connection drops or blocking requests.

### How it works
- `ThreadingHTTPServer` handles asynchronous client requests.
- `ThreadPoolExecutor` parallelizes API calls across all monitored destinations.
- In-memory OpenStreetMap Overpass cache avoids API rate-limiting.
- Zero-latency in-memory cache responds to client polling in under 2ms.

### Current Status
DONE.

---

## 14. 24x7 AI Tourism Helpline Assistant ("Sahyadri Guide")

### What it does
A persistent floating AI chat widget that answers visitor questions in natural language, grounded in live corridor conditions and safety advisories.

### Current Status
DONE.

---

## 15. Multi-Stakeholder Role Gatekeeper (RBAC) & Profile Gateway (`/account`)

### What it does
Manages traveler identity, origin preferences, travel style affinities, and active role profile details with modern session inspection.

### Current Status
DONE.

---

## 16. Dedicated Portal Workspace Selection Screen (`/`)

### What it does
A clean, centralized launchpad (`PortalSelectPage.tsx`) serving as the gateway to the 4 isolated stakeholder environments:
1. **Citizen & Tourist Experience** (`/tourist`)
2. **District Incident Command GIS** (`/authority`)
3. **MTDC Hospitality & Provider Console** (`/provider`)
4. **Developer Diagnostic & Compliance Lab** (`/dev`)

### Why it exists
Combining all administrative and diagnostic controls into the tourist header created visual clutter, leaked internal tools to tourists, and undermined credibility for official operations. The dedicated workspace screen provides clear domain separation.

### How it works
- Each workspace card highlights key capabilities, active session state, and target user personas.
- Includes 1-click launch buttons and instant demo bootstrap for seamless evaluator access.
- Accessible directly at `/`, `/select-portal`, and `/portals`.

### Current Status
DONE.

---

## 17. Dedicated Modern Authentication Page (`/login`) & Fast Demo Profiles

### What it does
A dedicated, full-page authentication interface (`AuthPage.tsx`) offering role-based sign-in, account creation, password visibility toggles, and 1-click fast demo credentials.

### Why it exists
Intrusive modal popups and unstyled forms degrade user experience. A dedicated modern login screen reflects industry standards (Stripe/Linear style) and makes multi-stakeholder testing effortless.

### How it works
- **Role Selector Tabs**: Switch between Tourist, District Authority, MTDC Provider, and Dev Diagnostics.
- **1-Click Fast Demo Accounts**:
  - **Dr. Rajeshwar Patil (IAS)** — State & Pune Disaster Management
  - **Vikram Shinde (IPS)** — Raigad District Police
  - **Suresh Gaikwad** — Matheran Homestay Operator
  - **Ananya Deshmukh** — Lead Systems Engineer
- **Security**: Validates credentials against the backend API, generates 7-day cryptographic tokens, and redirects back to the user's requested portal.

### Current Status
DONE.

---

## 18. Independent Multi-Portal Token Session Manager (`sessionManager.ts`)

### What it does
Manages independent, role-isolated authentication sessions in `localStorage`, permitting multiple stakeholder roles to remain concurrently logged in without session overwrites.

### Why it exists
In multi-stakeholder demonstrations, evaluators frequently switch between viewing the tourist feed and testing district authority emergency overrides. A shared single-user session required repeatedly logging in and out. Independent sessions enable true multi-persona workflows.

### How it works
- Stores sessions under role-scoped keys: `ecoroute_session_tourist`, `ecoroute_session_authority`, `ecoroute_session_provider`, and `ecoroute_session_developer`.
- Validates token validity and 7-day expiration timestamps on every guarded route transition.
- Supports independent single-workspace logout without terminating active sessions in other portals.
- Synchronizes seamlessly with the central Zustand application store (`useCorridorStore.ts`).

### Current Status
DONE.
