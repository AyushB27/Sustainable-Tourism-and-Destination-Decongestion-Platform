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
| **DONE** | 6 | [TODO_DONE.md](./TODO_DONE.md) | Fully implemented, operational, and verified |
| **PARTIAL** | 12 | [TODO_PARTIAL.md](./TODO_PARTIAL.md) | Core logic/UI built; requires final wiring or API keys |
| **IN PROGRESS** | 0 | — | Active development tasks |
| **NOT STARTED** | 4 | [TODO_FUTURE.md](./TODO_FUTURE.md) | Future roadmap & infrastructure enhancements |
| **BLOCKED** | 0 | — | No blocking external dependencies |
| **TOTAL** | **22** | | Full scope across all platform tiers |

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

---

## 2. Partially Executed & Active Tasks Summary

See **[TODO_PARTIAL.md](./TODO_PARTIAL.md)** for full task breakdowns, dependencies, and definitions of done.

| # | Feature / Capability | Priority | Current Operational Implementation | Next Action Required |
|---|---|:---:|---|---|
| **7** | **Live Telemetry Pipeline** | HIGH | Open-Meteo live, fallbacks active, 60s SQLite daemon | Configure production TomTom & BestTime API keys |
| **8** | **4D Cosine Twin Recommender** | HIGH | Math engines verified; `TwinAlternativeCards.tsx` built | Connect dynamic destination selection in `TouristView.tsx` |
| **9** | **Citizen / Tourist Portal View** | HIGH | Responsive landscape layout; modular components built | Mount modular components into `TouristView.tsx` |
| **10** | **12-Hour Diurnal Demand Curve** | MEDIUM | Backend forecast endpoint works; Recharts chart built | Mount `DemandCurveChart.tsx` inside Tourist view |
| **11** | **Multi-Day Itinerary Planner** | MEDIUM | Backend generator tested; `FutureTripPlanner.tsx` built | Mount `FutureTripPlanner.tsx` inside Tourist view |
| **12** | **Digital Green Yatra Pass** | MEDIUM | SQLite table exists; `EcoPassCard.tsx` renders voucher | Wire reroute CTA to `POST /api/passes/issue` |
| **13** | **Gazette Advisory Broadcaster** | HIGH | SQLite table exists; dispatcher UI broadcasts locally | Wire dispatcher to `POST /api/advisories/broadcast` |
| **14** | **MTDC Operator Console** | MEDIUM | `ProviderView.tsx`, room slider, arrival timeline | Persist operator occupancy updates to backend |
| **15** | **Off-Peak Subsidy Schemes** | MEDIUM | `promotions` SQLite table; UI coupon card built | Expose `GET/POST /api/promotions` backend endpoints |
| **16** | **24x7 AI Tourism Helpline Bot** | MEDIUM | Floating drawer UI; live telemetry keyword matcher | Wire bot to `POST /api/ai/chat` |
| **17** | **Trilingual Localization (I18n)** | LOW | 55+ key English, Hindi, and Marathi dictionary compiled | Wire language dropdown switcher in `Navbar.tsx` |
| **18** | **Frontend Build Validation** | HIGH | Package config & lockfile configured | Run `npm install` and verify `npm run build` |

---

## 3. Not Started & Future Roadmap Features Summary

See **[TODO_FUTURE.md](./TODO_FUTURE.md)** for full task breakdowns, dependencies, and definitions of done.

| # | Feature / Capability | Priority | Target Milestone | Description |
|---|---|:---:|---|---|
| **19** | **Edge FASTag IoT ANPR Streaming** | HIGH | Sprint 6 | Real-time vehicle counts from highway toll plazas via MQTT |
| **20** | **Distributed Redis Caching Layer** | MEDIUM | Sprint 7 | Multi-node caching & pub/sub advisory streaming |
| **21** | **CDAC / NIC SMS & WhatsApp Alerts** | HIGH | Sprint 6 | Automated emergency SMS to tourists in geofenced red zones |
| **22** | **PostgreSQL & PostGIS Cloud DB** | MEDIUM | Sprint 8 | Spatial indexing and high-concurrency cloud persistence |
