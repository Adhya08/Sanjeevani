# Sanjeevani Website Implementation Plan

## Overview

Sanjeevani is a two-sided web platform for India's fresh produce supply chain with AI agents negotiating on behalf of producers and buyers. This implementation plan follows the MVP deliverable requirements from the PRD v2.0.

---

## Phase 1: Foundation & Data Layer

### 1.1 Project Setup
**Timeline:** Days 1-2

- Initialize frontend (React + Vite + Tailwind CSS)
- Initialize backend (Fastify/Node.js or FastAPI/TypeScript)
- Set up PostgreSQL database schema
- Configure Redis for pub/sub and event queue
- Set up S3-compatible storage for images
- Configure WebSocket server for real-time updates
- Set up authentication with JWT + OTP

### 1.2 Database Schema Implementation
**Timeline:** Days 2-3

Core tables to create:
- `users` - ID, phone, name, role, org_id, verified
- `organizations` - ID, name, type, state, city, lat/lng, accepted_produce_types
- `listings` - ID, org_id, produce_type, quantity_total/available, price/kg, timestamps, status
- `needs` - ID, org_id, produce_type, quantity/period, max_price, max_distance
- `freshness_assessments` - ID, listing_id, waste_risk_score, estimated_days_range, confidence
- `demand_forecasts` - ID, org_id, produce_type, suggested_qty_range, rationale
- `orders` - ID, listing_id, buyer_org_id, quantity, negotiated_price, status, timestamps
- `negotiation_sessions` - ID, order_id, round_count, final_price/qty, outcome
- `agent_events` - ID, session_id OR listing_id, agent_name, event_type, payload, human_readable_text, status_color, timestamp
- `certificates` - ID, org_id, kg_saved, period, pdf_url

### 1.3 Synthetic Dataset Generation
**Timeline:** Day 3-4

Python script to generate mock data:
- 3,000 farmers/small producers
- 800 wholesalers/mandi traders  
- 4,000 retailers/local buyers
- 1,000 restaurants
- 500 verified NGOs
- 50,000+ synthetic historical orders with seasonal patterns

---

## Phase 2: Authentication & Dashboard Foundations



### 2.2 Producer Dashboard (M1)
**Timeline:** Days 5-7

Features:
- Create/edit/close listings with:
  - Produce type selection
  - Quantity (kg)
  - Price (₹/kg)
  - Harvest/arrival date
  - Storage conditions (temp, humidity)
  - Photo upload
- Live waste-risk score display per listing
- Incoming orders & negotiation view
- Remaining quantity updates (real-time)
- Waste Analytics access for own listings

### 2.3 Buyer Dashboard (M2)
**Timeline:** Days 5-7

Features:
- Post standing needs:
  - Produce type
  - Quantity/period
  - Max price
  - Max distance
- Browse/search/filter listings by:
  - Distance radius
  - Price range
  - Freshness/risk score
  - Produce type
- Post one-off requests
- NGO-specific view with donation-eligible stock filter

---

## Phase 3: Machine Learning Models

### 3.1 Shelf-Life & Waste-Risk Model (M3)
**Timeline:** Days 7-9

Model specification:
- **Input:** produce image, produce type, days since harvest, storage temp/humidity
- **Output:** `{ waste_risk_score: 0-100, estimated_days_range, confidence, risk_tier }`
- **Architecture:** CNN backbone (MobileNetV3/ EfficientNet-lite) + tabular features → multi-output heads
- **Training:** 70/15/15 split, data augmentation, class-weighted loss
- **Evaluation:** Classification F1, MAE on days regression, calibration check

Implementation steps:
1. Data preprocessing pipeline for images + tabular features
2. Model training script with validation
3. Model serving endpoint (`/api/v1/freshness/{listing_id}`)
4. Integration into listing display (real-time risk score)

### 3.2 Demand Prediction Model (M4)
**Timeline:** Days 7-9

Model specification:
- **Input:** historical orders, produce type, season, weather, festivals, current prices
- **Output:** suggested quantity range + rationale
- **Architecture:** LightGBM/XGBoost (gradient-boosted trees)
- **Evaluation:** MAPE against actual orders, comparison to naive baseline

Implementation steps:
1. Feature engineering pipeline (seasonality, weather, festival flags)
2. Model training script with time-based split
3. Model serving endpoint (`/api/v1/forecast/demand`)
4. Integration into Buyer Dashboard (pre-order quantity suggestion)

