# Partially Executed & Active Tasks (TODO: PARTIAL)

This document tracks all **in-progress, partially implemented, or active** features in **EcoRoute Bharat**. These represent capabilities where core analytical engines, database models, or UI components exist, but final end-to-end integration wiring or production API configuration is required.

For completed features, see [TODO_DONE.md](./TODO_DONE.md).  
For not started/future roadmap features, see [TODO_FUTURE.md](./TODO_FUTURE.md).  
For the master summary index, see [TODO.md](./TODO.md).

---

## Progress Summary: Partially Executed Features

| # | Feature / Capability | Priority | Completed Aspects | Remaining Action Items |
|---|---|:---:|---|---|
| **7** | Live Telemetry Ingestion Pipeline | HIGH | Open-Meteo live, fallbacks active, 60s SQLite daemon | Configure live TomTom & BestTime API keys |
| **8** | 4D Cosine Twin Recommender | HIGH | Python & TypeScript cosine algorithms, UI card | Wire dynamic selection in `TouristView.tsx` |
| **9** | Citizen / Tourist Experience Portal | HIGH | Modular components built, layout styled | Mount modular components in `TouristView.tsx` |
| **10** | 12-Hour Diurnal Demand Curve | MEDIUM | Gaussian formula in backend, Recharts Area chart | Embed `DemandCurveChart.tsx` in Tourist view |
| **11** | Multi-Day Decongested Itinerary Planner | MEDIUM | Backend generator verified, UI form component built | Mount `FutureTripPlanner.tsx` in Tourist view |
| **12** | Digital Green Yatra Pass & QR Code | MEDIUM | SQLite table, pass card UI, carbon offset math | Wire reroute CTA to `POST /api/passes/issue` |
| **13** | Emergency Gazette Advisory Broadcaster | HIGH | SQLite schema, backend endpoint, dispatcher UI | Wire dispatcher to `POST /api/advisories/broadcast` |
| **14** | MTDC Hospitality & Operator Console | MEDIUM | Provider UI, room slider, arrival timeline | Persist room occupancy updates to backend |
| **15** | Off-Peak Incentive Schemes & Subsidies | MEDIUM | `promotions` SQLite table, coupon UI component | Expose `/api/promotions` backend REST endpoint |
| **16** | 24x7 AI Tourism Helpline Assistant | MEDIUM | Floating drawer UI, live telemetry matching | Wire bot to `POST /api/ai/chat` |
| **17** | Trilingual Internationalization (I18n) | LOW | 55+ key English/Hindi/Marathi dictionary | Wire language dropdown switcher in `Navbar.tsx` |
| **18** | Frontend Dependency & Build Validation | HIGH | Config files & lockfile in place | Run `npm install` and verify `npm run build` |

---

## Detailed Task Breakdown

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
