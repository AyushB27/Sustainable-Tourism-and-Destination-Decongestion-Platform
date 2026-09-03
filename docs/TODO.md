# Project Task Management (TODO)

This document tracks all product features, operational capabilities, completed milestones, and remaining action items for **EcoRoute Bharat**.

Tasks are organized around **product features and capabilities** rather than technical layers, directly tracking the 14 functional requirements of Smart India Hackathon problem statement **SIH26204 (AI-Powered Sustainable Tourism & Destination Decongestion Platform)**. For requirement mapping details, see [PROBLEM_STATEMENT.md](./PROBLEM_STATEMENT.md).

Each feature maintains plain-text status identifiers that can be easily checked off and updated by any team member.

---

## Project Progress

| Status | Count | Description |
|---|---:|---|
| **DONE** | 6 | Fully implemented, operational, and verified |
| **PARTIAL** | 12 | Implemented with simulated/fallback mode or requiring integration wiring |
| **IN PROGRESS** | 0 | Tasks currently active in development |
| **NOT STARTED** | 4 | Planned infrastructure and integration features on the project roadmap |
| **BLOCKED** | 0 | No blocking external dependencies |

---

## DONE

### 1. Stakeholder RBAC & Authentication Gateway

Status: DONE

Priority: HIGH

#### Description
Role-based access control (RBAC) protecting administrative and commercial portals. Provides 1-click fast demo profiles (Pune District Magistrate IAS, Raigad SP IPS, Matheran Homestay Operator) and guest citizen authentication.

#### Tasks
- [x] Implement stakeholder credentials directory with role metadata in `backend/main.py`
- [x] Create `POST /api/auth/login` endpoint supporting officer, provider, and citizen guest modes
- [x] Build `AuthModal.tsx` modal interface with 1-click preset login buttons
- [x] Implement protected route guard in `useCorridorStore.ts` via `requestRoleChange`
- [x] Add session token and user profile persistence in browser `localStorage`
- [x] Add automated unit test for credentials verification in `test_backend.py`

#### Dependencies
- None (Standalone security module)

#### Definition of Done
- [x] Unauthenticated users attempting to switch to Authority or Provider roles are prompted with the authentication dialog
- [x] Valid officer and provider credentials return 200 OK with authenticated session tokens
- [x] User session state survives browser refreshes

#### Notes
- Fallback authentication is implemented in `AuthModal.tsx` so the demo functions smoothly even if the Python backend is temporarily unreachable.

---

### 2. Dynamic Carrying Capacity (DCC) Engine

Status: DONE

Priority: HIGH

#### Description
Core mathematical evaluation engine that quantifies destination crowd pressure and safety thresholds. Blends physical capacity utilization with environmental hazards (rainfall, wind, landslides) to assign an operational status (`OPTIMAL`, `MODERATE`, `CRITICAL`) and estimate visitor queue delays.

#### Tasks
- [x] Implement DCC formula `(0.70 * Inflow / Capacity) + (0.30 * Weather Hazard Score)` in `backend/app/engine/dcc_calculator.py`
- [x] Implement identical calculation logic in `frontend/src/lib/engine.ts` for instant client-side reactivity
- [x] Build queuing wait-time formula based on capacity overflow and average dwell duration
- [x] Define status thresholds: OPTIMAL (< 0.70), MODERATE (0.70 - 0.85), CRITICAL (>= 0.85)
- [x] Create automated unit tests covering edge cases in `test_backend.py`

#### Dependencies
- Weather hazard score from weather telemetry pipeline
- Inflow estimates from traffic and footfall pipelines

#### Definition of Done
- [x] Destinations with >100% capacity utilization or high landslide risk are classified as CRITICAL
- [x] Queuing delays are calculated in minutes and displayed in both backend feeds and frontend metrics
- [x] Unit test suite verifies precision of calculation against expected benchmarks

#### Notes
- Mathematical formulation:
  $$\text{DCC} = \min\left(1.0, \, 0.70 \times \frac{\text{Inflow}}{\text{Capacity}} + 0.30 \times \text{Hazard}\right)$$

---

### 3. District GIS Emergency Incident Command Center

Status: DONE

Priority: HIGH