---

## Phase 4: Order System & Inventory Engine

### 4.1 Virtual Order Placement (M5)
**Timeline:** Days 9-10

Order lifecycle states: `placed → negotiating → confirmed → fulfilled` or `rejected/expired`

Implementation:
- **API:** `POST /api/v1/orders` with listing_id, buyer_org_id, quantity
- **Inventory deduction:** Atomic row-locked decrement
  - Prevent race conditions on last units
  - Never allow negative quantities
- **Low-stock detection:** Auto-flag when quantity_available < threshold (e.g., 10%)
- **Auto-rescue trigger:** Risk score > 80 triggers NGO routing

Acceptance criteria:
- Two simultaneous orders for last units never both succeed
- Quantity updates visible within 2 seconds
- Listing quantity reflects on all dashboards in real-time

### 4.2 Negotiation Engine (M6)
**Timeline:** Days 10-11

Protocol:
- Bounded rounds (max 4)
- Each round emits event to Event Bus
- Human-in-loop threshold for large orders
- Agent goals:
  - Producer: maximize value before spoilage
  - Buyer: secure quantity within budget/distance constraints

Implementation:
- Producer Agent: pricing offers, counter-offers, rescue routing
- Buyer Agent: quantity guards, counter-offers, acceptance
- Rules engine validates all actions against business constraints
- Full audit trail via AgentEvent logging

---

## Phase 5: Live Activity Console & Advanced Features

### 5.1 Live Agent Activity Log Console (M7)
**Timeline:** Days 11-12

Core requirement: Replace generic spinners with transparent, branded activity ticker

Features:
- Persistent, collapsible dockable panel (bottom-right/ side rail)
- Brand color-coded status dots:
  - Amber = searching/processing
  - Blue = negotiating
  - Green = success/confirmed
  - Red = blocked/rejected
- Small agent avatars/icons (farmer agent vs buyer agent glyphs)
- Typewriter/slide-in animation for new log lines
- Expandable lines revealing full offer data in key-value mini-card
- WebSocket streaming from Event Bus: `WS /ws/v1/agent-log?session_id=`

Implementation:
- Frontend component with animation and expandable state
- Backend WebSocket handler with session-scoped filtering
- Event categorization by actor, action, and status

### 5.2 Rescue/Donation Routing (M8)
**Timeline:** Day 12

Trigger conditions:
- Auto-rescue when waste-risk score > 80 with unsold quantity
- Manual "route to NGO" action by producer

Logic:
- Match to verified NGOs first
- Priority for near-zero-value stock
- B2B discount buyers as fallback

### 5.3 Traceability & QR Batch Tracking (M9)
**Timeline:** Day 12

Features:
- Hash-chained batch record
- QR code generation for batches
- Public batch history page (region-level data only, never PII)

### 5.4 Waste Analytics & Audit Dashboard (M10)
**Timeline:** Days 12-13

Views:
- Total listed vs. sold vs. rescued vs. lost (by region, produce type, period)
- Waste-risk score distribution over time
- Negotiation success rate
- Over-purchase reduction (vs. naive baseline)
- Full audit trail of orders and decisions (exportable CSV)

Roles:
- Producer: own listings only
- Buyer: own orders only  
- Admin: network-wide

### 5.5 ESG Impact Certificates (M12)
**Timeline:** Day 13

Features:
- Per-org, per-period PDF certificate
- Shows kg saved via rescue/donation
- Downloadable and shareable
- Generated from Waste Analytics data

---

## Phase 6: Security Implementation

### 6.1 Security Controls (Part F Checklist)
**Timeline:** Days 13-14

Required implementations:
- [ ] OTP auth + short-lived JWT
- [ ] Server-side RBAC + ownership checks on listings/orders/needs
- [ ] Atomic, race-safe inventory decrement
- [ ] Schema-level input validation on all endpoints
- [ ] Rate limiting on listing/order/search endpoints
- [ ] Log console scoped per-session (never global)
- [ ] Secrets in vault, never in source control
- [ ] TLS enforced end-to-end
- [ ] Agent actions allowlisted + rules-engine-validated
- [ ] Full audit log for every order and agent decision

### 6.2 Data Protection
- TLS 1.3 in transit
- AES-256 at rest
- Field-level encryption for phones and precise coordinates
- DPDP Act 2023 compliance

---

## Phase 7: Polish & Demo Preparation

