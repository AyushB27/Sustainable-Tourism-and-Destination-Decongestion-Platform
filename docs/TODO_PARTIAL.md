# Partially Executed & Active Tasks (TODO: PARTIAL)

This document tracks all **in-progress, partially implemented, or active** features in **EcoRoute Bharat**. These represent capabilities where core analytical engines, database models, or UI components exist, but final end-to-end integration wiring or production API configuration is required.

For completed features, see [TODO_DONE.md](./TODO_DONE.md).  
For not started/future roadmap features, see [TODO_FUTURE.md](./TODO_FUTURE.md).  
For the master summary index, see [TODO.md](./TODO.md).

---

## Progress Summary: Partially Executed Features

| # | Feature / Capability | Priority | Completed Aspects | Remaining Action Items |
|---|---|:---:|---|---|
| **16** | MTDC Operator Room Occupancy Persistence | MEDIUM | Slider calls `PUT /api/destinations/{id}/occupancy`; cache updated | Add persistent SQLite storage for operator room overrides across restarts |
| **17** | Off-Peak Incentive Schemes & Subsidies | MEDIUM | `promotions` SQLite table; UI coupon cards | Expose `GET /api/promotions` and `POST /api/promotions` backend endpoints |
| **18** | Trilingual Internationalization (I18n) | LOW | 55+ key English/Hindi/Marathi dictionary in `i18n.ts` | Wire language dropdown switcher in `Navbar.tsx` to active component text |
| **19** | Production API Keys (TomTom, BestTime) | HIGH | Heuristic diurnal models fully functional | Configure production API keys in `.env` to switch from SIMULATED to LIVE |

---

## Detailed Task Breakdown

### 16. MTDC Operator Room Occupancy Persistence
Status: PARTIAL | Priority: MEDIUM

#### Description
Local hoteliers and MTDC operators report live room occupancy percentage which influences local parking saturation and destination carrying capacity calculations.

#### Tasks
- [x] Build `LiveInventoryCard.tsx` with interactive occupancy slider (10% to 100%)
- [x] Create backend `PUT /api/destinations/{id}/occupancy` endpoint in `backend/main.py`
- [x] Update in-memory telemetry cache with reported occupancy percentage
- [x] Wire slider `onChange` to sync with backend PUT endpoint
- [ ] Create `hotel_occupancy_reports` SQLite table to persist room availability across server restarts
- [ ] Add operator property authentication before accepting occupancy updates

---

### 17. Off-Peak Incentive Schemes & Subsidies
Status: PARTIAL | Priority: MEDIUM

#### Description
MTDC discount vouchers (e.g. 25% off homestays, complimentary eco-passes) to incentivize tourists toward under-visited destinations and off-peak hours.

#### Tasks
- [x] Create SQLite `promotions` table schema in `database.py`
- [x] Build `OffPeakIncentiveCard.tsx` with 1-click voucher copying
- [x] Integrate promotions into twin destination utility ranking
- [ ] Expose `GET /api/promotions` and `POST /api/promotions` endpoints in `main.py`
- [ ] Connect provider promotion creator form to backend POST

---

### 18. Trilingual Internationalization (I18n)
Status: PARTIAL | Priority: LOW

#### Description
Multilingual recommendations supporting English, Hindi (हिंदी), and Marathi (मराठी) across citizen-facing interfaces to comply with SIH Requirement #11.

#### Tasks
- [x] Create comprehensive 55+ key trilingual dictionary in `frontend/src/lib/i18n.ts`
- [x] Add language state (`en`, `hi`, `mr`) in `useCorridorStore.ts`
- [x] Build language dropdown switcher in `Navbar.tsx`
- [ ] Map localized dictionary terms across all component text strings (currently held at English-first for hackathon review clarity)

---

### 19. Production API Keys (TomTom, BestTime)
Status: PARTIAL | Priority: HIGH

#### Description
External API keys for TomTom Traffic Flow and BestTime Footfall. The platform currently operates on robust, mathematically calibrated heuristic fallbacks that mirror real diurnal patterns.

#### Tasks
- [x] Diurnal weekend traffic model (2.1x peak, 1.4x regular, 1.05x weekday)
- [x] Hourly footfall model (1.45x midday, 0.85x morning)
- [x] Environment variable loader in `config.py`
- [x] DevPortal data transparency indicator showing exact `SIMULATED` status
- [ ] Input live production TomTom API key in `.env`
- [ ] Input live production BestTime API key in `.env`

---

## Proposed for Review: Authority Journey & Governance Implementation (#27 – #32)

> [!NOTE]
> All code, endpoints, database schemas, unit tests, and UI components for tasks #27–#32 have been fully implemented and verified. Per the system governance rules, they are placed here as a **reviewable proposal** and await explicit human confirmation before promotion to `TODO_DONE.md`.

---

### 27. Authority Data Model & Jurisdiction Scoping
Status: PROPOSED FOR DONE (Awaiting User Sign-off) | Priority: HIGH

#### Description
Complete database schema, auto-migration PRAGMAs, and server-side RBAC jurisdiction scoping for official municipal actions across Pune, Raigad, Satara, and Ahmednagar districts.