#### Description
Administrative dashboard for district collectors, police superintendents, and disaster relief cells. Integrates an interactive Leaflet GIS map with color-coded destination status rings, telemetry KPI bars, capacity threshold tables, and live manual backend sync controls.

#### Tasks
- [x] Build `AuthorityView.tsx` container layout with official government styling
- [x] Integrate `CorridorKpiBar.tsx` summarizing total visitors, red zones, eco-passes, and corridor capacity
- [x] Implement `CorridorMap.tsx` with Leaflet markers, pulsating critical alert circles, and capacity popups
- [x] Build `CorridorThresholdTable.tsx` for tabular inspection of all 7 corridor destinations
- [x] Implement manual "Sync Python Live Sensor Pipeline" button with loading spinner

#### Dependencies
- Leaflet and React-Leaflet libraries
- `destinations` telemetry state in Zustand store

#### Definition of Done
- [x] Map renders all 7 Sahyadri destinations at correct GPS coordinates
- [x] Overcrowded destinations display pulsating red warning rings
- [x] Clicking map pins opens detailed telemetry cards with current visitor counts and wait times

#### Notes
- Map tiles use CartoDB Positron tiles for a clean, professional government command center aesthetic.

---

### 4. Ecological Vulnerability & Municipal Controls

Status: DONE

Priority: MEDIUM

#### Description
Command module allowing district authorities to inspect ecological vulnerability indicators (vegetation stress, groundwater security, forest fire risk) and adjust municipal vehicle entry caps during severe emergencies.

#### Tasks
- [x] Create `EcoHealthCommunityWidget.tsx` displaying environmental vulnerability gauges
- [x] Implement interactive sliders for simulating emergency vehicle cap reductions (e.g. 50% restriction)
- [x] Render localized water stress and municipal solid waste saturation meters
- [x] Wire state updates into destination pressure indicators in Zustand store

#### Dependencies
- Authority dashboard view container (`AuthorityView.tsx`)

#### Definition of Done
- [x] District officials can adjust simulated carrying capacity limits during extreme weather events
- [x] Widget visually reflects municipal pressure flags (e.g., waste collection alerts)

---

### 5. Regional Mobility Diffusion Matrix

Status: DONE

Priority: MEDIUM

#### Description
Visual Origin-Destination (O-D) flow matrix analyzing how holiday tourists diffuse from primary urban source centers (Mumbai, Pune, Thane) into Sahyadri destination gateways.

#### Tasks
- [x] Build `DemandDiffusionFlow.tsx` component with interactive origin hub selectors
- [x] Implement percentage distribution visualization for vehicle outflows
- [x] Display alternative bypass recommendations (e.g., diverting NH-48 Pune traffic via Ghoti bypass)

#### Dependencies
- Authority dashboard view container (`AuthorityView.tsx`)

#### Definition of Done
- [x] Officials can select source cities and view current tourist dispersion percentages across the 7 monitored destinations

---

### 6. Automated Unit Testing & API Documentation Explorer

Status: DONE

Priority: HIGH

#### Description
Comprehensive backend automated test suite verifying database integrity, mathematical calculation accuracy, pipeline execution, and credentials directories. Interactive OpenAPI Swagger documentation served natively.

#### Tasks
- [x] Implement 7 automated test suites in `backend/test_backend.py` using Python's `unittest`
- [x] Add tests for database initialization, DCC calculations, 12-hour forecasts, 4D cosine twin matching, itinerary planner, live pipeline fetches, and stakeholder directories
- [x] Serve interactive Swagger UI at `/docs` and OpenAPI JSON specification at `/openapi.json`
- [x] Add CLI flags to `backend/main.py` (`--cli` for single sync, `--test` for running tests)

#### Dependencies
- Python standard library (`unittest`, `http.server`, `json`, `sqlite3`)

#### Definition of Done
- [x] Running `python test_backend.py` executes 7 test suites with 100% pass rate
- [x] Navigating to `http://127.0.0.1:8000/docs` renders complete interactive Swagger documentation

---

## PARTIAL

### 7. Live Multi-Source Telemetry Ingestion Pipeline

Status: PARTIAL

Priority: HIGH

