# Future Features & Roadmap Tasks (TODO: NOT STARTED)

This document tracks all **not started, planned, or long-term roadmap features** for **EcoRoute Bharat**. These represent architectural enhancements, external infrastructure integrations, and scalability milestones.

For completed features, see [TODO_DONE.md](./TODO_DONE.md).  
For partially executed/active tasks, see [TODO_PARTIAL.md](./TODO_PARTIAL.md).  
For the master summary index, see [TODO.md](./TODO.md).

---

## Progress Summary: Future Roadmap Features

| # | Feature / Capability | Priority | Target Milestone | Description |
|---|---|:---:|---|---|
| **19** | Edge FASTag IoT ANPR Camera Streaming | HIGH | Sprint 6 | Real-time vehicle counts from toll plazas via MQTT |
| **20** | Distributed Redis Caching Layer | MEDIUM | Sprint 7 | Multi-node caching & pub/sub advisory streaming |
| **21** | CDAC / NIC SMS & WhatsApp Alert Gateway | HIGH | Sprint 6 | Automated emergency SMS to tourists in geofenced red zones |
| **22** | Cloud PostgreSQL & PostGIS Spatial Migration | MEDIUM | Sprint 8 | Spatial indexing and high-concurrency cloud persistence |

---

## Detailed Feature Specifications & Tasks

### 19. Edge FASTag IoT ANPR Camera Streaming

Status: NOT STARTED

Priority: HIGH

#### Description
Integrate edge IoT cameras equipped with Automatic Number Plate Recognition (ANPR) and FASTag RFID readers at key highway toll plazas (e.g. Khandala, Khopoli, Khalapur) to stream physical vehicle counts into the telemetry pipeline via an MQTT broker.

#### Tasks
- [ ] Deploy MQTT subscriber daemon in backend (`backend/app/pipelines/fastag_mqtt.py`)
- [ ] Ingest live vehicle inflow counts per minute from toll checkpoints
- [ ] Calibrate physical vehicle inflow against destination baseline capacities
- [ ] Replace synthetic traffic multipliers with actual toll camera throughput

#### Dependencies
- NHAI / MSRDC FASTag API or physical edge camera gateway

#### Definition of Done
- [ ] Live vehicular passage rates stream into the telemetry pipeline every 60 seconds
- [ ] Destination inflow calculations dynamically reflect physical highway toll counts

---

### 20. Distributed Redis Caching Layer

Status: NOT STARTED

Priority: MEDIUM

#### Description
Replace Python's in-memory telemetry dictionary with a distributed Redis instance to enable multi-worker horizontal scaling, rate limiting, and pub/sub message broadcasting across distributed backend containers.

#### Tasks
- [ ] Set up Redis connection pool in `backend/app/config.py`
- [ ] Cache destination telemetry snapshots with 60-second TTL
- [ ] Implement Redis Pub/Sub for instantaneous gazette advisory broadcasting
- [ ] Implement token bucket rate limiting on public endpoints (`/api/destinations/live`)

#### Dependencies
- Redis server instance (local or managed cloud)

#### Definition of Done
- [ ] Multiple backend server workers read identical cached telemetry from Redis
- [ ] Advisory broadcasts trigger immediate pub/sub push notifications to connected clients

---

### 21. CDAC / NIC SMS & WhatsApp Alert Gateway

Status: NOT STARTED

Priority: HIGH

#### Description
Direct integration with Government of India CDAC / NIC SMS gateway and WhatsApp Business API to push critical disaster advisories and landslide warnings to tourist mobile devices entering geofenced red zones.

#### Tasks
- [ ] Integrate CDAC SMS gateway client library
- [ ] Implement geofenced trigger when destination DCC enters `CRITICAL` status
- [ ] Dispatch automated SMS notifications to registered Green Pass mobile numbers
- [ ] Support WhatsApp template messages for highway bottleneck diversions

#### Dependencies
- CDAC / NIC government gateway credentials

#### Definition of Done
- [ ] Publishing a `critical` gazette advisory automatically delivers SMS alerts to registered tourists within the affected corridor

---

### 22. Cloud PostgreSQL & PostGIS Spatial Migration

Status: NOT STARTED

Priority: MEDIUM

#### Description
Migrate persistence tier from local SQLite 3 database to cloud-hosted PostgreSQL with PostGIS spatial extensions for high-resolution geospatial queries, spatial indexing, and multi-node cloud deployments.

#### Tasks
- [ ] Define SQLAlchemy 2.0 ORM models and Alembic migration scripts
- [ ] Migrate `destinations`, `sensor_readings`, `green_yatra_passes`, `gazette_advisories`, and `promotions` schemas
- [ ] Add PostGIS geospatial distance queries (`ST_DWithin`, `ST_Distance`) for twin destination matching
- [ ] Benchmark high-concurrency read/write transactions against SQLite baseline

#### Dependencies
- Managed PostgreSQL instance with PostGIS extension enabled

#### Definition of Done
- [ ] All database reads and writes execute against cloud PostgreSQL with zero data loss
- [ ] Spatial queries correctly identify alternative destinations within specified geographic radii
