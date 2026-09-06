# EcoRoute Bharat - Architecture & Workflow Diagram Reference

This directory serves as the centralized, authoritative repository of all system architecture and workflow diagrams across all implementation phases of EcoRoute Bharat.

---

## Index of Architecture Diagrams

1. [End-to-End System Platform Architecture](#1-end-to-end-system-platform-architecture)
2. [Modern SaaS Multi-Role Authentication & Session Isolation](#2-modern-saas-multi-role-authentication--session-isolation)
3. [Dual-Layer Persistent API Caching Engine](#3-dual-layer-persistent-api-caching-engine)
4. [Machine Learning Forecasting & Benchmark Pipeline](#4-machine-learning-forecasting--benchmark-pipeline)
5. [Dynamic Carrying Capacity (DCC) Calculation Engine](#5-dynamic-carrying-capacity-dcc-calculation-engine)
6. [Twin Destination Matching & Traffic Diversion Workflow](#6-twin-destination-matching--traffic-diversion-workflow)
7. [Predictive Multi-Day Itinerary Decongestion Engine](#7-predictive-multi-day-itinerary-decongestion-engine)

---

## 1. End-to-End System Platform Architecture

Illustrates the complete data journey from live external sensor APIs (TomTom, BestTime, Open-Meteo, OSM, data.gov.in) through the backend analytical pipeline to the isolated stakeholder interfaces.

```mermaid
flowchart TD
    subgraph External Sensors & APIs
        TomTom[TomTom Traffic Flow API<br/>Speed & Congestion Delays]
        BestTime[BestTime.app API<br/>Footfall & Venue Busyness]
        OpenMeteo[Open-Meteo API<br/>Precipitation, Wind, Hazard]
        OSM[OpenStreetMap Overpass<br/>Amenities, Parking, POIs]
        OGD[data.gov.in OGD India<br/>Tourism State Benchmarks]
    end

    subgraph Ingestion & Cache Layer
        CacheMgr[Cache Manager<br/>SQLite api_cache + JSON Disk]
        TomTom & BestTime & OpenMeteo & OSM & OGD --> CacheMgr
        CacheMgr --> Worker[Background Worker Daemon<br/>60s Periodic Sync]
    end

    subgraph Core Analytical Engines
        Worker --> DB[(SQLite ecoroute.db<br/>WAL Mode Concurrency)]
        DB --> DCC[DCC Engine<br/>Dynamic Carrying Capacity]
        DB --> ML[ML Forecaster<br/>XGBoost 12-Hour Predictor]
        DB --> Twin[Twin Matcher<br/>4D Cosine Vector Engine]
        DB --> Itin[Itinerary Planner<br/>Multi-Day Load Balancer]
    end

    subgraph API Gateway & Endpoints
        FastAPI[Python FastAPI / HTTP Server<br/>Port 8000]
        DCC & ML & Twin & Itin --> FastAPI
        FastAPI --> AuthAPI[/api/auth/*]
        FastAPI --> DestAPI[/api/destinations/live]
        FastAPI --> MLAPI[/api/ml/forecast & benchmark]
        FastAPI --> CacheAPI[/api/cache/status]
    end

    subgraph Stakeholder Frontend Portals
        FastAPI --> Tourist[Tourist Portal<br/>Citizen Crowd Meters & Twin Cards]
        FastAPI --> Authority[District GIS Command Center<br/>Heatmaps, Capacity Overrides, Alerts]
        FastAPI --> Provider[Local Business Hub<br/>MTDC Operators, Inventory, Vouchers]
        FastAPI --> Dev[Developer Diagnostics<br/>Pipeline Inspector & Health]
    end
```

---

## 2. Modern SaaS Multi-Role Authentication & Session Isolation

Depicts the entry gateway, dedicated authentication modal, and independent session management ensuring strict stakeholder separation.

```mermaid
flowchart TD
    User([User Navigates to Platform]) --> PortalSelect[PortalSelectPage: Product Workspace Selector]

    PortalSelect -->|Card 1: Traveler| TravelerRoute{Has Traveler Session?}
    TravelerRoute -->|Yes / Guest| TouristShell[TouristLayout: Pure Consumer Travel UI]
    
    PortalSelect -->|Card 2: Operations| OpsAuthCheck{Has Authority Session?}
    OpsAuthCheck -->|No| AuthPageOps[AuthPage: /login?role=authority]
    AuthPageOps -->|Valid Token| AuthShell[AuthorityLayout: High-Tech Telemetry Deck]
    OpsAuthCheck -->|Yes| AuthShell

    PortalSelect -->|Card 3: Partners| ProvAuthCheck{Has Partner Session?}
    ProvAuthCheck -->|No| AuthPageProv[AuthPage: /login?role=provider]
    AuthPageProv -->|Valid Token| ProvShell[ProviderLayout: Merchant Hub]
    ProvAuthCheck -->|Yes| ProvShell

    subgraph Session Storage [Independent Role Session Storage]
        SessT[ecoroute_session_tourist<br/>Guest or Authenticated Traveler]
        SessA[ecoroute_session_authority<br/>District Magistrate / Police Token]
        SessP[ecoroute_session_provider<br/>Hospitality Operator Token]
        SessD[ecoroute_session_developer<br/>System Admin / Diagnostics Token]
    end

    subgraph Route Guard Enforcement
        AuthShell -.->|Enforce| Guard1[Blocks /tourist/* & /provider/* Nav]
        ProvShell -.->|Enforce| Guard2[Blocks /authority/* & /tourist/* Nav]
        TouristShell -.->|Enforce| Guard3[Blocks /authority/* & /provider/* Nav]
    end
```

---

## 3. Dual-Layer Persistent API Caching Engine

Shows the multi-tier caching mechanism that eliminates redundant external API calls, preserves token quotas, and guarantees sub-2ms response latencies.

```mermaid
flowchart TD
    Req[Incoming Telemetry Query / Background Sweep] --> ResolveKey[Generate Key: source:destination_id or source:lat,lon]
    
    ResolveKey --> CheckMem[1. In-Memory Micro-Cache]
    CheckMem -->|Hit (< 0.1ms)| ReturnActive[Return Cached Telemetry + TTL Remaining]
    
    CheckMem -->|Miss| CheckDB[2. SQLite api_cache Table Query]
    CheckDB -->|Active Entry Found (< 1.5ms)| UpdateMem[Populate Micro-Cache & Return]
    
    CheckDB -->|DB Locked or Miss| CheckFile[3. Disk Backup JSON Inspection]
    CheckFile -->|Valid Backup Found (< 3ms)| ReturnActive
    
    CheckFile -->|Expired or Key Not Found| CallAPI[4. Dispatch External Live API Call]
    
    CallAPI -->|Network Success| DualWrite[Dual-Write Persistence]
    DualWrite --> WriteDB[(Upsert SQLite api_cache)]
    DualWrite --> WriteFile[Write data/cache_backups/*.json]
    
    DualWrite --> ReturnLive[Return Live Telemetry to Pipeline]
    
    CallAPI -->|Network Failure / Quota Exhaustion| Fallback[5. Heuristic Fail-Soft Simulation]
    Fallback --> ReturnLive
```

---

## 4. Machine Learning Forecasting & Benchmark Pipeline

Illustrates data synthesis, feature transformation, chronological train/validation/test splitting, multi-model benchmark comparison, and production serving.

```mermaid
flowchart TD
    subgraph Data Synthesis Layer
        Gen[Historical Sensor Generator: 18 Months] --> RawCSV[(training_historical_telemetry.csv)]
        RawCSV --> ChronoSplit[Chronological Split:<br/>70% Train / 15% Val / 15% Test]
    end

    subgraph Feature Engineering
        ChronoSplit --> FeatEng[Temporal Cyclical Features<br/>Lag Windows: 1h, 2h, 24h, 168h<br/>Rolling Mean/Std: 6h<br/>Sensor Covariance: Rain x Traffic]
        FeatEng --> Scaler[StandardScaler Fitted EXCLUSIVELY on Train Split]
    end

    subgraph Benchmark Suite
        Scaler --> B1[Baseline 1: Naive Persistence y_t-168]
        Scaler --> B2[Baseline 2: Diurnal Rule Heuristic]
        Scaler --> B3[Baseline 3: Ridge L2 Regression]
        Scaler --> B4[Baseline 4: Random Forest Regressor]
        Scaler --> B5[Champion: XGBoost Regressor]
    end

    subgraph Evaluation & Critical Breach Alerting
        B1 & B2 & B3 & B4 & B5 --> CompMetrics[Compare Metrics:<br/>MAE, RMSE, MAPE, Directional MDA, R²]
        CompMetrics --> Classifier[Critical Congestion Classifier >85% DCC:<br/>Precision, Recall, F1, PR-AUC]
        Classifier --> ModelArtifact[Export Trained Model:<br/>data/models/xgboost_crowd_forecaster.json]
    end

    subgraph Live Production Serving
        ModelArtifact --> FastInference[ml_forecaster.py Inference Engine]
        FastInference --> API1[GET /api/ml/forecast/:id]
        FastInference --> API2[GET /api/ml/benchmark]
        FastInference --> LiveDCC[dcc_calculator.py Live Forecast]
    end
```

---

## 5. Dynamic Carrying Capacity (DCC) Calculation Engine

Details the mathematical calculation pipeline that dynamically bounds tourism capacity based on real-time environmental and infrastructure stressors.

```mermaid
flowchart LR
    subgraph Input Dimensions
        BCC[Base Physical Carrying Capacity<br/>BCC_max]
        Weather[Weather Stressor<br/>Rainfall + Wind Hazard]
        Traffic[Traffic Congestion<br/>TomTom Delay Multiplier]
        Amenities[Infrastructure Buffer<br/>Parking + Water Availability]
    end

    subgraph Environmental Modifiers
        Weather --> M_env["M_env = max(0.4, 1.0 - 0.6 * Hazard)"]
        Traffic --> M_infra["M_infra = max(0.5, 1.0 / DelayFactor)"]
        Amenities --> M_soc["M_soc = 0.85 + 0.15 * AmenityRatio"]
    end

    subgraph Dynamic Threshold
        BCC & M_env & M_infra & M_soc --> DCC_Calc["DCC = BCC_max * M_env * M_infra * M_soc"]
    end

    subgraph Real-Time Saturation
        LiveFootfall[Current Live Visitor Count] & DCC_Calc --> Ratio["Load Ratio = LiveFootfall / DCC"]
        Ratio --> Status{Zone Classification}
        Status -->|Ratio < 0.60| Green[Green Zone: Normal Capacity]
        Status -->|0.60 <= Ratio < 0.85| Yellow[Yellow Zone: Advisory Alert]
        Status -->|Ratio >= 0.85| Red[Red Zone: Critical Breach - Reroute]
    end
```

---

## 6. Twin Destination Matching & Traffic Diversion Workflow

Shows how over-congested source destinations are matched with ecologically resilient "twin" alternates using 4D vector cosine similarity.

```mermaid
flowchart TD
    RedZone[Over-Congested Source Destination<br/>DCC Load Ratio >= 0.85] --> Vectorize[Extract 4D Feature Vector:<br/>Elevation, Terrain Type, Budget Index, Activity Profile]
    
    Vectorize --> Filter[Candidate Filter:<br/>Twin Destination DCC Load Ratio < 0.65<br/>Within Corridor Travel Distance <= 60km]
    
    Filter --> Cosine[Compute 4D Cosine Similarity Score:<br/>cos(theta) = (A . B) / (||A|| * ||B||)]
    
    Cosine --> Rank[Rank Alternates by Cosine Match * (1 - DCC_twin)]
    
    Rank --> TopTwin[Select Top-1 Twin Destination]
    
    TopTwin --> Incentive[Generate Decongestion Incentive Voucher:<br/>MTDC 15% Stay Discount + Priority Eco-Pass]
    
    Incentive --> Push[Push Real-Time Advisory to Tourist Portal & Navigation Map]
```

---

## 7. Predictive Multi-Day Itinerary Decongestion Engine

Shows how multi-day trip itineraries are balanced across space and time to smooth crowd peaks before tourists arrive.

```mermaid
flowchart TD
    TripInput[Tourist Inputs Trip Parameters:<br/>Dates, Corridor, Pace, Group Size] --> GenItin[Generate Candidate Attraction Nodes]
    
    GenItin --> QueryML[Query 12-Hour & 7-Day ML Forecast Engine]
    
    QueryML --> Matrix[Build Congestion Cost Matrix for Each Day/Slot]
    
    Matrix --> Opt[Greedy Time-Slot Assignment Optimizer:<br/>Route high-density spots to off-peak morning hours<br/>Route off-peak twin spots to afternoon rush hours]
    
    Opt --> Carbon[Compute Carbon & Travel Delay Savings]
    
    Carbon --> Output[Render Decongested Itinerary with Green Yatra Eco-Score]
```
