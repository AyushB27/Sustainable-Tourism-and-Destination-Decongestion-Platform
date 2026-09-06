# EcoRoute Bharat Documentation

Welcome to the official technical and operational documentation for **EcoRoute Bharat** (Smart India Hackathon project SIH26204).

EcoRoute Bharat is an AI-driven carrying capacity monitoring and sustainable tourism decongestion platform engineered for the Western Ghats and Maharashtra tourism corridors in partnership with the Ministry of Tourism (Govt. of India), Maharashtra Tourism Development Corporation (MTDC), and District Disaster Management Authorities.

---

## Project Overview

### What the Project Is
EcoRoute Bharat is a multi-tier cloud-edge system that actively monitors tourist footfall, highway delays, and weather hazards across sensitive eco-corridors. It balances tourism demand by mathematically computing crowd carrying capacity and providing personalized "twin destination" recommendations that guide travelers toward equally scenic, less-crowded alternatives.

### What Problem It Solves
Key hill stations and coastal hubs across the Sahyadri ranges—such as Lonavala, Khandala, Alibaug, and Mahabaleshwar—suffer from severe weekend and monsoon gridlocks:
- **Highway bottlenecks**: Multi-hour traffic jams along NH-48 and mountain ghat passes.
- **Ecological degradation**: Severe water stress, uncontrolled plastic waste, and localized carbon pollution.
- **Safety hazards**: Landslide risks during heavy precipitation and dense fog on bridge curves.
- **Uneven local economies**: Overloaded central destinations face resource exhaustion, while nearby scenic villages and accredited homestays remain under-visited.

### Who It Is Intended For
1. **Citizens & Tourists**: Travelers looking for live crowd transparency, queue-free visiting time windows, personalized alternative destinations, and digital Green Travel passes with homestay discount vouchers.
2. **District Authorities & Disaster Management**: District Magistrates (IAS), Highway Traffic Superintendents (IPS), and Disaster Management Officers requiring real-time GIS telemetry, capacity threshold alerts, emergency limits, and gazette broadcast tools.
3. **Local Hospitality & MTDC Operators**: Homestays, resorts, and local tour guides who report live room inventory and publish off-peak subsidy vouchers to attract tourists during slow periods.

### Major Architectural & Operational Capabilities
- **Dedicated Portal Workspace Selection Gateway (`/`)**: High-impact portal launchpad cleanly separating Citizen/Tourist (`/tourist`), District Authority (`/authority`), MTDC Hospitality (`/provider`), and Developer Diagnostics (`/dev`).
- **Role-Isolated Layout Shells & Strict Guarding**: 4 independent layout shells (`TouristLayout`, `AuthorityLayout`, `ProviderLayout`, `DevLayout`) and strict `RoleGuard` wrapper preventing role cross-contamination.
- **Dedicated Modern Authentication & Independent Session Manager**: Full-page auth (`/login`) with 1-click fast demo profiles, 7-day tokens, and role-isolated `sessionManager.ts`.
- **Modern Travel-Tech SaaS Interface**: Replaced outdated government website tropes with a sleek, high-contrast travel-tech and operations SaaS UI (Linear / Stripe / Airbnb standard).
- **Tourist-First Canonical Destination Architecture**: Every destination has exactly one authoritative page at `/spot/:spotId` containing universal tourist intelligence. Administrative and business roles conditionally attach management tools onto the destination.
- **3-Tier Fuzzy Search Resolution (Fuse.js)**: Instant autocomplete grouping queries into Spots (`LON`), Districts (`Pune`, `Raigad`, `Satara`), and States (`Maharashtra`) without guessing.
- **Multi-Source Telemetry Ingestion**: Ingests live data from Open-Meteo (rainfall, wind, temperature), TomTom (traffic delay factors), BestTime.app (attraction footfall), OpenStreetMap (amenity nodes), and Open Government Data (data.gov.in benchmarks).
- **Dual-Layer Persistent Caching Engine**: High-performance SQLite `api_cache` store with JSON disk durability backups in `backend/data/cache_backups/`. Enforces sensor-specific TTLs (Footfall: 6h, Weather: 30m, Traffic: 20m, OSM: 24h), delivering sub-1.8ms response times and preventing rate-limit exhaustion.
- **Predictive Machine Learning Forecasting Engine (XGBoost)**: Production-grade XGBoost regression (`xgboost_crowd_forecaster.json`) and breach classifier (`xgboost_breach_classifier.json`) trained on 91,980 hourly records across 18 months. Provides 12-hour hourly crowd forecasts with 95% confidence intervals and up to 4-hour advance warning of carrying capacity breaches.
- **Data Tier 1–4 Provenance**: Full audit breakdown tracing every metric back to ground-truth sensors, calibrated APIs, diurnal algorithms, or statutory studies with live confidence scoring (50%–98%).
- **Dynamic Carrying Capacity (DCC) Modeling**: Mathematical engine balancing live tourist inflow against physical limits and environmental hazards.
- **4D Cosine Similarity Twin Recommender**: Vector-based recommendation engine matching traveler preferences across Scenic, Budget, Adventure, and Family dimensions to divert tourists to resilient twin destinations.
- **Predictive Diurnal Inflow Curves**: 12-hour hourly forecasts that identify optimal low-congestion departure windows.
- **Smart 4-Step Trip Wizard & Progressive Profiling**: Generates eco-balanced day-by-day itineraries and issues official Government Verified Green Pass Certificates with QR codes.
- **Emergency Gazette Dispatcher**: Administrative broadcast system for pushing urgent public advisories and weather warnings.
- **24x7 AI Tourism Helpline Assistant**: Floating chatbot widget ("Sahyadri Guide") answering visitor inquiries regarding crowd pressure and route safety.

