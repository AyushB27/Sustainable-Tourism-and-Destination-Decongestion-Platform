# REST API Reference Specification

This document provides complete documentation for the REST API exposed by the **EcoRoute Bharat** backend server (`backend/main.py`).

The server runs by default at `http://127.0.0.1:8000`. An interactive Swagger UI is also accessible directly in any browser at `http://127.0.0.1:8000/docs`.

---

## Endpoint Directory

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| `GET` | [`/api/destinations/live`](#get-apidestinationslive) | Live multi-source telemetry and DCC metrics for all 7 destinations | None |
| `GET` | [`/api/destinations/{id}/forecast`](#get-apidestinationsidforecast) | 12-hour hourly predictive demand curve for a destination | None |
| `POST` | [`/api/recommendations/twin`](#post-apirecommendationstwin) | 4D cosine similarity matching for under-visited twin spots | None |
| `POST` | [`/api/itinerary/plan`](#post-apiitineraryplan) | Generates multi-day decongested trip itineraries | None |
| `POST` | [`/api/ai/chat`](#post-apiaichat) | Grounded AI helpline assistant responses | None |
| `POST` | [`/api/auth/login`](#post-apiauthlogin) | Stakeholder login (officers, providers, citizen guests) | Credentials / Token |
| `GET` | [`/api/advisories`](#get-apiadvisories) | Lists all published emergency gazette advisories | None |
| `POST` | [`/api/advisories/broadcast`](#post-apiadvisoriesbroadcast) | Publishes a new administrative gazette advisory | None (Body metadata) |
| `GET` | [`/api/passes`](#get-apipasses) | Lists recently issued digital Green Yatra passes | None |
| `POST` | [`/api/passes/issue`](#post-apipassesissue) | Issues a new Green Yatra travel pass with QR code | None (Body metadata) |
| `GET` | [`/api/health`](#get-apihealth) | System health diagnostics and pipeline status | None |
| `GET` | [`/docs`](#get-docs) | Interactive Swagger UI API documentation | None |
| `GET` | [`/openapi.json`](#get-openapijson) | OpenAPI 3.0.3 machine-readable schema definition | None |

---

## GET /api/destinations/live

### Purpose
Fetches the latest cached multi-source sensor telemetry, Dynamic Carrying Capacity (DCC) scores, operational status, weather metrics, and highway delays across all 7 monitored destinations.

### Authentication
None required (Public endpoint).

### Parameters
None.

### Request
```http
GET /api/destinations/live HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json
```

### Response
```json
{
  "status": "success",
  "timestamp": "2026-09-03T22:55:00.123456",
  "data_sources": {
    "weather": "Open-Meteo Live Precipitation API",
    "traffic": "TomTom Traffic Flow API (Diurnal Fallback)",
    "footfall": "BestTime.app API (Hourly Model)",
    "osm": "Overpass Turbo (Live Nodes)",
    "ogd_india": {
      "source": "OGD India (Government Open Data Benchmark)",
      "annual_dtv_growth_pct": 14.8,
      "seasonal_monsoon_index": 1.42
    }
  },
  "destinations": [
    {
      "id": "LON",
      "name": "Lonavala & Khandala",
      "category": "Hill Station",
      "district": "Pune District, MH",
      "tagline": "Misty Waterfalls & Rajmachi Escarpment",
      "description": "Maharashtra's prime hill corridor facing peak monsoon weekend gridlocks.",
      "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      "coordinates": [18.7557, 73.4091],
      "physical_capacity": 10000,
      "current_inflow": 11800,
      "dcc_score": 0.89,
      "status": "CRITICAL",
      "capacity_utilization": 1.18,
      "estimated_wait_minutes": 38,
      "live_sensors": {
        "weather": {
          "temperature_c": 21.4,
          "rain_mm": 4.2,
          "wind_kmh": 14.0,
          "hazard_score": 0.28,
          "source": "Open-Meteo Live API",
          "status": "connected"
        },
        "traffic": {
          "delay_factor": 1.85,
          "current_speed_kmh": 32.4,
          "free_flow_speed_kmh": 60.0,
          "source": "TomTom Heuristic Diurnal Model",
          "status": "simulated"
        },
        "footfall": {
          "footfall_factor": 1.35,
          "live_busyness_pct": 67,
          "source": "BestTime Hourly Model",
          "status": "simulated"
        },
        "osm_amenities": {
          "osm_poi_nodes": 22,
          "osm_status": "live_verified"
        }
      },
      "features": [0.90, 0.70, 0.50, 0.90],
      "avg_dwell_time_hours": 3.5
    }
  ]
}
```

### Errors
| Code | Reason |
|---|---|
| 500 Internal Server Error | Unexpected error reading telemetry cache |

### Used By
- `frontend/src/store/useCorridorStore.ts` via `fetchLiveBackendFeed()`, invoked every 25 seconds by `App.tsx`.

---

## GET /api/destinations/{id}/forecast

### Purpose
Calculates a 12-hour hourly predictive tourist inflow and wait-time curve for the specified destination from 06:00 AM to 06:00 PM.

### Authentication
None required.

### Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | string (path) | Yes | Destination ID (e.g. `LON`, `MAT`, `ALB`, `BHA`, `KAS`, `MAH`, `TAP`). Case-insensitive. |

### Request
```http
GET /api/destinations/LON/forecast HTTP/1.1
Host: 127.0.0.1:8000
```

### Response
```json
{
  "status": "success",
  "destination_id": "LON",
  "destination_name": "Lonavala & Khandala",
  "forecast_points": [
    {
      "hour": "06:00",
      "time_label": "06:00 AM",
      "inflow": 4130,
      "capacity": 10000,
      "dcc_score": 0.37,
      "status": "OPTIMAL",
      "wait_minutes": 0
    },
    {
      "hour": "12:00",
      "time_label": "12:00 PM",
      "inflow": 15930,
      "capacity": 10000,
      "dcc_score": 1.0,
      "status": "CRITICAL",
      "wait_minutes": 125
    }
  ]
}
```

### Errors
| Code | Reason |
|---|---|
| 404 Not Found | Destination ID is not recognized |

### Used By
- Diurnal forecast component (`DemandCurveChart.tsx`).

---

## POST /api/recommendations/twin

### Purpose
Applies 4D vector cosine similarity to recommend under-visited, ecologically safe twin alternatives (DCC < 0.70) matching a target destination and user preferences.

### Authentication
None required.

### Parameters (JSON Body)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `target_destination_id` | string | Optional (Default: `"LON"`) | Target destination ID to find alternatives for |
| `user_preferences` | array of 4 floats | Optional (Default: `[0.90, 0.70, 0.60, 0.85]`) | Normalized weights `[Scenic, Budget, Adventure, Family]` |

### Request
```http
POST /api/recommendations/twin HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "target_destination_id": "LON",
  "user_preferences": [0.95, 0.60, 0.40, 0.90]
}
```

### Response
```json
{
  "status": "success",
  "target_destination": "Lonavala & Khandala",
  "target_dcc": 0.89,
  "total_twins_evaluated": 6,
  "recommendations": [
    {
      "destination": {
        "id": "MAT",
        "name": "Matheran Eco-Zone",
        "category": "Hill Station",
        "dcc_score": 0.28,
        "current_inflow": 1850
      },
      "similarity_score": 0.962,
      "candidate_dcc_score": 0.28,
      "utility_score": 0.865,
      "crowd_reduction_pct": 84,
      "is_optimal_twin": true
    }
  ]
}
```

### Errors
| Code | Reason |
|---|---|
| 404 Not Found | Target destination ID does not exist in destination registry |

### Used By
- Alternative twin recommendations engine (`TwinAlternativeCards.tsx`).

---

## POST /api/itinerary/plan

### Purpose
Generates a multi-day decongested holiday itinerary that sequences visits to avoid bottleneck hours and incorporates verified MTDC homestay partners.

### Authentication
None required.

### Parameters (JSON Body)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `travel_date` | string | Optional (Default: `"2026-09-12"`) | Target start date in `YYYY-MM-DD` format |
| `duration` | string | Optional (Default: `"2-day"`) | Trip length (`"1-day"`, `"2-day"`, or `"3-day"`) |
| `travel_style` | string | Optional (Default: `"scenic"`) | Travel preference (`"scenic"`, `"adventure"`, `"budget"`, `"family"`) |

### Request
```http
POST /api/itinerary/plan HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "travel_date": "2026-09-12",
  "duration": "2-day",
  "travel_style": "scenic"
}
```

### Response
```json
{
  "status": "success",
  "plan": {
    "title": "Sahyadri Eco-Corridor Decongested Holiday Plan",
    "travel_date": "2026-09-12",
    "duration": "2-day",
    "travel_style": "scenic",
    "is_weekend": true,
    "estimated_time_saved_minutes": 110,
    "estimated_co2_offset_kg": 18.5,
    "itinerary_days": [
      {
        "day_label": "Day 1: Western Ghats Dawn & Eco-Twin Route",
        "slots": [
          {
            "time": "06:30 AM – 09:30 AM",
            "title": "Early Dawn Hotspot Transit (Lonavala & Tiger Point)",
            "location": "Lonavala (LON)",
            "status": "Optimal Green Window (DCC 0.35)",
            "desc": "Visit Rajmachi viewpoint during the morning off-peak window before highway rush.",
            "badge": "Off-Peak Transit"
          }
        ]
      }
    ]
  }
}
```

### Errors
None (Defaults to fallback weekend itinerary if date is invalid).

### Used By
- Multi-day trip planner (`FutureTripPlanner.tsx`).

---

## POST /api/ai/chat

### Purpose
Provides conversational responses to tourist inquiries regarding live crowd pressure, weather hazards, and recommended twin spots.

### Authentication
None required.

### Parameters (JSON Body)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `message` | string | Yes | Tourist query string |

### Request
```http
POST /api/ai/chat HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "message": "Is Lonavala crowded right now?"
}
```

### Response
```json
{
  "status": "success",
  "response": "📍 Lonavala & Khandala is currently at 0.89 DCC with an estimated 38 mins queue delay. We recommend diverting to Matheran Eco-Zone or Bhandardara to save ~65 mins.",
  "timestamp": "2026-09-03T22:55:00.123456"
}
```

### Used By
- Floating AI Tourism Helpline assistant (`AiHelplineBot.tsx`).

---

## POST /api/auth/login

### Purpose
Authenticates administrative officers (District Collectors, Police SPs), MTDC tourism providers, or guest citizens.

### Authentication
Evaluates supplied identifier and password against `STAKEHOLDERS_DIRECTORY`.

### Parameters (JSON Body)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `identifier` | string | Yes | Officer email (e.g. `pune.collector@gov.in`), MTDC ID (`MTDC/2026/HOTEL-99`), or citizen ID |
| `password` | string | Optional | Stakeholder password (`officer@pune`, `officer@raigad`, `provider@matheran`, or demo bypass) |
| `role` | string | Optional (Default: `"citizen"`) | Requested role (`"authority"`, `"provider"`, `"tourist"`) |

### Request
```http
POST /api/auth/login HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "identifier": "pune.collector@gov.in",
  "password": "officer@pune",
  "role": "authority"
}
```

### Response (200 OK)
```json
{
  "status": "success",
  "message": "Authentication successful",
  "user": {
    "id": "AUTH-PUNE-01",
    "name": "Dr. Rajeshwar Patil, IAS",
    "role": "authority",
    "designation": "District Magistrate & Disaster Management Officer",
    "department": "Pune District Administration & MSRDC Corridor Cell",
    "badgeNumber": "IAS-MH-2018-9412",
    "isAuthenticated": true,
    "token": "token-gov-1788456900"
  }
}
```

### Errors
| Code | Reason |
|---|---|
| 401 Unauthorized | Invalid stakeholder credentials provided for authority/provider roles |

### Used By
- `frontend/src/components/auth/AuthModal.tsx`.

---

## GET /api/advisories

### Purpose
Retrieves all published emergency gazette notices, road warnings, and flood advisories stored in the SQLite database, ordered descending by timestamp.

### Authentication
None required.

### Request
```http
GET /api/advisories HTTP/1.1
Host: 127.0.0.1:8000
```

### Response
```json
{
  "status": "success",
  "total_advisories": 2,
  "advisories": [
    {
      "id": "ADV-01",
      "destination_id": "LON",
      "destination_name": "Lonavala & Khandala",
      "severity": "high",
      "title": "Expressway Ghat Congestion Alert",
      "message": "Heavy monsoon vehicular bottleneck between Khandala tunnel and Rajmachi point.",
      "author": "Pune District Collectorate",
      "active": 1,
      "created_at": "2026-09-03T22:00:00"
    }
  ]
}
```

### Used By
- Public advisory banner feeds and authority incident logs.

---

## POST /api/advisories/broadcast

### Purpose
Publishes a new emergency gazette advisory and writes it directly to the SQLite `gazette_advisories` table.

### Authentication
Typically restricted to Authority role.

### Parameters (JSON Body)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `destination_id` | string | Optional (Default: `"ALL"`) | Target destination ID or `"ALL"` |
| `destination_name` | string | Optional (Default: `"All Destinations"`) | Human-readable destination name |
| `severity` | string | Optional (Default: `"high"`) | Alert level: `"low"`, `"medium"`, `"high"`, or `"critical"` |
| `title` | string | Yes | Advisory headline |
| `message` | string | Yes | Complete advisory text |
| `author` | string | Optional | Agency issuing the alert |

### Request
```http
POST /api/advisories/broadcast HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "destination_id": "LON",
  "destination_name": "Lonavala & Khandala",
  "severity": "critical",
  "title": "Heavy Fog on Amrutanjan Bridge",
  "message": "Dense fog reducing visibility below 20m. Ghat section speed restricted to 30 km/h.",
  "author": "Highway Police Command"
}
```

### Response
```json
{
  "status": "success",
  "message": "Advisory broadcast successfully logged into Gazette",
  "advisory_id": "ADV-1788457000"
}
```

### Used By
- District Authority emergency dispatcher (`DigitalAdvisoryDispatcher.tsx`).

---

## GET /api/passes

### Purpose
Retrieves up to 50 of the most recently issued Green Yatra digital passes.

### Authentication
None required.

### Response
```json
{
  "status": "success",
  "total_passes_issued": 1,
  "passes": [
    {
      "id": "ECO-MH-1788457100",
      "destination_id": "MAT",
      "destination_name": "Matheran Eco-Zone",
      "citizen_name": "Rahul Verma",
      "carbon_saved_kg": 18.5,
      "issued_at": "2026-09-03T22:30:00",
      "fast_track_qr_code": "FASTPASS:ECO-MH-1788457100"
    }
  ]
}
```

---

## POST /api/passes/issue

### Purpose
Generates a new Green Yatra digital pass and persists it in the SQLite `green_yatra_passes` table.

### Authentication
None required.

### Parameters (JSON Body)
| Parameter | Type | Required | Description |
|---|---|---|---|
| `destination_id` | string | Optional (Default: `"MAT"`) | Destination ID rerouted to |
| `destination_name` | string | Optional (Default: `"Matheran Eco-Zone"`) | Destination name |
| `citizen_name` | string | Optional (Default: `"Citizen Traveler"`) | Name of pass holder |
| `carbon_saved_kg` | number | Optional (Default: `18.5`) | Calculated kilograms of CO₂ avoided |

### Request
```http
POST /api/passes/issue HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "destination_id": "MAT",
  "destination_name": "Matheran Eco-Zone",
  "citizen_name": "Pooja Deshmukh",
  "carbon_saved_kg": 19.2
}
```

### Response
```json
{
  "status": "success",
  "pass_id": "ECO-MH-1788457200",
  "fast_track_qr": "FASTPASS:ECO-MH-1788457200",
  "carbon_saved_kg": 19.2,
  "issued_at": "2026-09-03T22:55:00.123456"
}
```

### Used By
- Digital travel pass card (`EcoPassCard.tsx`).

---

## GET /api/health

### Purpose
System health check providing uptime status, database connectivity verification, API key configuration states, and a list of registered routes.

### Authentication
None required.

### Response
```json
{
  "service": "EcoRoute Bharat Data Pipeline & Engine",
  "status": "operational",
  "host": "127.0.0.1",
  "port": 8000,
  "timestamp": "2026-09-03T22:55:00.123456",
  "keys_status": {
    "tomtom": false,
    "besttime": false,
    "data_gov_in": false
  },
  "database": "SQLite (data/ecoroute.db connected)",
  "endpoints": [
    "GET  /api/destinations/live",
    "GET  /api/destinations/{id}/forecast",
    "POST /api/recommendations/twin",
    "POST /api/itinerary/plan",
    "POST /api/ai/chat",
    "POST /api/auth/login",
    "GET  /api/advisories",
    "POST /api/advisories/broadcast",
    "GET  /api/passes",
    "POST /api/passes/issue",
    "GET  /docs"
  ]
}
```

---

## GET /docs

### Purpose
Serves the interactive Swagger UI web interface directly in the browser via standard CDN assets.

---

## GET /openapi.json

### Purpose
Returns the complete OpenAPI 3.0.3 machine-readable schema for all registered endpoints.
