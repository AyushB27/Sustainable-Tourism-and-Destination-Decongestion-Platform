# EcoRoute Bharat (SIH26204)

> **AI-Driven Sustainable Tourism Decongestion, Live Telemetry Pipeline & Multi-Stakeholder Gatekeeper Platform**

Developed for the Ministry of Tourism (Govt. of India), Maharashtra Tourism Development Corporation (MTDC), and District Disaster Management Authorities.

---

## Key Highlights

- 🏢 **Dedicated Portal Workspace Selection Gateway (`/`)**: High-impact portal launchpad cleanly separating Citizen/Tourist (`/tourist`), District Authority (`/authority`), MTDC Hospitality (`/provider`), and Developer Diagnostics (`/dev`).
- 🛡️ **Role-Isolated Layout Shells & Strict Guarding**: 4 independent layout shells (`TouristLayout`, `AuthorityLayout`, `ProviderLayout`, `DevLayout`) and strict `RoleGuard` wrapper preventing role cross-contamination.
- 🔐 **Dedicated Modern Authentication & Multi-Portal Session Manager**: Full-page authentication (`/login`, `AuthPage.tsx`) with 1-click fast demo profiles, 7-day token persistence, and role-isolated `sessionManager.ts`.
- 🎨 **Modern Travel-Tech SaaS Interface**: Replaced outdated government website tropes with a sleek, high-contrast travel-tech and operations SaaS UI (Linear / Stripe / Airbnb standard).
- 🧭 **Tourist-First Canonical Destination Architecture**: Every destination has exactly one authoritative page at `/spot/:spotId` containing universal tourist intelligence. Administrative and business roles conditionally attach management tools onto the destination.
- 🔍 **3-Tier Fuzzy Search Resolution (Fuse.js)**: Instant autocomplete grouping queries into **Spots** (`LON`), **Districts** (`Pune`, `Raigad`, `Satara`), and **States** (`Maharashtra`) without guessing.
- 🌿 **Algorithmic Demand Diffusion Feed (`/discover`)**: Re-ranks destinations using: `45% Travel Style Affinity + 30% Crowd Headroom + 25% Under-Visited Boost`.
- 📊 **Auditable Data Provenance (Tiers 1–4)**: Transparent telemetry breakdown tracing every metric back to ground-truth sensors, calibrated APIs, diurnal algorithms, or statutory studies with live confidence scoring.
- 🗺️ **Full React Router DOM v7 Implementation**: Complete bookmarkable client routing covering search, regional exhaustive directories, spot pages, trip planners, and stakeholder consoles.
- ⚡ **Multithreaded Concurrent Telemetry Engine**: Python 3.13 backend utilizing `ThreadingHTTPServer` and `ThreadPoolExecutor` with in-memory OSM POI density caching.
- 📡 **BestTime Live Footfall Telemetry & Dev Inspector**: Direct attraction footfall busyness ingestion using BestTime.app public API tokens, 3 archetype venue profile mappings, physical calibration multipliers, and a live query inspector in `/dev`.
- 📈 **Visual Numerical Forecasts & Weekly Crowd Rhythms**: Interactive point-and-stem visual graphs with condition-based color states (🟢 Optimal, 🟡 Moderate, 🔴 Peak) across the 12-hour hourly forecast and 7-day historical weekly rhythm strips.

---

## Application Route Directory

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

---

## Quick Navigation to Documentation

All comprehensive project documentation is organized in the [`docs/`](./docs) directory:

- 🎯 **[Problem Statement & Traceability Matrix](./docs/PROBLEM_STATEMENT.md)** — Official Smart India Hackathon PS (SIH26204) & 14-requirement mapping *(Immutable Reference — Do Not Modify)*.
- 📖 **[Main Documentation Entry Point](./docs/README.md)** — Project overview, current audit status, and index.
- 📋 **[Project Task Management (TODO)](./docs/TODO.md)** — Master task tracker ([Completed](./docs/TODO_DONE.md) • [Partially Executed](./docs/TODO_PARTIAL.md) • [Future Roadmap](./docs/TODO_FUTURE.md)).
- 🌟 **[Features Specification](./docs/FEATURES.md)** — Plain-language guide to all platform capabilities, user flows, and limitations.
- 🏗️ **[System Architecture & Design](./docs/ARCHITECTURE.md)** — Architecture diagrams, data flow pipelines, and mathematical models.
- 🔌 **[REST API Reference](./docs/API.md)** — Complete endpoint directory, request/response examples, and schemas.
- 🗄️ **[Data Model & Database Schema](./docs/DATA_MODEL.md)** — SQLite tables, fields, constraints, and TypeScript interfaces.
- 💻 **[Development & Setup Guide](./docs/DEVELOPMENT.md)** — Prerequisites, installation commands, running the app, and test suites.
- 🗺️ **[Strategic Roadmap](./docs/ROADMAP.md)** — Long-term technical milestones, IoT cameras, and cloud scalability.

---

## Quick Start

### 1. Python Backend Server
```bash
cd backend
python test_backend.py   # Run automated unit tests
python main.py           # Starts REST server at http://127.0.0.1:8000
```
Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. React Frontend Portal
```bash
cd frontend
npm install              # Install dependencies
npm run dev              # Starts development server at http://localhost:5173
```
