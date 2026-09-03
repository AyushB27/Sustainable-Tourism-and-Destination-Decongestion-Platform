# SIH26204: Official Problem Statement & Requirement Mapping

This document details the official Smart India Hackathon problem statement (**SIH26204 — Tourism**) and provides a comprehensive traceability matrix mapping each hackathon requirement to its operational implementation in the EcoRoute Bharat codebase.

---

## Official Problem Statement Overview

**Problem Statement ID:** SIH26204  
**Category:** Software / Tourism & Hospitality  
**Title:** AI-Powered Sustainable Tourism & Destination Decongestion Platform  
**Target Ministry/Agency:** Ministry of Tourism (Govt. of India) / Maharashtra Tourism Development Corporation (MTDC)  

---

## 1. Background

India's tourism ecosystem faces an uneven distribution of visitors. A relatively small number of popular destinations attract very large tourist volumes during peak periods, resulting in overcrowding, traffic congestion, long waiting times, environmental pressure, waste generation, and deterioration of visitor experience.

At the same time, numerous lesser-known cultural, natural, and heritage destinations remain under-visited despite having significant tourism potential. Tourism authorities and visitors often lack an intelligent mechanism to understand how tourist demand is evolving and dynamically distribute visitors across suitable destinations.

Existing travel platforms primarily optimize individual traveler convenience—such as hotels, routes, attractions, and itineraries—but do not primarily address destination-level crowd management and sustainable distribution of tourist demand.

---

## 2. Problem Statement Objective

Develop an **AI-powered Sustainable Tourism Intelligence Platform** that predicts tourist demand and congestion at destinations and dynamically recommends alternative attractions, routes, and time slots to distribute tourist movement while preserving visitor preferences.

---

## 3. Core Functional Requirements & Traceability Matrix

The platform must satisfy 14 specific functional capabilities. The table below details how each requirement is implemented within the EcoRoute Bharat architecture:

