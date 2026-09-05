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
        ROUTER[React Router DOM v7<br/>16 Declarative Routes]
        SEARCH[GlobalSearchBox.tsx<br/>Fuse.js 3-Tier Fuzzy Search]
        ZUSTAND[Zustand Central Store<br/>useCorridorStore.ts]
        SPOT_HOOK[useSpotData Hook<br/>Single Source of Truth]
        CANONICAL_SPOT[Canonical Spot Page<br/>/spot/:spotId]
        UNIVERSAL_SECTIONS[Universal Sections §3.1<br/>Crowd, Forecast, Provenance, Twins, Amenities]
        CONDITIONAL_PANELS[Role-Conditional Panels §3.2<br/>Authority Overrides & Provider Vouchers]
        TOURIST_FLOWS[Tourist Flow Pages<br/>/, /discover, /plan/new, /trips, /account]
        STAKEHOLDER_HUBS[Provisional Consoles<br/>/authority, /provider funneled into /spot]
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
    ROUTER --> SEARCH
    SEARCH -->|Tier 1: Spots| CANONICAL_SPOT
    SEARCH -->|Tier 2 & 3: Regions| ROUTER
    ROUTER --> TOURIST_FLOWS
    ROUTER --> STAKEHOLDER_HUBS
    STAKEHOLDER_HUBS -->|Inspect Destination| CANONICAL_SPOT
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
   - Queries BestTime.app attraction footfall busyness.
   - Falls back to an hourly busyness model (0.85x–1.45x).
   - Queries OpenStreetMap Overpass API for registered parking amenities and viewpoints within a 3km radius.

4. **OGD India Pipeline (`ogd_india.py`)**:
   - Queries `data.gov.in` for Maharashtra tourism baselines (+14.8% YoY growth, 1.42x monsoon index).

---

## 3. Frontend Architecture

### 3.1 Declarative Route Hierarchy (React Router DOM v7)
The frontend implements a unified routing tree where stakeholder views are integrated rather than partitioned into disconnected silo apps:

| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage.tsx` | Hero search box, live preview strip of top destinations, style quick-starts |
| `/discover` | `DiscoverPage.tsx` | Personalized feed ranked by style affinity, crowd headroom, and under-visited boost |
| `/search?q=` | `SearchResultsPage.tsx` | Full-page 3-tier fuzzy search intent resolution |
| `/region/:type/:value` | `RegionPage.tsx` | Exhaustive listing of spots in a district or state sorted by crowd status |
| `/spot/:spotId` | `SpotPage.tsx` | **Canonical Destination Spot Page** with 8 universal sections + role panels |
| `/plan/new` | `TripPlannerPage.tsx` | 4-step wizard with progressive profiling signup modal |
| `/plan/:tripId` | `SavedTripDetailPage.tsx` | Day-by-day timetable and official GreenPass certificate with QR voucher |
| `/trips` | `MyTripsPage.tsx` | Saved itineraries and redeemable partner vouchers |
| `/account` | `AccountPage.tsx` | Progressive origin & style preferences, stakeholder role switcher |
| `/advisories` | `AdvisoriesPage.tsx` | Searchable official gazette dispatch system |
| `/authority` | `AuthorityCommandPage.tsx` | District GIS command center funneled into canonical spot pages |
| `/authority/spot/:spotId` | Redirect | Redirects to canonical `/spot/:spotId` |
| `/provider` | `ProviderConsolePage.tsx` | Homestay operator console funneled into canonical spot pages |
| `/provider/spot/:spotId` | Redirect | Redirects to canonical `/spot/:spotId` |
| `/dev` | `DevPortal.tsx` | Production health monitoring, SIH26204 audit, and SQLite logs |

### 3.2 3-Tier Intent Resolution & Search Engine (`GlobalSearchBox.tsx`)
Search operates on an un-opinionated, zero-guess philosophy using `Fuse.js`:
- **Tier 1 (Spots)**: Matches exact spot names, aliases, or IDs (`LON` -> Lonavala) and navigates to `/spot/:spotId`.
- **Tier 2 (Districts)**: Matches district names (`Pune`, `Raigad`, `Satara`) and routes to `/region/district/:name`.
- **Tier 3 (States)**: Matches state names (`Maharashtra`) and routes to `/region/state/:name`.

### 3.3 The Canonical Spot Page Architecture (`SpotPage.tsx` & `useSpotData.ts`)
Rather than maintaining separate destination detail screens for tourists, district collectors, and hotel owners, **every destination has exactly one page**. 
- `useSpotData.ts` serves as the single source of truth, returning live metrics, hourly forecasts, twin alternatives, provenance tiers, and check-ins.
- **Universal Sections**: Always visible to tourists, citizens, and stakeholders alike.
- **Role-Conditional Panels**: Rendered at the bottom of the page when an authenticated officer or operator views the spot.

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
