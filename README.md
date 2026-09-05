# EcoRoute Bharat (SIH26204)

> **AI-Driven Sustainable Tourism Decongestion, Live Telemetry Pipeline & Multi-Stakeholder Gatekeeper Platform**

Developed for the Ministry of Tourism (Govt. of India), Maharashtra Tourism Development Corporation (MTDC), and District Disaster Management Authorities.

---

## Key Highlights

- 🧭 **Tourist-First Canonical Destination Architecture**: Every destination has exactly one authoritative page at `/spot/:spotId` containing universal tourist intelligence. Administrative and business roles conditionally attach management tools onto the destination.
- 🔍 **3-Tier Fuzzy Search Resolution (Fuse.js)**: Instant autocomplete grouping queries into **Spots** (`LON`), **Districts** (`Pune`, `Raigad`, `Satara`), and **States** (`Maharashtra`) without guessing.
- 🌿 **Algorithmic Demand Diffusion Feed (`/discover`)**: Re-ranks destinations using: `45% Travel Style Affinity + 30% Crowd Headroom + 25% Under-Visited Boost`.
- 📊 **Auditable Data Provenance (Tiers 1–4)**: Transparent telemetry breakdown tracing every metric back to ground-truth sensors, calibrated APIs, diurnal algorithms, or statutory studies with live confidence scoring.
- 🗺️ **Full React Router DOM v7 (16 Routes)**: Complete bookmarkable client routing covering search, regional exhaustive directories, spot pages, trip planners, and stakeholder consoles.
- ⚡ **Multithreaded Concurrent Telemetry Engine**: Python 3.13 backend utilizing `ThreadingHTTPServer` and `ThreadPoolExecutor` with in-memory OSM POI density caching.

---

## Application Route Directory

| Route | View | Description |
|---|---|---|
| `/` | `LandingPage` | Hero search box, live preview strip of top 5 corridor destinations |
| `/discover` | `DiscoverPage` | Personalized discovery feed with algorithmic promotion boost |
| `/search?q=` | `SearchResultsPage` | Dedicated 3-tier fuzzy search results breakdown |
| `/region/:type/:value` | `RegionPage` | Exhaustive regional spot directory sorted by crowd status |
| `/spot/:spotId` | `SpotPage` | **Canonical Destination Page** (8 universal sections + role panels) |
| `/plan/new` | `TripPlannerPage` | 4-step wizard with progressive profiling signup modal |
| `/plan/:tripId` | `SavedTripDetailPage` | Confirmed itinerary + Government Verified Green Pass Certificate |
| `/trips` | `MyTripsPage` | Traveler dashboard of saved trips and MTDC discount vouchers |
| `/account` | `AccountPage` | Progressive preferences (home city/state, 4 tap-cards, role gateway) |
| `/advisories` | `AdvisoriesPage` | Searchable official gazette dispatch system |
| `/authority` | `AuthorityCommandPage` | District GIS command center funneled into canonical spot pages |
| `/provider` | `ProviderConsolePage` | Homestay & operator console funneled into canonical spot pages |
| `/dev` | `DevPortal` | Production health monitoring, SIH26204 audit, and SQLite logs |

---

## Quick Navigation to Documentation

All comprehensive project documentation is organized in the [`docs/`](./docs) directory:

- 🎯 **[Problem Statement & Traceability Matrix](./docs/PROBLEM_STATEMENT.md)** — Official Smart India Hackathon PS (SIH26204) & 14-requirement mapping.
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