#### Description
Automated background ETL pipeline ingesting real-time weather, traffic speeds, venue footfall, and open government data across 7 Sahyadri destinations. Logs time-series data to SQLite and caches latest metrics in memory.

#### Tasks
- [x] Implement Open-Meteo live weather pipeline in `weather_pipeline.py` (Rain, Wind, Temp, Hazard Score)
- [x] Implement TomTom traffic delay pipeline in `traffic_pipeline.py` with diurnal weekend fallback
- [x] Implement BestTime.app live footfall pipeline in `footfall_pipeline.py` with hourly weekend fallback
- [x] Implement OpenStreetMap Overpass amenity counter in `footfall_pipeline.py`
- [x] Implement Open Government Data (data.gov.in) benchmark pipeline in `ogd_india.py`
- [x] Implement 60-second daemon thread in `background_worker.py` logging to `sensor_readings` table
- [x] Implement `GET /api/destinations/live` serving in-memory telemetry cache
- [x] Add auto-polling every 25s in frontend `App.tsx`
- [ ] Configure live production API keys for TomTom, BestTime, and data.gov.in in environment file
- [ ] Add error boundary and retry backoff when external weather APIs rate-limit requests
- [ ] Add destination-specific bounding boxes for OpenStreetMap amenity scanning

#### Dependencies
- Valid external API keys (TomTom, BestTime, data.gov.in)
- Active internet connectivity for Open-Meteo requests

#### Definition of Done
- [ ] Production API keys are configured and reporting `connected` status instead of `fallback`/`simulated`
- [x] SQLite `sensor_readings` table receives continuous telemetry logs
- [x] Frontend displays live sensor connection status (`🟢 Python Live Sensors Active`)

#### Notes
- Current code functions reliably using intelligent heuristic models whenever API keys are missing or services time out.

---

### 8. 4D Vector Cosine Similarity Twin Recommender

Status: PARTIAL

Priority: HIGH

#### Description
Recommendation engine that identifies under-visited "twin destinations" sharing the aesthetic and activity profile of overloaded hotspots. Computes cosine similarity across Scenic, Budget, Adventure, and Family dimensions blended with user preference weights.

#### Tasks
- [x] Implement 4D cosine similarity algorithm in `backend/app/engine/twin_matcher.py`
- [x] Implement matching algorithm in `frontend/src/lib/engine.ts` (`getTwinRecommendations`)
- [x] Implement multi-objective utility scoring combining vibe match with capacity headroom
- [x] Build `TwinAlternativeCards.tsx` component with confetti animations, crowd reduction percentages, and travel time deltas
- [x] Implement `POST /api/recommendations/twin` endpoint in `backend/main.py`
- [ ] Connect `TouristView.tsx` to dynamically pass selected destination and user preferences to `TwinAlternativeCards`
- [ ] Wire frontend store to call `POST /api/recommendations/twin` with local fallback

#### Dependencies
- Destination feature vectors in `INITIAL_DESTINATIONS`
- User preference weights from Zustand store

#### Definition of Done
- [ ] Selecting an overloaded destination (e.g. Lonavala or Alibaug) dynamically populates certified twin alternatives (e.g. Matheran or Kashid)
- [ ] Adjusting user preference tags (Scenic, Budget, Adventure, Family) updates twin match rankings in real time

#### Notes
- Current implementation status: The algorithms in both Python and TypeScript are verified and complete, and `TwinAlternativeCards.tsx` is built, but `TouristView.tsx` currently renders a static demo twin card instead of mounting the dynamic component.

---

### 9. Citizen / Tourist Experience Portal & Dynamic View

Status: PARTIAL

Priority: HIGH

#### Description
Primary public-facing portal allowing travelers to search destinations, view live crowd meters, explore twin recommendations, check optimal visiting times, and generate green passes.

#### Tasks
- [x] Design landscape responsive layout in `TouristView.tsx`
- [x] Build individual modular tourist components (`HeroDCCStatus.tsx`, `TouristFilters.tsx`, `TwinAlternativeCards.tsx`, `DemandCurveChart.tsx`, `FutureTripPlanner.tsx`, `EcoPassCard.tsx`)
- [ ] Refactor `TouristView.tsx` to mount and compose the modular dynamic components rather than using hardcoded demo JSX
- [ ] Connect destination search input and category pills to Zustand store state (`selectedDestinationId`, `categoryFilter`)
- [ ] Enable one-click rerouting CTA to update selected destination and re-render metrics

