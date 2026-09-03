# EcoRoute Bharat (SIH26204)

> **AI-Driven Sustainable Tourism Decongestion, Live Telemetry Pipeline & Multi-Stakeholder Gatekeeper Platform**

Developed for the Ministry of Tourism (Govt. of India), Maharashtra Tourism Development Corporation (MTDC), and District Disaster Management Authorities.

---

## Quick Navigation to Documentation

All comprehensive project documentation is organized in the [`docs/`](./docs) directory:

- 🎯 **[Problem Statement & Traceability Matrix](./docs/PROBLEM_STATEMENT.md)** — Official Smart India Hackathon PS (SIH26204) & 14-requirement mapping.
- 📖 **[Main Documentation Entry Point](./docs/README.md)** — Project overview, current audit status, and index.
- 📋 **[Project Task Management (TODO)](./docs/TODO.md)** — Feature-by-feature status, completed tasks, and actionable next steps.
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
python test_backend.py   # Run 7 automated unit tests
python main.py           # Starts REST server at http://127.0.0.1:8000
```
Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. React Frontend Portal
```bash
cd frontend
npm install              # Install dependencies
npm run dev              # Starts development server at http://localhost:5173
```