---

## Current Status

Based on an audit of the current codebase:

| Metric | Count | Description |
|---|---:|---|
| **DONE** | 26 | Fully implemented, operational, and verified |
| **PARTIAL** | 4 | Functioning with mock/client-side fallback or awaiting production API keys |
| **IN PROGRESS** | 0 | Active changes in-flight |
| **NOT STARTED** | 7 | Long-term planned infrastructure improvements |
| **BLOCKED** | 0 | No blocking dependencies identified |

---

## Documentation Index

Explore the dedicated documentation files below:

- 📑 **[Master Comprehensive Project Dossier](./PROJECT_COMPREHENSIVE_SUMMARY.md)** — Definitive 13-chapter technical reference detailing architecture, pipelines, ML models, benchmarks, equations, and deployment.
- 📐 **[Centralized Architecture Diagrams](./architecture_diagrams/README.md)** — Catalog of 7 high-resolution Mermaid diagrams illustrating end-to-end telemetry, machine learning, and multi-stakeholder workflows.
- [Problem Statement & Traceability Matrix](./PROBLEM_STATEMENT.md) — Official Smart India Hackathon PS (SIH26204), background, and requirement mapping *(Canonical & Immutable — Do Not Modify)*.
- [Task Management Index (TODO)](./TODO.md) — Master task tracker and project status breakdown:
  - 🟢 [Completed Tasks (TODO_DONE.md)](./TODO_DONE.md) — 26 fully operational and verified features.
  - 🟡 [Partially Executed Tasks (TODO_PARTIAL.md)](./TODO_PARTIAL.md) — 4 active features requiring final wiring/API keys.
  - 🔵 [Future Roadmap Tasks (TODO_FUTURE.md)](./TODO_FUTURE.md) — 7 not started / planned infrastructure features.
- [Features Specification](./FEATURES.md) — Plain-language guide to all platform capabilities, user flows, and current operational states.
- [System Architecture](./ARCHITECTURE.md) — Architectural design, data flow diagrams, state management, and backend-frontend interaction.
- [API Reference](./API.md) — Complete specification of all REST endpoints, request/response schemas, and integration notes.
- [Data Model](./DATA_MODEL.md) — Database schemas, entity relationships, and core TypeScript data structures.
- [Development Guide](./DEVELOPMENT.md) — Setup instructions, prerequisite versions, environment configuration, and verification workflows.
- [Roadmap](./ROADMAP.md) — Long-term technical initiatives, cloud scalability milestones, and IoT camera integrations.

---

## Where Should I Look?

| What do you want to do? | Recommended Document |
|---|---|
| Review official SIH26204 problem statement and requirement mapping | [PROBLEM_STATEMENT.md](./PROBLEM_STATEMENT.md) |
| Understand what needs to be done next | [TODO.md](./TODO.md) |
| Understand what features exist and how they work for users | [FEATURES.md](./FEATURES.md) |
| Understand how the system works internally and how data flows | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Inspect backend endpoints, payloads, and response structures | [API.md](./API.md) |
| Inspect database tables, fields, types, and schemas | [DATA_MODEL.md](./DATA_MODEL.md) |
| Set up, install, run, and test the project locally | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| See future expansion plans and scalability milestones | [ROADMAP.md](./ROADMAP.md) |