#### Dependencies
- Modular tourist components in `frontend/src/components/tourist/`
- Zustand store state

#### Definition of Done
- [ ] Changing destination via dropdown or search updates all meters, charts, twin cards, and green passes dynamically
- [ ] User can click "Choose Matheran & Get Priority Travel Pass" to trigger confetti and re-center view on the recommended twin

#### Notes
- During hackathon prototype presentation, `TouristView.tsx` was adjusted to showcase a fixed Lonavala-to-Matheran comparison layout. Re-integrating the modular components will restore full dynamic multi-destination browsing.

---

### 10. 12-Hour Diurnal Demand Curve & Best Departure Windows

Status: PARTIAL

Priority: MEDIUM

#### Description
Predictive hourly tourist velocity model forecasting arrival peaks and queuing delays across a 12-hour window (06:00 AM to 06:00 PM). Helps tourists identify optimal early-morning and late-afternoon travel slots.

#### Tasks
- [x] Implement Gaussian curve generator in `backend/app/engine/dcc_calculator.py` (`generate_12hr_forecast`)
- [x] Expose `GET /api/destinations/{id}/forecast` endpoint in `backend/main.py`
- [x] Build `DemandCurveChart.tsx` component using Recharts Area charts with capacity threshold reference lines
- [ ] Mount `DemandCurveChart.tsx` inside `TouristView.tsx`
- [ ] Fetch hourly forecast data from backend API endpoint with client-side fallback

#### Dependencies
- Recharts library in frontend
- Base inflow and dwell time metrics for target destination

#### Definition of Done
- [ ] Interactive chart displays hourly tourist inflow curve with green, yellow, and red capacity zones
- [ ] Selecting a specific time slot highlights estimated checkpoint wait times

---

### 11. Multi-Day Itinerary Decongestion Planner

Status: PARTIAL

Priority: MEDIUM

#### Description
AI-driven itinerary builder that generates multi-day holiday plans (1-day, 2-day, or 3-day) designed to sequence attractions so travelers avoid peak bottleneck hours and visit certified twin destinations.

#### Tasks
- [x] Implement `generate_future_itinerary` in `backend/app/engine/itinerary_engine.py`
- [x] Expose `POST /api/itinerary/plan` endpoint in `backend/main.py`
- [x] Build interactive `FutureTripPlanner.tsx` component with date picker, duration tabs, and 1-click print export
- [ ] Mount `FutureTripPlanner.tsx` inside `TouristView.tsx`
- [ ] Connect frontend form to `POST /api/itinerary/plan` with fallback to local rule engine

#### Dependencies
- Itinerary engine in backend
- UI date and duration picker components

#### Definition of Done
- [ ] User selects travel date and duration (e.g. 2-day) and receives a structured itinerary with time slots, transit advice, and MTDC homestay recommendations
- [ ] User can click "Print Itinerary" to generate a clean, printable PDF travel pass

---

### 12. Digital Green Yatra Pass & QR Verification

Status: PARTIAL

Priority: MEDIUM

#### Description
Digital green travel voucher issued to tourists who agree to divert to under-visited destinations. Includes a fast-track QR code payload for highway toll plazas, estimated carbon footprint savings, and destination accreditation badges.

#### Tasks
- [x] Implement `green_yatra_passes` SQLite table schema in `backend/app/database.py`
- [x] Implement `POST /api/passes/issue` and `GET /api/passes` in `backend/main.py`
- [x] Build `EcoPassCard.tsx` component rendering dynamic pass ID, QR code, and cumulative carbon savings
- [ ] Wire reroute CTA in frontend to make `POST /api/passes/issue` request to backend database
- [ ] Display recent issued passes in District Authority incident log

#### Dependencies
- SQLite database connection in backend
- Zustand carbon tracking state in frontend

#### Definition of Done
- [ ] Rerouting to an eco-twin destination issues an official pass ID (e.g., `ECO-MH-2026-XXXX`) logged in SQLite
- [ ] Toll QR code is scannable and encodes pass ID and verification status

