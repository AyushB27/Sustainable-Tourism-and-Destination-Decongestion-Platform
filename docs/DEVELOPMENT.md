# Development & Contributing Guide

This guide contains everything a new developer needs to install, configure, run, test, and contribute to **EcoRoute Bharat**.

---

## 1. System Requirements & Prerequisites

The codebase is engineered to run with minimal local setup.

### Verified Runtimes
| Tool / Runtime | Tested Version | Minimum Required Version | Notes |
|---|---|---|---|
| **Python** | `3.13.1` | `>= 3.10` | Standard library `http.server`, `sqlite3`, `json`, `urllib` |
| **Node.js** | `v22.13.0` | `>= 18.0.0` | Powers the React frontend and Vite bundler |
| **npm** | `10.9.2` | `>= 9.0.0` | Default package manager |
| **SQLite** | Built-in | `>= 3.35.0` | WAL concurrency mode enabled |
| **Git** | Any modern | `>= 2.30` | Version control |

---

## 2. Repository Structure

```
Prototype/
├── docs/                        # Complete project documentation system
│   ├── README.md                # Documentation entry point
│   ├── TODO.md                  # Feature task tracker & progress
│   ├── FEATURES.md              # Plain-language feature specifications
│   ├── ARCHITECTURE.md          # Technical architecture & data flow
│   ├── API.md                   # REST API reference
│   ├── DATA_MODEL.md            # Database schemas & TypeScript interfaces
│   ├── DEVELOPMENT.md           # Developer onboarding & setup (this file)
│   └── ROADMAP.md               # Future strategic milestones
├── backend/                     # Python 3 API server & data pipeline
│   ├── app/
│   │   ├── config.py            # Environment loader & destination registries
│   │   ├── database.py          # SQLite connection factory & table creation
│   │   ├── background_worker.py # 60s background telemetry worker daemon
│   │   ├── engine/              # Analytical calculation modules
│   │   │   ├── dcc_calculator.py    # DCC scoring & 12-hr forecast
│   │   │   ├── twin_matcher.py      # 4D cosine similarity matcher
│   │   │   └── itinerary_engine.py  # Multi-day decongestion planner
│   │   └── pipelines/           # External sensor ingestion modules
│   │       ├── weather_pipeline.py  # Open-Meteo precipitation & wind
│   │       ├── traffic_pipeline.py  # TomTom speed delay factor
│   │       ├── footfall_pipeline.py # BestTime & OpenStreetMap POIs
│   │       └── ogd_india.py         # data.gov.in state benchmarks
│   ├── data/
│   │   └── ecoroute.db          # Local SQLite database (WAL mode)
│   ├── main.py                  # API server entry point (:8000)
│   ├── requirements.txt         # Optional high-performance dependencies
│   └── test_backend.py          # Automated backend test suite
├── frontend/                    # React 19 + TypeScript + Vite web app
│   ├── src/
│   │   ├── components/          # UI components by stakeholder role
│   │   │   ├── auth/            # Jan Parichay RBAC authentication modal
│   │   │   ├── authority/       # District GIS Command Center views & map
│   │   │   ├── common/          # Government navbar & AI helpline bot
│   │   │   ├── provider/        # MTDC operator inventory & incentives
│   │   │   └── tourist/         # Citizen crowd meters, cards & planner
│   │   ├── data/                # Initial baseline destination datasets
│   │   ├── lib/                 # Core engine math & i18n dictionaries
│   │   ├── store/               # Centralized Zustand application store
│   │   └── types/               # TypeScript interfaces & types
│   ├── package.json             # NPM dependencies & scripts
│   └── vite.config.ts           # Vite configuration
└── README.md                    # Root repository pointer
```

---

## 3. Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <repository_url>
cd "SIH Prototype/Travel & Tourism/Prototype"
```

### Step 2: Set Up Backend
The backend can run natively using Python's standard library with **zero external package installations**:
```bash
cd backend
python test_backend.py
```

To enable high-performance asynchronous execution and Swagger OpenAPI exploration:
```bash
pip install -r requirements.txt
```

### Step 3: Set Up Frontend
Install frontend npm packages:
```bash
cd ../frontend
npm install
```

---

## 4. Environment Configuration

The backend automatically loads environment variables from a `.env` file placed in either the repository root or the `backend/` directory.

### Creating `.env`
Create a `.env` file in `backend/.env`:
```env
# Server Network Configuration
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000