### 7.1 UI/UX Refinement
**Timeline:** Days 14-15

Apply Part C design directives:
- **Two-dashboard visual distinction:**
  - Producer: warm/earthy palette (clay, marigold, leaf green)
  - Buyer: cooler/cleaner variant
- **Typography:** distinctive display type for headlines
- **Illustrations:** hand-drawn produce/basket iconography
- **Animations:** numbers/quantities animate on change
- **Avoid:** purple/blue gradients, glassmorphism, generic spinners, 3D robot icons

**Live Log Console styling:**
- Brand color-coded status dots
- Agent avatars/icons
- Slide/fade animations
- Expandable detail cards

### 7.2 Demo Storyline
**Timeline:** Days 15-16

Create narrative flow:
1. Farmer lists tomato batch with 200kg available at ₹28/kg
2. Retailer posts need: 50kg tomatoes within 8km, max ₹35/kg
3. Retailer places virtual order for 40kg
4. Both agents negotiate live in log console:
   - Buyer agent checks distance/pricing
   - Producer agent counters based on waste risk
   - 2-3 rounds of negotiation
5. Order confirmed → inventory updates to 160kg on producer side
6. NGO views donation-eligible stock as items age
7. Waste Analytics shows rescue metrics
8. ESG certificate generated for demo

---

## Technical Architecture Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (custom tokens)
- **Charts:** Recharts/D3 for analytics
- **Real-time:** WebSocket client for log console
- **State management:** Zustand or Context API

### Backend
- **Runtime:** Node.js (NestJS) or Python (FastAPI)
- **WebSocket:** WebSocket/SSE gateway
- **Agent orchestration:** Custom finite-state engine or LangGraph
- **Queue:** Redis for pub/sub

### Database
- **Primary:** PostgreSQL (relational data)
- **Cache/Queue:** Redis (event queue + live log pub/sub)
- **Storage:** S3-compatible (images)

### ML Stack
- **Framework:** TensorFlow/Keras or PyTorch for vision; LightGBM for demand
- **Serving:** FastAPI endpoints or TorchServe
- **Model storage:** S3 bucket with versioning

### DevOps
- **Deployment:** Docker containers
- **Orchestration:** Docker Compose (hackathon) or Kubernetes (production)
- **CI/CD:** GitHub Actions

---

## File Structure

```
sanjeevani/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── producer/    # Producer dashboard components
│   │   │   ├── buyer/       # Buyer dashboard components  
│   │   │   ├── common/      # Shared components
│   │   │   └── log-console/ # Live activity ticker
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── styles/
│   └── index.html
│
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   │   ├── listing-service.ts
│   │   │   ├── order-service.ts
│   │   │   ├── agent-engine.ts
│   │   │   └── ml-service.ts
│   │   ├── models/
│   │   ├── agents/
│   │   │   ├── producer-agent.py
│   │   │   └── buyer-agent.py
│   │   └── auth/
│   └── requirements.txt
│
├── ml/
│   ├── shelf-life-model/
│   │   ├── train.py
│   │   ├── serve.py
│   │   └── exported_model/
│   ├── demand-model/
│   │   ├── train.py
│   │   └── serve.py
│   └── dataset/
│       └── generate_synthetic.py
│
├── data/
│   ├── synthetic/
│   └── snapshots/
│
├── security/
│   └── audit-log-setup.md
│
└── docs/
    └── design-tokens.md
```

---

## Success Criteria

1. **Technical:**
   - Listings appear on Buyer Dashboard within 2 seconds of creation
   - Order placement reflects quantity changes within 2 seconds
   - No overselling (atomic inventory deduction)
   - All ML models train and serve with documented metrics

2. **Product:**
   - Producer can list produce with waste-risk scoring
   - Buyer can search, post needs, place virtual orders
   - Dual-agent negotiation runs with live log visibility
   - NGO can see donation-eligible stock
   - Waste Analytics shows complete audit trail

3. **Security:**
   - OTP + JWT auth working
   - RBAC properly enforced
   - TLS enabled, secrets protected
   - Session-scoped log console

---

## Next Steps

1. Review and approve this implementation plan
2. Confirm tech stack preferences (Node.js vs Python backend)
3. Begin Phase 1: Project initialization and database setup
4. Schedule daily standups to track progress against 16-day timeline

*Plan created: 2026-08-09*
*Based on: Sanjeevani PRD/FRD v2.0*