---

### 13. Emergency Gazette Advisory Broadcaster

Status: PARTIAL

Priority: HIGH

#### Description
Official public advisory broadcaster enabling disaster management authorities to publish urgent travel bulletins, fog alerts, and landslide warnings directly to the platform.

#### Tasks
- [x] Create `gazette_advisories` table in SQLite schema (`backend/app/database.py`)
- [x] Implement `POST /api/advisories/broadcast` and `GET /api/advisories` in `backend/main.py`
- [x] Build `DigitalAdvisoryDispatcher.tsx` in Authority portal with quick preset templates
- [x] Implement broadcast toast and dismiss actions in Zustand store
- [ ] Wire `DigitalAdvisoryDispatcher.tsx` to send HTTP `POST` to backend `/api/advisories/broadcast`
- [ ] Fetch active advisories from `GET /api/advisories` during store synchronization

#### Dependencies
- Authority authentication role
- SQLite database connection

#### Definition of Done
- [ ] Publishing an advisory in Authority Command writes the record to the backend SQLite database
- [ ] Newly published advisories immediately display as warning banners across the Citizen Portal

---

### 14. MTDC Hospitality & Operator Console

Status: PARTIAL

Priority: MEDIUM

#### Description
Dedicated dashboard for accredited homestays, hotels, and tour operators. Allows operators to report real-time room occupancy and monitor 12-hour arrival forecasts for their destination.

#### Tasks
- [x] Build `ProviderView.tsx` container with property management header
- [x] Build `LiveInventoryCard.tsx` with room occupancy reporting slider and vacancy counter
- [x] Build `InflowPredictorTimeline.tsx` rendering predicted tourist arrivals by hour
- [x] Implement destination property switcher dropdown
- [ ] Persist operator occupancy updates to backend database
- [ ] Restrict provider management controls strictly to properties in their registered district

#### Dependencies
- Provider role authentication (`PROV-MATHERAN-01`, `PROV-KASHID-02`)

#### Definition of Done
- [ ] Operator updates available rooms slider and the change reflects in destination capacity metrics
- [ ] Operator sees hourly predicted arrival curve for their specific destination

---

### 15. Off-Peak Incentive Schemes & Homestay Subsidies

Status: PARTIAL

Priority: MEDIUM

#### Description
Allows local hospitality operators to publish off-peak discount coupons (e.g., 25% discount code `HOMESTAY25`) to attract tourists during low-occupancy windows.

#### Tasks
- [x] Create `promotions` table schema in `backend/app/database.py`
- [x] Build `OffPeakIncentiveCard.tsx` allowing operators to publish promo codes into frontend state
- [x] Render active subsidy vouchers inside twin destination recommendation cards
- [ ] Add `GET /api/promotions` and `POST /api/promotions` endpoints in `backend/main.py`
- [ ] Seed initial promotions into backend database during `init_database()`

#### Dependencies
- SQLite database connection in backend
- Provider view console in frontend

#### Definition of Done
- [ ] Operator submits a new promo code via Provider Console and it persists in backend database
- [ ] Tourists browsing the matching destination see the active discount badge and coupon code

---

### 16. 24x7 AI Tourism Helpline Assistant ("Sahyadri Guide")

Status: PARTIAL

Priority: MEDIUM

#### Description
Floating conversational AI assistant (Helpline 1363) answering tourist questions regarding live crowd congestion, weather conditions, highway advisories, and green passes.

#### Tasks
- [x] Build `AiHelplineBot.tsx` floating drawer widget with quick-prompt chips
- [x] Implement live-metric grounded response generator in frontend component
- [x] Implement `POST /api/ai/chat` endpoint in `backend/main.py`
- [ ] Wire `AiHelplineBot.tsx` to send user queries to `POST /api/ai/chat` with client-side fallback
- [ ] Integrate trilingual response capability (English, Hindi, Marathi)

#### Dependencies
- Live destination telemetry metrics

#### Definition of Done
- [ ] Tourist asks "Is Lonavala crowded right now?" and receives accurate, real-time DCC metrics and rerouting suggestions
- [ ] Floating bot functions smoothly on both desktop and mobile layouts

---