# External API Keys (Optional - Heuristic models activate if omitted)
TOMTOM_API_KEY=your_tomtom_api_key_here
BESTTIME_API_KEY=your_besttime_api_key_here
DATA_GOV_IN_API_KEY=your_data_gov_in_api_key_here

# Open Government Data Resource Identifiers (Defaults provided)
OGD_STATE_RESOURCE_ID=38e073e6-404c-45df-8c7f-18bad688d8df
OGD_COASTAL_RESOURCE_ID=51b5fc1c-9a4b-4c36-bcba-a90e55dc9fc8
```

> **Note on Fallbacks**: You do **not** need paid API keys to run and develop the project. If any API key is missing or set to placeholder text, the ingestion engine automatically activates intelligent heuristic models (such as diurnal rush-hour calculations and seasonal rainfall estimates).

---

## 5. Running the Project Locally

To run the complete platform, start both the backend server and frontend development server in separate terminal tabs.

### Terminal 1: Python Backend
```bash
cd backend
python main.py
```
Expected output:
```
==================================================================
🚀 EcoRoute Bharat Python Backend Engine Running
📍 Live Feed:     http://127.0.0.1:8000/api/destinations/live
📖 Swagger Docs:  http://127.0.0.1:8000/docs
🔐 Auth Endpoint: http://127.0.0.1:8000/api/auth/login
🤖 AI Chatbot:    http://127.0.0.1:8000/api/ai/chat
🩺 Health:        http://127.0.0.1:8000/api/health
==================================================================
```

#### Running Ingestion CLI One-Off:
To trigger a single sensor sync cycle and print formatted JSON without launching the persistent server:
```bash
python main.py --cli
```

### Terminal 2: React Frontend
```bash
cd frontend
npm run dev
```
By default, the Vite dev server starts at `http://localhost:5173`. Open this URL in any modern browser.

---

## 6. Running Tests & Quality Verification

### Backend Automated Unit Tests
The backend includes 7 comprehensive test suites validating database initialization, Dynamic Carrying Capacity (DCC) calculations, 12-hour forecasting, cosine similarity matching, and pipeline requests:
```bash
cd backend
python test_backend.py
```
Expected result:
```
test_12hr_forecast_generation ... ok
test_cosine_similarity_and_twin_matching ... ok
test_database_connection_and_seeding ... ok
test_dcc_metrics_calculation ... ok
test_future_itinerary_engine ... ok
test_pipelines_live_fetch ... ok
test_stakeholder_credentials_directory ... ok

Ran 7 tests in ~2.7s
OK
```

### Frontend Typecheck & Production Build
```bash
cd frontend
npm run build
```
This runs `tsc -b` (TypeScript strict check) followed by `vite build` to bundle static assets in `frontend/dist`.

### Code Linting
```bash
cd frontend
npm run lint
```

---

## 7. Development & Contribution Workflow

1. **Branch Hygiene**:
   - Create a feature branch off `main` or your designated active branch:
     ```bash
     git checkout -b feature/your-feature-name
     ```
2. **Implement & Test**:
   - Write clean, modular TypeScript or Python.
   - Preserve existing function signatures and error fallbacks.
   - Run `python test_backend.py` after modifying backend engines or routes.
3. **Verify Locally**:
   - Verify that the frontend compiles cleanly (`npm run build`).
   - Check that UI interactions update state without throwing console errors.
4. **Commit & Push**:
   - Write descriptive commit messages:
     ```bash
     git add .
     git commit -m "feat(twin-matcher): wire user preferences to dynamic twin card"
     git push origin feature/your-feature-name
     ```
5. **Update Task Documentation**:
   - Open [`docs/TODO.md`](./TODO.md) and update relevant task checkboxes and status values to reflect your changes.
