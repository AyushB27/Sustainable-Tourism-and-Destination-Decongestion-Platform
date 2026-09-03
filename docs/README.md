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
1. **Citizens & Tourists**: Travelers looking for live crowd transparency, queue-free visiting time windows, personalized alternative destinations, and digital Green Travel passes with highway toll perks.
2. **District Authorities & Disaster Management**: District Magistrates (IAS), Highway Traffic Superintendents (IPS), and Disaster Management Officers requiring real-time GIS telemetry, capacity threshold alerts, and emergency gazette broadcast tools.
3. **Local Hospitality & MTDC Operators**: Homestays, resorts, and local tour guides who report live room inventory and publish off-peak subsidy vouchers to attract tourists during slow periods.

### Major Capabilities
- **Multi-Source Telemetry Ingestion**: Ingests live data from Open-Meteo (rainfall, wind, temperature), TomTom (traffic delay factors), BestTime.app (attraction footfall), OpenStreetMap (amenity nodes), and Open Government Data (data.gov.in benchmarks).
- **Dynamic Carrying Capacity (DCC) Modeling**: Mathematical engine balancing live tourist inflow against physical limits and environmental hazards.
- **4D Cosine Similarity Twin Recommender**: Vector-based recommendation engine matching traveler preferences across Scenic, Budget, Adventure, and Family dimensions to divert tourists to resilient twin destinations.
- **Predictive Diurnal Inflow Curves**: 12-hour hourly forecasts that identify optimal low-congestion departure windows.
- **Multi-Stakeholder Command Portals**: Three role-gated interfaces (Citizen Portal, District GIS Command Center, MTDC Provider Console) protected by RBAC and Jan Parichay mock authentication.
- **Emergency Gazette Dispatcher**: Administrative broadcast system for pushing urgent public advisories and weather warnings.
- **24x7 AI Tourism Helpline Assistant**: Floating chatbot widget ("Sahyadri Guide") answering visitor inquiries regarding crowd pressure and route safety.

---

## Current Status

Based on an audit of the current codebase:

| Metric | Count | Description |
|---|---:|---|
| **DONE** | 6 | Fully implemented, operational, and verified |
| **PARTIAL** | 12 | Functioning with mock/client-side fallback or awaiting full frontend-backend integration |
| **IN PROGRESS** | 0 | Active changes in-flight |
| **NOT STARTED** | 4 | Long-term planned infrastructure improvements |
| **BLOCKED** | 0 | No blocking dependencies identified |

---

## Documentation Index

Explore the dedicated documentation files below:

- [Problem Statement & Traceability Matrix](./PROBLEM_STATEMENT.md) — Official Smart India Hackathon PS (SIH26204), background, and requirement mapping.
- [Task Management Index (TODO)](./TODO.md) — Master task tracker and project status breakdown:
  - 🟢 [Completed Tasks (TODO_DONE.md)](./TODO_DONE.md) — 6 fully operational and verified features.
  - 🟡 [Partially Executed Tasks (TODO_PARTIAL.md)](./TODO_PARTIAL.md) — 12 active features requiring final wiring.
  - 🔵 [Future Roadmap Tasks (TODO_FUTURE.md)](./TODO_FUTURE.md) — 4 not started / planned infrastructure features.
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
