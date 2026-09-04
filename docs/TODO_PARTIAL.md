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