#### Tasks
- [x] Add auto-migration PRAGMA to `backend/database.py` adding `expires_at` and `revoked_at` columns to `gazette_advisories`
- [x] Create and seed `demand_flows` SQLite table with 4 origin-destination regional corridors
- [x] Create `capacity_overrides` SQLite table for persistent tracking of administrative capacity caps
- [x] Assign explicit district jurisdictions to administrative stakeholders (`AUTH-PUNE-01`: Pune, `AUTH-RAIGAD-02`: Raigad, `AUTH-MAHA-01`: Maharashtra state-wide)
- [x] Implement server-side middleware `check_authority_jurisdiction(user, spot_id)` returning HTTP 403 Forbidden for out-of-district actions
- [x] Implement automated unit tests in `test_backend.py` (`test_jurisdiction_scoping_enforcement`, `test_demand_flows_and_advisory_lifecycle`)
- [ ] **Human Sign-off:** Review and confirm promotion to `TODO_DONE.md`

---

### 28. District GIS Incident Command Overview
Status: PROPOSED FOR DONE (Awaiting User Sign-off) | Priority: HIGH

#### Description
High-level strategic triage and monitoring surface (`AuthorityView.tsx`) providing district officials with real-time corridor awareness, interactive Leaflet geospatial visualization, and multi-horizon demand forecasting.

#### Tasks
- [x] Build jurisdiction active status banner indicating authenticated officer's authority scope
- [x] Render real-time `CorridorKpiBar.tsx` summarizing total active inflow, critical stress hotspots, and diverted volume
- [x] Integrate interactive Leaflet `CorridorMap.tsx` with dynamic capacity stress circles (Green/Amber/Red)
- [x] Implement ranked triage table with 2h, 6h, and 12h forecast window toggles
- [x] Ensure all destination drill-downs navigate directly to the canonical `/spot/:spotId` (no duplicate authority detail pages)
- [ ] **Human Sign-off:** Review and confirm promotion to `TODO_DONE.md`

---

### 29. Canonical Spot Page Authority Controls
Status: PROPOSED FOR DONE (Awaiting User Sign-off) | Priority: HIGH

#### Description
Role-aware unified Spot Page (`components/spot/SpotPage.tsx`) utilizing `useSpotData(spotId)` to render universal tourist metrics while appending an administrative incident management panel for authenticated officers.

#### Tasks
- [x] Construct `useSpotData(spotId)` hook with unified metric calculation and transparent data-tier tags (`Tier 1` to `Tier 4`)
- [x] Render 8 universal spot sections (Hero, DCC Breakdown, Diurnal Forecast, Weekly Rhythm, Green Travel Passes, Twin Destinations, Community Signals, Municipal Constraints)
- [x] Append additive Authority Incident Panel when `currentUser.role === 'authority'`
- [x] Display local jurisdiction authorization badge (Authorized Officer vs Read-Only Outside District)
- [x] Provide capacity override slider calling backend `PUT /api/destinations/:id/capacity-override`
- [x] Provide fast emergency advisory broadcast form targeting the specific destination
- [x] Implement server-side HTTP 302 redirect for `/authority/spot/:spotId` -> `/spot/:spotId`
- [ ] **Human Sign-off:** Review and confirm promotion to `TODO_DONE.md`

---

### 30. Official Advisory Management Surface
Status: PROPOSED FOR DONE (Awaiting User Sign-off) | Priority: HIGH

#### Description
Comprehensive advisory lifecycle manager (`AdvisoryManager.tsx`) enabling district officials to review, broadcast, extend, and revoke emergency gazette advisories with full backend persistence.

#### Tasks
- [x] Build advisory table with status filter tabs (All, Active, Revoked)
- [x] Implement backend `POST /api/advisories/:id/revoke` with immediate SQLite timestamping
- [x] Implement backend `POST /api/advisories/:id/extend` with new expiration timestamp
- [x] Enforce server-side jurisdiction validation before revoking or extending advisories
- [x] Connect Zustand store actions `revokeAdvisory` and `extendAdvisory` to live backend endpoints
- [ ] **Human Sign-off:** Review and confirm promotion to `TODO_DONE.md`

---

### 31. Predictive Policy Simulator Sandbox
Status: PROPOSED FOR DONE (Awaiting User Sign-off) | Priority: HIGH

#### Description
Interactive policy simulation sandbox (`PolicySimulator.tsx`) allowing officers to model synthetic capacity restrictions, preview demand deflection, and assess twin destination absorption before issuing binding executive orders.

#### Tasks
- [x] Create backend `POST /api/policy-simulator/simulate` endpoint implementing analytical deflection math: $\Delta \text{Deflected} = \max(0, I_{\text{proj}} - C_{\text{sim}})$
- [x] Model twin destination capacity absorption without altering live production state
- [x] Build interactive frontend sandbox with destination picker, proposed capacity slider, and duration selector
- [x] Display step-by-step mathematical derivations and projected DCC stress reductions
- [x] Include 1-click shortcut to immediately publish the simulated policy as a binding public advisory
- [ ] **Human Sign-off:** Review and confirm promotion to `TODO_DONE.md`

---

### 32. Post-Incident Impact Review & Promotion
Status: PROPOSED FOR DONE (Awaiting User Sign-off) | Priority: MEDIUM

#### Description
Post-mortem analytics and proactive corridor promotion interface (`ImpactReview.tsx`) evaluating historical advisory effectiveness and highlighting under-utilized green corridor destinations.

#### Tasks
- [x] Build historical advisory impact audit table displaying before/after DCC stress and wait-time reductions
- [x] Render cumulative corridor sustainability metrics (diverted trips, estimated CO₂ reduction)
- [x] Highlight under-utilized corridor destinations (e.g. Bhandardara, Tapola, Kashid) with capacity headroom
- [x] Provide direct 1-click navigation to create promotional incentive schemes or view destination details
- [ ] **Human Sign-off:** Review and confirm promotion to `TODO_DONE.md`

