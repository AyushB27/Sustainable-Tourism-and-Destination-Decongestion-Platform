# Future Features & Roadmap Tasks (TODO: NOT STARTED)

This document tracks all **not started, planned, or long-term roadmap features** for **EcoRoute Bharat**. These represent architectural enhancements, external infrastructure integrations, and scalability milestones.

For completed features, see [TODO_DONE.md](./TODO_DONE.md).  
For partially executed/active tasks, see [TODO_PARTIAL.md](./TODO_PARTIAL.md).  
For the master summary index, see [TODO.md](./TODO.md).

---

## Progress Summary: Future Roadmap Features

| # | Feature / Capability | Priority | Target Milestone | Description |
|---|---|:---:|---|---|
| **20** | Edge FASTag IoT ANPR Camera Streaming | HIGH | Sprint 6 | Real-time vehicle counts from toll plazas via MQTT |
| **21** | Distributed Redis Caching Layer | MEDIUM | Sprint 7 | Multi-node caching & pub/sub advisory streaming |
| **22** | CDAC / NIC SMS & WhatsApp Alert Gateway | HIGH | Sprint 6 | Automated emergency SMS to tourists in geofenced red zones |
| **23** | Cloud PostgreSQL & PostGIS Spatial Migration | MEDIUM | Sprint 8 | Spatial indexing and high-concurrency cloud persistence |
| **24** | Real FASTag Inflow Data Integration | HIGH | Sprint 6 | Replace TomTom heuristic model with NHAI FASTag vehicle count APIs |
| **25** | Gemini API Integration for AI Chat | HIGH | Sprint 5 | Upgrade keyword-matching chat to Gemini with destination telemetry grounding |
| **26** | WebSocket Real-Time Push | MEDIUM | Sprint 7 | Replace 25s polling with WebSocket for instant advisory push & telemetry updates |

---

## Detailed Feature Specifications & Tasks

### 20. Edge FASTag IoT ANPR Camera Streaming
Status: NOT STARTED | Priority: HIGH | Milestone: Sprint 6

#### Description
Integrate edge IoT cameras equipped with Automatic Number Plate Recognition (ANPR) and FASTag RFID readers at key highway toll plazas (e.g. Khandala, Khopoli, Khalapur) to stream physical vehicle counts into the telemetry pipeline via an MQTT broker.

#### Tasks
- [ ] Deploy MQTT subscriber daemon in backend (`backend/app/pipelines/fastag_mqtt.py`)
- [ ] Ingest live vehicle inflow counts per minute from toll checkpoints
- [ ] Calibrate physical vehicle inflow against destination baseline capacities
- [ ] Replace synthetic traffic multipliers with actual toll camera throughput

---

### 21. Distributed Redis Caching Layer
Status: NOT STARTED | Priority: MEDIUM | Milestone: Sprint 7

#### Description
Replace Python's in-memory telemetry dictionary with a distributed Redis instance to enable multi-worker horizontal scaling, rate limiting, and pub/sub message broadcasting across distributed backend containers.

#### Tasks
- [ ] Set up Redis connection pool in `backend/app/config.py`
- [ ] Cache destination telemetry snapshots with 60-second TTL
- [ ] Implement Redis Pub/Sub for instantaneous gazette advisory broadcasting

---

### 22. CDAC / NIC SMS & WhatsApp Alert Gateway
Status: NOT STARTED | Priority: HIGH | Milestone: Sprint 6

#### Description
Automated integration with CDAC or National Informatics Centre (NIC) SMS gateways to broadcast emergency cell-broadcast messages and WhatsApp alerts to tourists traveling toward high-hazard or critically congested destinations.

---

### 23. Cloud PostgreSQL & PostGIS Spatial Migration
Status: NOT STARTED | Priority: MEDIUM | Milestone: Sprint 8

#### Description
Migrate SQLite single-node storage to enterprise managed PostgreSQL with PostGIS extension for corridor-wide geospatial queries, polygon geofencing, and multi-tenant authority partitioning.

---

### 24. Real FASTag Inflow Data Integration
Status: NOT STARTED | Priority: HIGH | Milestone: Sprint 6

#### Description
Replace the TomTom heuristic diurnal model with actual NHAI FASTag vehicle count APIs once government credentials and toll concessionaire API access are granted.

#### Tasks
- [ ] Connect to NHAI FASTag API endpoint for Western Ghats toll plazas (Khalapur, Talegaon, Khed Shivapur)
- [ ] Parse real-time electronic toll collection (ETC) records for destination-bound vehicular volume
- [ ] Compute live highway delay factors from vehicle passage velocity rather than time-of-day multipliers

---

### 25. Gemini API Integration for AI Chat
Status: NOT STARTED | Priority: HIGH | Milestone: Sprint 5

#### Description
Upgrade the current rule-based AI Tourism Helpline assistant with a proper Gemini model using the `google-genai` SDK. The endpoint will dynamically ground user queries with real-time destination telemetry (DCC score, rain mm, queue wait times, parking saturation) as context prompts.

#### Tasks
- [ ] Integrate `@google/genai` or Python `google-genai` client in backend
- [ ] Construct grounding prompt injecting live 7-destination telemetry snapshot
- [ ] Implement streaming multi-turn conversation with memory
- [ ] Support multilingual voice queries via Web Speech API

---

### 26. WebSocket Real-Time Push
Status: NOT STARTED | Priority: MEDIUM | Milestone: Sprint 7

#### Description
Replace the frontend's 25-second HTTP polling interval with a persistent WebSocket connection to provide sub-second emergency advisory dispatch, live crowd counter updates, and instant corridor stress transitions without page refreshing.

#### Tasks
- [ ] Add WebSocket server support in Python backend
- [ ] Broadcast telemetry diff events upon each 60s ETL cycle completion
- [ ] Push newly published Gazette advisories immediately to connected tourist clients
