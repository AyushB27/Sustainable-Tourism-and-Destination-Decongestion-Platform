# System Architecture & Technical Design

This document details the internal technical architecture, component structure, data flow pipelines, and mathematical models powering **EcoRoute Bharat**.

---

## 1. High-Level System Architecture

EcoRoute Bharat is engineered as a decoupled, multi-tier system composed of a client-side reactive web portal, a multithreaded Python API and telemetry ingestion engine, a persistent SQLite time-series store, and multiple external sensor pipelines.

The platform follows a **Tourist-First Canonical Destination Architecture**: every destination has exactly one canonical page at `/spot/:spotId` containing universal tourist intelligence. Administrative and business roles conditionally compose operational management panels directly onto this canonical page.

```mermaid
graph TD
    subgraph External Sensors & Government Data
        OM[Open-Meteo API<br/>Rainfall, Wind, Temp]
        TT[TomTom Traffic Flow API<br/>Speed & Congestion Delays]
        BT[BestTime.app API<br/>Attraction Footfall]
        OSM[OpenStreetMap Overpass<br/>Parking & Viewpoint Nodes]
        OGD[data.gov.in<br/>State Tourism Baselines]
    end

    subgraph Backend Engine & Ingestion (Python 3.13)
        BW[Background Telemetry Worker<br/>60s Daemon Thread]
        TPE[ThreadPoolExecutor<br/>Parallel Hub Processing]
        ENG_DCC[DCC Calculator Engine<br/>dcc_calculator.py]
        ENG_TWIN[4D Cosine Twin Matcher<br/>twin_matcher.py]
        ENG_ITIN[Itinerary Planning Engine<br/>itinerary_engine.py]
        OSM_CACHE[(In-Memory POI Cache)]
        MEM_CACHE[(In-Memory Telemetry Cache)]
        HTTP_SRV[ThreadingHTTPServer REST API<br/>main.py :8000]
    end

    subgraph Persistence Tier
        SQLITE[(SQLite 3 Database<br/>ecoroute.db - WAL Mode)]
    end

    subgraph Frontend Presentation Tier (React 19 + TypeScript + Router)
        PORTAL_GATEWAY[Workspace Gateway /<br/>PortalSelectPage.tsx]
        AUTH_PAGE[Dedicated Auth /login<br/>AuthPage.tsx]
        SESSION_MGR[Multi-Portal Session Manager<br/>sessionManager.ts]
        ROLE_GUARD[RoleGuard Component<br/>Independent RBAC Protection]
        ROUTER[React Router DOM v7<br/>Isolated Layout Shells]
        
        subgraph Isolated Layout Shells
            TOURIST_SHELL[TouristLayout.tsx<br/>/tourist, /discover, /plan, /spot]
            AUTH_SHELL[AuthorityLayout.tsx<br/>/authority Incident Command]
            PROV_SHELL[ProviderLayout.tsx<br/>/provider Operator Console]
            DEV_SHELL[DevLayout.tsx<br/>/dev Diagnostic Lab]
        end

        SEARCH[GlobalSearchBox.tsx<br/>Fuse.js 3-Tier Fuzzy Search]
        ZUSTAND[Zustand Central Store<br/>useCorridorStore.ts]
        SPOT_HOOK[useSpotData Hook<br/>Single Source of Truth]
        CANONICAL_SPOT[Canonical Spot Page<br/>/spot/:spotId]
        UNIVERSAL_SECTIONS[Universal Sections §3.1<br/>Crowd, Forecast, Provenance, Twins, Amenities]
        CONDITIONAL_PANELS[Role-Conditional Panels §3.2<br/>Authority Overrides & Provider Vouchers]
    end

    %% Ingestion Flow
    OM -->|HTTP GET| TPE
    TT -->|HTTP GET / Fallback| TPE
    BT -->|HTTP GET / Fallback| TPE
    OSM -->|Overpass Query + Cache| OSM_CACHE
    OSM_CACHE --> TPE
    OGD -->|Resource API| TPE

    BW --> TPE
    TPE --> ENG_DCC
    ENG_DCC --> MEM_CACHE
    TPE -->|Write sensor_readings| SQLITE

    %% API Server
    MEM_CACHE --> HTTP_SRV
    ENG_TWIN --> HTTP_SRV
    ENG_ITIN --> HTTP_SRV
    SQLITE <-->|Read / Write| HTTP_SRV

    %% Client Routing & Flow
    HTTP_SRV -->|GET /api/destinations/live| ZUSTAND
    ZUSTAND --> ROUTER
    PORTAL_GATEWAY -->|1-Click Launch| ROUTER
    AUTH_PAGE -->|Role Login| SESSION_MGR
    SESSION_MGR -->|Hydrate User| ZUSTAND
    ROUTER --> ROLE_GUARD
    ROLE_GUARD --> AUTH_SHELL
    ROLE_GUARD --> PROV_SHELL
    ROLE_GUARD --> DEV_SHELL
    ROUTER --> TOURIST_SHELL
    TOURIST_SHELL --> SEARCH
    SEARCH -->|Tier 1: Spots| CANONICAL_SPOT
    SEARCH -->|Tier 2 & 3: Regions| TOURIST_SHELL
    AUTH_SHELL -->|Inspect Destination| CANONICAL_SPOT
    PROV_SHELL -->|Manage Listing| CANONICAL_SPOT
    ZUSTAND --> SPOT_HOOK
    SPOT_HOOK --> CANONICAL_SPOT
    CANONICAL_SPOT --> UNIVERSAL_SECTIONS
    CANONICAL_SPOT --> CONDITIONAL_PANELS
```

