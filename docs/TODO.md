# Project Task Management & Master TODO Index

This document serves as the **master task-management index** for **EcoRoute Bharat**, directly tracking the 14 functional requirements of Smart India Hackathon problem statement **SIH26204 (AI-Powered Sustainable Tourism & Destination Decongestion Platform)**. For detailed requirement mapping, see [PROBLEM_STATEMENT.md](./PROBLEM_STATEMENT.md).

To make tracking and manual editing as clear as possible, tasks are separated into three dedicated status documents:

- 🟢 **[TODO: Completed Features (DONE)](./TODO_DONE.md)** — Fully implemented, tested, and verified features.
- 🟡 **[TODO: Partially Executed & Active Tasks (PARTIAL)](./TODO_PARTIAL.md)** — Implemented features requiring final integration wiring or production API configuration.
- 🔵 **[TODO: Future Roadmap Features (NOT STARTED)](./TODO_FUTURE.md)** — Planned architectural upgrades, IoT camera streaming, and cloud migrations.

---

## Overall Project Progress

| Status | Count | Dedicated File | Description |
|---|---:|---|---|
| **DONE** | 13 | [TODO_DONE.md](./TODO_DONE.md) | Fully implemented, operational, and verified |
| **PARTIAL** | 4 | [TODO_PARTIAL.md](./TODO_PARTIAL.md) | Core logic/UI built; requires final wiring or API keys |
| **IN PROGRESS** | 0 | — | Active development tasks |
| **NOT STARTED** | 7 | [TODO_FUTURE.md](./TODO_FUTURE.md) | Future roadmap & infrastructure enhancements |
| **BLOCKED** | 0 | — | No blocking external dependencies |
| **TOTAL** | **24** | | Full scope across all platform tiers |

---

## 1. Completed Features Summary

See **[TODO_DONE.md](./TODO_DONE.md)** for full task breakdowns, dependencies, and definitions of done.

| # | Feature / Capability | Priority | Verification State |
|---|---|:---:|---|
| **1** | **Stakeholder RBAC & Authentication Gateway** | HIGH | `POST /api/auth/login`, `AuthModal.tsx`, route guard, session persistence |
| **2** | **Dynamic Carrying Capacity (DCC) Engine** | HIGH | Formula implemented in Python & TypeScript; verified by unit tests |
| **3** | **District GIS Emergency Command Center** | HIGH | `AuthorityView.tsx`, interactive Leaflet `CorridorMap.tsx`, KPI bars |
| **4** | **Ecological Vulnerability & Municipal Controls** | MEDIUM | `EcoHealthCommunityWidget.tsx`, stress gauges & entry restriction sliders |
| **5** | **Regional Mobility Diffusion Matrix** | MEDIUM | `DemandDiffusionFlow.tsx` origin-destination flow matrix from Mumbai/Pune |
| **6** | **Automated Unit Testing & API Documentation** | HIGH | 7/7 automated backend unit test suites pass; Swagger UI served at `/docs` |
| **7** | **Live Telemetry Pipeline (Weather LIVE + Fallbacks)** | HIGH | Open-Meteo + OSM live; Traffic/Footfall heuristic; 60s SQLite daemon |
| **8** | **Citizen / Tourist Portal — Dynamic Data Wiring** | HIGH | `TouristView.tsx` wired to Zustand store; live DCC, twin cards, forecast chart |
| **9** | **12-Hour Diurnal Demand Curve** | MEDIUM | `DemandCurveChart.tsx` mounted; fetches `GET /api/destinations/{id}/forecast` |
| **10** | **4D Cosine Twin Recommender — Wired** | HIGH | `TwinAlternativeCards.tsx` dynamically receives live store data |
| **11** | **Multi-Day Itinerary Planner — Wired** | MEDIUM | `FutureTripPlanner.tsx` calls `POST /api/itinerary/plan` |
| **12** | **Emergency Gazette Advisory Broadcaster — Wired** | HIGH | `DigitalAdvisoryDispatcher.tsx` calls `POST /api/advisories/broadcast` |
| **13** | **Green Yatra Pass — Wired** | MEDIUM | Reroute CTA calls `POST /api/passes/issue`; pass ID rendered in `EcoPassCard.tsx` |
| **14** | **24x7 AI Tourism Helpline — Wired** | MEDIUM | `AiHelplineBot.tsx` calls `POST /api/ai/chat` with live metric context |
| **15** | **Developer Production Monitoring Portal** | HIGH | `DevPortal.tsx` with data transparency, SIH audit, API registry, SQLite viewer |

---

## 2. Partially Executed & Active Tasks Summary

See **[TODO_PARTIAL.md](./TODO_PARTIAL.md)** for full task breakdowns, dependencies, and definitions of done.

| # | Feature / Capability | Priority | Current Operational Implementation | Next Action Required |
|---|---|:---:|---|---|
| **16** | **MTDC Operator Room Occupancy Persistence** | MEDIUM | Provider UI slider built; backend `PUT /api/destinations/{id}/occupancy` wired | Verify persistence into in-memory cache across restarts |
| **17** | **Off-Peak Incentive Schemes** | MEDIUM | `promotions` SQLite table; UI coupon card built | Expose `GET/POST /api/promotions` backend endpoints |
| **18** | **Trilingual Localization (I18n)** | LOW | 55+ key English, Hindi, and Marathi dictionary compiled | Wire language dropdown switcher in `Navbar.tsx` |
| **19** | **Production API Keys (TomTom, BestTime)** | HIGH | Heuristic fallbacks fully operational | Configure live production API keys in `.env` |

---

## 3. Not Started & Future Roadmap Features Summary

See **[TODO_FUTURE.md](./TODO_FUTURE.md)** for full task breakdowns, dependencies, and definitions of done.

| # | Feature / Capability | Priority | Target Milestone | Description |
|---|---|:---:|---|---|
| **20** | **Edge FASTag IoT ANPR Streaming** | HIGH | Sprint 6 | Real-time vehicle counts from highway toll plazas via MQTT |
| **21** | **Distributed Redis Caching Layer** | MEDIUM | Sprint 7 | Multi-node caching & pub/sub advisory streaming |
| **22** | **CDAC / NIC SMS & WhatsApp Alerts** | HIGH | Sprint 6 | Automated emergency SMS to tourists in geofenced red zones |
| **23** | **PostgreSQL & PostGIS Cloud DB** | MEDIUM | Sprint 8 | Spatial indexing and high-concurrency cloud persistence |
| **24** | **Real FASTag Inflow Data Integration** | HIGH | Sprint 6 | Replace TomTom heuristic with NHAI FASTag vehicle count APIs |
| **25** | **Gemini API Integration for AI Chat** | HIGH | Sprint 5 | Replace keyword-matching chat with Gemini API + telemetry grounding |
| **26** | **WebSocket Real-Time Push** | MEDIUM | Sprint 7 | Replace 25s polling with WebSocket for instant advisory push |