### 17. Trilingual Regional Internationalization (I18n)

Status: PARTIAL

Priority: LOW

#### Description
Trilingual user interface supporting English, Hindi (हिन्दी), and Marathi (मराठी) to ensure accessibility for domestic tourists, local residents, and regional administrative personnel.

#### Tasks
- [x] Create comprehensive translation dictionary in `frontend/src/lib/i18n.ts` covering 55+ UI keys across English, Hindi, and Marathi
- [ ] Add active language state (`'en' | 'hi' | 'mr'`) to Zustand store
- [ ] Add language switcher dropdown in `Navbar.tsx`
- [ ] Replace hardcoded UI labels across components with dynamic translation lookups (`t(key)`)

#### Dependencies
- `TRANSLATIONS` dictionary in `frontend/src/lib/i18n.ts`

#### Definition of Done
- [ ] Toggling language in navbar switches all portal labels between English, Hindi, and Marathi instantly

---

### 18. Frontend Dependency & Build Validation

Status: PARTIAL

Priority: HIGH

#### Description
Ensure all frontend npm packages are installed, TypeScript compiles cleanly with zero type errors, and Vite production bundle builds successfully.

#### Tasks
- [ ] Execute `npm install` in `frontend/` directory to generate local `node_modules`
- [ ] Run `npm run build` (`tsc -b && vite build`) and verify clean build exit code
- [ ] Run `npm run lint` and resolve any outstanding ESLint warnings
- [ ] Verify production preview with `npm run preview`

#### Dependencies
- Node.js v22.x and npm 10.x runtime environment

#### Definition of Done
- [ ] `npm run build` completes successfully with zero compilation errors

---

## NOT STARTED

### 19. Edge FASTag IoT ANPR Camera Streaming

Status: NOT STARTED

Priority: HIGH

#### Description
Integrate edge IoT cameras equipped with Automatic Number Plate Recognition (ANPR) and FASTag RFID readers at key highway toll plazas (e.g. Khandala, Khopoli, Khalapur) to stream physical vehicle counts into the telemetry pipeline via an MQTT broker.

#### Tasks
- [ ] Deploy MQTT subscriber daemon in backend
- [ ] Ingest live vehicle inflow counts per minute from toll checkpoints
- [ ] Replace synthetic traffic multipliers with actual toll camera throughput

#### Dependencies
- NHAI / MSRDC FASTag API or physical edge camera gateway

---

### 20. Distributed Redis Caching Layer

Status: NOT STARTED

Priority: MEDIUM

#### Description
Replace Python's in-memory telemetry dictionary with a distributed Redis instance to enable multi-worker horizontal scaling and pub/sub message broadcasting across distributed backend containers.

#### Tasks
- [ ] Set up Redis connection pool in `backend/app/config.py`
- [ ] Cache destination telemetry with 60-second TTL
- [ ] Implement Redis Pub/Sub for instantaneous gazette advisory broadcasting

#### Dependencies
- Redis server instance

---

### 21. CDAC / NIC SMS & WhatsApp Alert Gateway

Status: NOT STARTED

Priority: HIGH

#### Description
Direct integration with Government of India CDAC / NIC SMS gateway and WhatsApp Business API to push critical disaster advisories and landslide warnings to tourist mobile devices entering geofenced red zones.

#### Tasks
- [ ] Integrate CDAC SMS gateway client
- [ ] Implement geofenced trigger when destination DCC enters CRITICAL status
- [ ] Dispatch automated SMS notifications to registered Green Pass holders

#### Dependencies
- CDAC / NIC government gateway credentials

---

### 22. Cloud PostgreSQL & PostGIS Spatial Migration

Status: NOT STARTED

Priority: MEDIUM

#### Description
Migrate persistence tier from local SQLite 3 database to cloud-hosted PostgreSQL with PostGIS spatial extensions for high-resolution geo-spatial queries and spatial indexing.

#### Tasks
- [ ] Define SQLAlchemy / Alembic migration scripts
- [ ] Migrate `destinations`, `sensor_readings`, `passes`, and `advisories` schemas
- [ ] Add PostGIS geospatial distance queries for twin destination matching

#### Dependencies
- Managed PostgreSQL instance