---

## 2. Backend Architecture

### 2.1 Concurrency & Multithreading (`backend/main.py`)
The backend is built with Python's standard library `http.server.ThreadingHTTPServer` to achieve asynchronous, concurrent request processing without heavy third-party framework overhead:
- **Multithreading**: Each incoming HTTP client request is dispatched to a dedicated thread, preventing slow client connections from causing `ConnectionResetError` or blocking other users.
- **Cross-Origin Resource Sharing (CORS)**: Sends full headers (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Private-Network: true`) supporting cross-origin local and LAN environments.
- **Windows UTF-8 Encoding**: Configures `sys.stdout` and `sys.stderr` with UTF-8 encoding replacement to prevent charmap `UnicodeEncodeError` in Windows PowerShell/Command Prompt.
- **Automated OpenApi / Swagger UI**: Serves interactive documentation natively at `/docs` backed by `/openapi.json`.

### 2.2 Concurrent Background Telemetry Pipeline (`backend/app/background_worker.py`)
A continuous daemon thread (`_worker_thread`) triggers full multi-source sensor cycles every 60 seconds:
- **Parallel Processing**: Uses `concurrent.futures.ThreadPoolExecutor` to process all 7 Western Ghats destinations simultaneously.
- **OSM POI In-Memory Caching**: Overpass queries are cached in `_osm_cache` by coordinate grid `(round(lat, 3), round(lon, 3))` to avoid rate-limiting and eliminate latency bottlenecks.
- **Batched Persistence**: Writes snapshot rows into SQLite `sensor_readings` in a single WAL transaction.
- **Zero-Latency In-Memory Snapshot**: Updates `_telemetry_cache` to serve client requests in `< 2ms`.

### 2.3 Sensor Ingestion Pipelines (`backend/app/pipelines/`)
All external pipeline modules are **fail-soft**:

1. **Weather Pipeline (`weather_pipeline.py`)**:
   - Queries `api.open-meteo.com` for rainfall (mm/hr), wind velocity, and ambient temperature.
   - Computes an environmental hazard score:
     $$\text{Hazard Score} = \min\left(1.0, \, \frac{\text{Rain mm}}{15.0} \times 0.70 + \frac{\text{Wind km/h}}{50.0} \times 0.30\right)$$

2. **Traffic Pipeline (`traffic_pipeline.py`)**:
   - Queries TomTom Traffic Flow API for highway delay multipliers.
   - Applies an automatic diurnal weekend fallback (2.1x during weekend peaks, 1.4x standard weekend, 1.05x weekday).

3. **Footfall Pipeline (`footfall_pipeline.py`)**:
   - **BestTime.app Public API Architecture**: Integrates live attraction footfall busyness using client public API keys (`pub_...`). Because BestTime public keys are restricted to pre-registered venue queries via `/api/v1/venues/weekly?venue_id={id}&api_key_public={key}` (rejecting arbitrary text scraping), the pipeline implements an Archetype Venue Profile Registry (`DESTINATION_VENUE_PROFILES`).
   - **Archetype Venue Mappings & Calibration**: Maps all 7 monitored Western Ghats destinations to 3 verified operational archetype venue IDs:
     - `ven_454e3869426f324831637752414349344c4a4c585047714a496843` (High-traffic hill resort corridors): Lonavala & Khandala (multiplier: 1.05×) and Mahabaleshwar (1.02×).
     - `ven_5138374d6b63795155453052414349344c4a4c585047714a496843` (Eco-sensitive & heritage plateaus): Matheran Eco-Sensitive (0.95×) and Kas Plateau UNESCO (0.80×).
     - `ven_6f39344158434a584a517052414349344c4a4c585047714a496843` (Coastal & serene lake getaways): Alibaug Coastal (0.88×), Bhandardara Heritage (0.78×), and Tapola Agro-Tourism (0.72×).
   - **Dual-Level Caching Architecture**:
     - *Venue-Level Cache*: Raw weekly footfall payloads are cached in memory per `venue_id` (1-hour TTL) to minimize redundant external API network round-trips and preserve API credits.
     - *Destination-Level Cache*: Calibrated busyness telemetry is cached per destination coordinate and hour key (`footfall_{dest_id}_{weekday}_{hour}`) with a 1-hour TTL.
   - **Diurnal Heuristic Fallback**: Gracefully falls back to an hourly busyness model (0.85×–1.45×) if API keys are missing or network endpoints are unreachable.
   - **OpenStreetMap Overpass Integration**: Queries Overpass Turbo API for registered parking amenities, viewpoints, and drinking water nodes within a 3km radius.

4. **OGD India Pipeline (`ogd_india.py`)**:
   - Queries `data.gov.in` for Maharashtra tourism baselines (+14.8% YoY growth, 1.42x monsoon index).

---

## 3. Frontend Architecture

### 3.1 Dedicated Portal Workspace Gateway (`PortalSelectPage.tsx`) & Authentication (`AuthPage.tsx`)
The application eliminates monolithic navigation bars by providing a dedicated workspace launchpad at `/` (`PortalSelectPage.tsx`). Users select from 4 isolated portals, each tailored to a specific stakeholder persona:
1. 🌍 **Citizen & Tourist Experience** (`/tourist`): Real-time congestion radar, 3-tier fuzzy search, personalized discovery feed, GreenPass digital certificates, and smart trip wizard.
2. 🛡️ **District Incident Command GIS** (`/authority`): Real-time corridor telemetry, interactive Leaflet GIS triage map, emergency gazette advisory broadcasts, and predictive policy simulation.
3. 🏨 **MTDC Hospitality & Provider Console** (`/provider`): Homestay room inventory tracking, real-time occupancy reporting, and off-peak discount voucher campaigns.
4. ⚡ **Developer Diagnostic & Compliance Lab** (`/dev`): Ingestion worker telemetry, SIH26204 requirement compliance audit, API endpoint explorer, and SQLite log browser.

#### Dedicated Modern Authentication (`AuthPage.tsx`)
Authentication is centralized at `/login` (with aliases `/auth`, `/signin`, `/signup`):
- **Role Switching**: Tabs for Tourist, District Authority, MTDC Provider, and Dev Diagnostics.
- **1-Click Fast Demo Profiles**: Instant testing via pre-configured credentials (`DEMO_ACCOUNTS`):
  - *District Magistrate IAS Dr. Rajeshwar Patil* (Pune/State Disaster Authority)
  - *Raigad SP IPS Vikram Shinde* (Raigad District Police)
  - *Matheran Homestay Operator Suresh Gaikwad* (MTDC Hospitality)
  - *Lead Systems Engineer Ananya Deshmukh* (Dev Compliance)
- **Token Persistence**: Generates 7-day cryptographically secured session tokens saved in `localStorage`.

### 3.2 Role-Isolated Layout Shells & Strict Route Guarding
Monolithic navigation has been decommissioned in favor of 4 completely isolated layout shells:
- `TouristLayout.tsx`: Clean consumer travel navigation with global search, discover feed, trip planner, and user profile.
- `AuthorityLayout.tsx`: High-density operations chrome with live corridor status pills, district jurisdiction badge, and sub-nav (GIS Overview, Advisories, Policy Simulator, Impact Review).
- `ProviderLayout.tsx`: Merchant operations header with property listings, room occupancy sliders, and voucher managers.
- `DevLayout.tsx`: Minimalist developer chrome with pipeline health indicators and database logs.

#### Route Guarding (`RoleGuard.tsx`)
All administrative, commercial, and diagnostic routes (`/authority/*`, `/provider/*`, `/dev/*`) are strictly wrapped in `RoleGuard`:
- Validates active session via `sessionManager.ts`.
- Automatically syncs session credentials into the central Zustand store (`useCorridorStore.ts`) to avoid UI state divergence.
- Unauthenticated requests are smoothly redirected to `/login?portal=<role>&redirect=<target_path>`.

### 3.3 Independent Multi-Portal Token Session Architecture (`sessionManager.ts`)
The frontend implements a multi-role session manager enabling simultaneous, non-colliding logins across different portals:
- **Role-Keyed Storage**: Sessions are isolated in `localStorage` under keys `ecoroute_session_tourist`, `ecoroute_session_authority`, `ecoroute_session_provider`, and `ecoroute_session_developer`.
- **Session Lifecycle**: Tracks `role`, `token`, `user`, `loginAt`, and `expiresAt` (7-day TTL).
- **Independent Logout**: Logging out from the District Authority console does not terminate an active tourist session in another browser tab.

### 3.4 Modern Travel-Tech & SaaS Design System
The visual presentation has been modernized from legacy administrative styling into a clean, modern SaaS aesthetic (Linear / Stripe / Airbnb standard):
- **Removed**: Tricolor `tiranga-bar` stripes, obsolete `A- A A+` font scalers, Ashok Chakra watermarks, unstyled language switchers, and NIC hosting disclosures.
- **Adopted**: Dark slate navigation (`#0f172a`), emerald accents (`#10b981`), refined borders (`border-slate-800`), smooth transition micro-interactions, and accessible typography.

### 3.5 Declarative Route Hierarchy (React Router DOM v7)

| Route | Shell / Layout | Component | Protection | Description |
|---|---|---|:---:|---|
| `/` | Standalone | `PortalSelectPage` | Public | Workspace launchpad with 4 dedicated portal cards |
| `/login` | Standalone | `AuthPage` | Public | Modern authentication page with role selector & demo accounts |
| `/tourist` | `TouristLayout` | `LandingPage` | Public | Tourist hero search, destination strip, and quick-starts |
| `/discover` | `TouristLayout` | `DiscoverPage` | Public | Algorithmic demand diffusion feed |
| `/search` | `TouristLayout` | `SearchResultsPage` | Public | Full-page 3-tier fuzzy search results |
| `/region/:type/:value` | `TouristLayout` | `RegionPage` | Public | Exhaustive regional spot directory |
| `/spot/:spotId` | `TouristLayout` | `SpotPage` | Public | **Canonical Destination Page** (8 universal sections + role panels) |
| `/plan/new` | `TouristLayout` | `TripPlannerPage` | Public | 4-step wizard with progressive profiling modal |
| `/plan/:tripId` | `TouristLayout` | `SavedTripDetailPage` | Public | Confirmed timetable + Government Verified Green Pass Certificate |
| `/trips` | `TouristLayout` | `MyTripsPage` | Public | Saved itineraries and partner vouchers |
| `/account` | `TouristLayout` | `AccountPage` | Public | Traveler preferences and active role session details |
| `/authority` | `AuthorityLayout` | `AuthorityView` | Guarded (`authority`) | District GIS Incident Command Center & triage map |
| `/authority/advisories` | `AuthorityLayout` | `AuthorityView` | Guarded (`authority`) | Official gazette emergency advisory broadcaster |
| `/authority/policy-simulator` | `AuthorityLayout` | `AuthorityView` | Guarded (`authority`) | Predictive carrying capacity & deflection simulator |
| `/authority/impact` | `AuthorityLayout` | `AuthorityView` | Guarded (`authority`) | Post-incident review & under-visited promotion schemes |
| `/authority/overview` | `AuthorityLayout` | `AuthorityCommandPage` | Guarded (`authority`) | High-level corridor triage overview |
| `/authority/spot/:spotId` | `AuthorityLayout` | `SpotPage` | Guarded (`authority`) | Canonical spot page with Authority Management Panel |
| `/provider` | `ProviderLayout` | `ProviderView` | Guarded (`provider`) | Homestay operator console & room occupancy controls |
| `/provider/listings` | `ProviderLayout` | `ProviderConsolePage` | Guarded (`provider`) | Accredited property directory & voucher creator |
| `/provider/spot/:spotId` | `ProviderLayout` | `SpotPage` | Guarded (`provider`) | Canonical spot page with Provider Panel |
| `/dev` | `DevLayout` | `DevPortal` | Guarded (`developer`) | System telemetry, SIH26204 audit, and SQLite logs |

### 3.6 3-Tier Intent Resolution & Search Engine (`GlobalSearchBox.tsx`)
Search operates on an un-opinionated, zero-guess philosophy using `Fuse.js`:
- **Tier 1 (Spots)**: Matches exact spot names, aliases, or IDs (`LON` -> Lonavala) and navigates to `/spot/:spotId`.
- **Tier 2 (Districts)**: Matches district names (`Pune`, `Raigad`, `Satara`) and routes to `/region/district/:name`.
- **Tier 3 (States)**: Matches state names (`Maharashtra`) and routes to `/region/state/:name`.

### 3.7 The Canonical Spot Page Architecture (`SpotPage.tsx` & `useSpotData.ts`)
Rather than maintaining separate destination detail screens for tourists, district collectors, and hotel owners, **every destination has exactly one page**. 
- `useSpotData.ts` serves as the single source of truth, returning live metrics, hourly forecasts, twin alternatives, provenance tiers, and check-ins.
- **Universal Sections**: Always visible to tourists, citizens, and stakeholders alike.
- **Role-Conditional Panels**: Rendered at the bottom of the page when an authenticated officer or operator views the spot.

#### Visual Numerical Graphs & Condition Point Architecture
The Spot Page incorporates high-density, readable numerical visual graphs for both temporal horizons:
1. **12-Hour Predictive Hourly Forecast Strip**:
   - Renders hourly timeline cards (06:00 AM to 06:00 PM) featuring dual-compatible data normalization (`dccScore` / `dcc_score`, `timeLabel` / `time_label`, `waitMinutes` / `wait_minutes`).
   - Displays a mini numerical forecast graph with dynamic vertical point plotting.
   - Points and value badges are dynamically color-coded based on live DCC thresholds:
     - 🟢 **Optimal (`DCC < 0.70`)**: Emerald `#10b981` — recommended visiting windows.
     - 🟡 **Moderate (`0.70 <= DCC < 0.85`)**: Amber `#f59e0b` — increasing visitor inflow.
     - 🔴 **Peak / Critical (`DCC >= 0.85`)**: Rose `#f43f5e` — bottleneck risk and extended queue delays.
2. **Historical Weekly Crowd Rhythm Strip**:
   - Visualizes weekday trends (Mon–Sun) using calibrated weekly baseline profiles from BestTime and historical models.
   - Features an interactive point-and-stem graph plotting relative busyness scores (`0% – 100%`) for each day of the week.
   - Day points are styled with condition-based halos and percentage values, allowing tourists to plan off-peak weekend vs. weekday arrivals.

---

## 4. Data Provenance & Confidence Scoring (Tiers 1–4)

To ensure high credibility and transparency for citizens and district magistrates (§8), all telemetry displayed on the Spot Page is categorized into four auditable Data Tiers:

| Data Tier | Category | Source Systems | Refresh Rate |
|:---:|---|---|:---:|
| **Tier 1** | Ground-Truth Telemetry | Highway Toll Sensors, Parking Geofences, Municipal Gates | Sub-minute |
| **Tier 2** | Calibrated Live Feeds | Open-Meteo Weather, TomTom Traffic Flow, BestTime.app | 60 seconds |
| **Tier 3** | Algorithmic Fallback & Rhythm | Historical 7-day diurnal curves, weekend multiplier models | Hourly |
| **Tier 4** | Statutory Baselines | Official Carrying Capacity Gazette citations (e.g. Forest Dept Study) | Periodic audit |

### Dynamic Confidence Score Formulation
$$\text{Confidence} = \min\left(98\%, \, \max\left(50\%, \, 55 + (W_{\text{live}} \times 15) + (T_{\text{live}} \times 15) + (O_{\text{live}} \times 10) + \min(checkins \times 2, 8)\right)\right)$$

Where $W_{\text{live}}$, $T_{\text{live}}$, and $O_{\text{live}}$ are binary flags (1 if sensor is live, 0 if fallback).

---

## 5. Mathematical Models

### 5.1 Dynamic Carrying Capacity (DCC)
- **Capacity Utilization**: $U_{\text{cap}} = I_{\text{curr}} / C_{\text{base}}$
- **Weather Hazard**: $H_{\text{weather}} \in [0.0, 1.0]$
- **DCC Index**:
  $$\text{DCC} = \text{round}\left(0.70 \times U_{\text{cap}} + 0.30 \times H_{\text{weather}}, \, 2\right)$$
- **Tiers**: `OPTIMAL` ($< 0.70$), `MODERATE` ($0.70 - 0.84$), `CRITICAL` ($\ge 0.85$).

### 5.2 Algorithmic Demand Diffusion Feed Formula
Used in `/discover` to surface personalized, resilient destinations while relieving bottleneck pressure:
$$\text{Rank Score} = (0.45 \times \text{Cosine Similarity}) + (0.30 \times (1.0 - \text{DCC})) + (0.25 \times \text{UnderVisitedBoost})$$

### 5.3 4D Cosine Similarity Twin Matching
- Evaluates candidate destinations against traveler preferences across 4 dimensions: Scenic ($v_0$), Budget ($v_1$), Adventure ($v_2$), Family ($v_3$).
- Only candidates with $\text{DCC} < 0.70$ are promoted as twin alternatives.