| # | SIH26204 Requirement | Architecture Component | Implementation Status | Source Files & Implementation Reference |
|---|---|---|:---:|---|
| **1** | **Collect and analyze historical & near-real-time tourism signals**<br>*(visitor counts, seasonal patterns, events, weather, holidays, mobility information)* | Live Sensor Telemetry Pipeline & Background Daemon | **PARTIAL**<br>*(Live Open-Meteo + Fallback traffic/footfall)* | - [`weather_pipeline.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/pipelines/weather_pipeline.py)<br>- [`traffic_pipeline.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/pipelines/traffic_pipeline.py)<br>- [`footfall_pipeline.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/pipelines/footfall_pipeline.py)<br>- [`ogd_india.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/pipelines/ogd_india.py)<br>- [`background_worker.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/background_worker.py) |
| **2** | **Predict destination-level tourist congestion for future time windows** | Diurnal Gaussian Forecast Engine & Timeline | **PARTIAL**<br>*(Backend engine done; UI wiring pending)* | - [`dcc_calculator.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/engine/dcc_calculator.py) (`generate_12hr_forecast`)<br>- [`DemandCurveChart.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/tourist/DemandCurveChart.tsx)<br>- [`InflowPredictorTimeline.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/provider/InflowPredictorTimeline.tsx) |
| **3** | **Identify destinations approaching overcrowding thresholds** | Dynamic Carrying Capacity (DCC) Engine | **DONE** | - [`dcc_calculator.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/engine/dcc_calculator.py)<br>- [`engine.ts`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/lib/engine.ts) (`calculateDCCMetrics`)<br>- Status: OPTIMAL (<0.70), MODERATE (0.70-0.84), CRITICAL (≥0.85) |
| **4** | **Recommend alternative destinations with similar characteristics based on visitor preferences** | 4D Vector Cosine Similarity Twin Matcher | **PARTIAL**<br>*(Math engine verified; dynamic view connection pending)* | - [`twin_matcher.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/engine/twin_matcher.py)<br>- [`engine.ts`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/lib/engine.ts) (`getTwinRecommendations`)<br>- [`TwinAlternativeCards.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/tourist/TwinAlternativeCards.tsx) |
| **5** | **Recommend alternative visiting times and routes** | Diurnal Hourly Slot Selector & Bypass Advice | **PARTIAL**<br>*(UI cards built; live dynamic link pending)* | - [`DemandCurveChart.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/tourist/DemandCurveChart.tsx)<br>- [`TouristView.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/tourist/TouristView.tsx) (Dawn, Morning, Afternoon, Evening slots)<br>- Alternate routes: Ghoti bypass, NH-60 artery |
| **6** | **Estimate expected waiting time and congestion levels** | Queuing Delay & Dwell Time Simulator | **DONE** | - Formula: $\text{Wait Mins} = \frac{\text{Inflow} - \text{Capacity}}{\text{Capacity}} \times \text{Dwell Hrs} \times 60$<br>- Implemented in Python and TypeScript engines |
| **7** | **Analyse tourist movement between destinations to understand how demand spreads** | Regional Mobility Diffusion Flow Matrix | **DONE** | - [`DemandDiffusionFlow.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/authority/DemandDiffusionFlow.tsx)<br>- Analyzes dispersion from Mumbai, Pune, Thane to destination nodes |
| **8** | **Provide authorities with destination-level demand forecasts** | District GIS Command HQ & Threshold Matrix | **DONE** | - [`AuthorityView.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/authority/AuthorityView.tsx)<br>- [`CorridorKpiBar.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/authority/CorridorKpiBar.tsx)<br>- [`CorridorThresholdTable.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/authority/CorridorThresholdTable.tsx) |
| **9** | **Identify under-utilised destinations with tourism potential** | Certified Eco-Twins & MTDC Incentive Schemes | **PARTIAL**<br>*(Promotions table exists; REST sync pending)* | - Destination Registry: Matheran, Bhandardara, Kashid, Tapola<br>- [`OffPeakIncentiveCard.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/provider/OffPeakIncentiveCard.tsx)<br>- 25% MTDC homestay discount subsidies |
| **10** | **Allow tourism authorities to create temporary advisories or restrictions for high-pressure destinations** | Digital Gazette Emergency Dispatcher & Entry Sliders | **PARTIAL**<br>*(Authority UI & backend ready; network POST pending)* | - [`DigitalAdvisoryDispatcher.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/authority/DigitalAdvisoryDispatcher.tsx)<br>- [`EcoHealthCommunityWidget.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/authority/EcoHealthCommunityWidget.tsx)<br>- `POST /api/advisories/broadcast` |
| **11** | **Provide multilingual recommendations to tourists** | Trilingual Internationalization (I18n) Engine | **PARTIAL**<br>*(55+ key dictionaries created; UI switcher pending)* | - [`i18n.ts`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/lib/i18n.ts)<br>- Full translation tables for English, Hindi (हिन्दी), Marathi (मराठी) |
| **12** | **Support sustainable-tourism indicators**<br>*(crowd pressure, environmental sensitivity, carrying capacity)* | Eco-Health Gauges & Digital Green Passes | **DONE** | - [`EcoHealthCommunityWidget.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/authority/EcoHealthCommunityWidget.tsx) (Vegetation stress, water index, wildfire risk)<br>- [`EcoPassCard.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/tourist/EcoPassCard.tsx) (CO₂ saved: ~18.5 kg) |
| **13** | **Planning trips (Future)** | Multi-Day Decongested Holiday Itinerary Engine | **PARTIAL**<br>*(Backend engine tested; frontend card rendered)* | - [`itinerary_engine.py`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/backend/app/engine/itinerary_engine.py)<br>- `POST /api/itinerary/plan`<br>- [`FutureTripPlanner.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/tourist/FutureTripPlanner.tsx) |
| **14** | **Helpline 24x7 (AI-Based)** | Sahyadri Guide 24x7 Tourism AI Assistant (1363) | **PARTIAL**<br>*(Client chatbot running; backend /api/ai/chat ready)* | - [`AiHelplineBot.tsx`](file:///c:/Users/91935/Desktop/SIH%20Prototype/Travel%20&%20Tourism/Prototype/frontend/src/components/common/AiHelplineBot.tsx)<br>- `POST /api/ai/chat` in `backend/main.py`<br>- Toll-free 1363 integration branding |

---

## 4. Key Architectural Alignment Insights

1. **Focus on Destination-Level Decongestion vs. Individual Convenience**:
   Existing travel apps (Google Maps, MakeMyTrip) route individual users along the fastest path, which inadvertently funnels thousands of drivers into the exact same choke point (e.g., NH-48 Khandala curves). EcoRoute Bharat operates at the **macro destination level**, using Dynamic Carrying Capacity (DCC) and certified twin spot incentives to distribute visitor volume across regional corridors.

2. **Preference-Preserving Nudges**:
   Rather than restricting freedom of movement, the platform preserves user travel styles (Scenic, Budget, Adventure, Family) through 4D vector cosine similarity:
   $$\text{Vibe Match} = \frac{\mathbf{u}_{\text{user}} \cdot \mathbf{v}_{\text{destination}}}{\|\mathbf{u}_{\text{user}}\|_2 \|\mathbf{v}_{\text{destination}}\|_2}$$
   This ensures a tourist seeking waterfalls and mist is redirected to another lush waterfall haven (such as Matheran or Bhandardara) rather than an unappealing or mismatched destination.

3. **Multi-Stakeholder Gatekeeper**:
   The problem statement emphasizes the role of tourism authorities and providers. EcoRoute Bharat bridges this via the *Jan Parichay* RBAC gateway, providing dedicated, role-specific tools for District Magistrates, Highway Police, and MTDC Homestay operators alongside the citizen portal.
