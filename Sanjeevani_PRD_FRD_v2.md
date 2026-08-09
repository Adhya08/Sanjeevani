# Sanjeevani — AI-Native Fresh Produce Rescue & Intelligence Platform
### Product Requirements Document (PRD) + Functional Requirements Document (FRD) + Security Protocol
Prepared for: **Antigravity build agent** — HackNite Code Royale 2026, Fresh Produce OS Track

| Field | Value |
|---|---|
| Codename | Sanjeevani |
| Delivery form | **Web application only** — responsive browser-based platform, no native mobile app in scope |
| Track fit | Sustainability & Rescue (primary), Computer Vision & AI, Autonomous AI Agents, Commerce & Matchmaking, Climate & Risk Mitigation |
| Pilot geography | Greater Noida / Delhi NCR mandi + retail corridor, India |
| Doc status | **v2.0** — revised per updated project scope |

**What changed in v2:** platform is web-only; restructured around two dedicated dashboards (Producer side, Buyer side); added a virtual order-placement & live inventory-deduction simulation; agents now negotiate on *both* sides of a deal, not just route matches; added a visible live agent-activity log console as a core UX element; shelf-life model and a new demand-prediction model now have full training specs; added a large mock/synthetic dataset plan for farmers, wholesalers, retailers and NGOs; added a dedicated Waste Analytics & Audit dashboard.

---

# PART A — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## A1. Executive Summary
Sanjeevani is a two-sided web platform for India's fresh produce supply chain. **Producers** (farmers, wholesalers, mandi traders) list available produce; **Buyers** (retailers, local shopkeepers, restaurants, NGOs) post what they need and place orders against live listings. Sitting on top of both sides is a pair of cooperating/negotiating AI agents — one representing the producer's interests, one representing the buyer's — that estimate shelf-life and waste risk, forecast demand, negotiate price and quantity, and act (propose, counter, confirm) largely autonomously, with the human able to watch every step happen in a live activity log instead of a black-box spinner.

## A2. Problem Statement & Market Context
India loses 15–30% of fruit and vegetables before reaching consumers, driven by fragmented, manual, paper-based coordination between producers and buyers, poor visibility into real-time inventory, and no systematic way to move at-risk stock to NGOs or discount channels before it becomes total loss. Sanjeevani digitizes both sides of this transaction and lets AI agents do the coordination work a human trader currently does by phone call.

## A3. Platform Structure — Two Dashboards
### Dashboard 1: Producer Dashboard (Farmers / Wholesalers / Mandi Traders)
- Post/list produce batches: type, quantity, price/kg, harvest or arrival date, storage condition, photos.
- See live "waste-risk score" per listing (from the Shelf-Life Engine) and system-suggested markdown pricing as items age.
- See incoming orders, negotiation offers from Buyer-side agents, and confirm/counter/reject.
- View remaining available quantity per listing, updated live as orders are placed (see A5 — Virtual Order Simulation).
- Waste Analytics & Audit view: what sold, what was rescued/donated, what was lost, and why.

### Dashboard 2: Buyer Dashboard (Retailers / Local Buyers / NGOs)
- Post standing "needs" (e.g., "50kg tomato/week, within 8km, max ₹35/kg") and one-off requests.
- Browse/search live producer listings, filtered by distance, price, freshness/risk score, produce type.
- Place a **virtual order** against a listing — this is the core simulated marketplace transaction.
- Watch the Buyer-side agent negotiate on your behalf in the live log console; approve/override at configurable thresholds.
- See a personalized demand-prediction suggestion ("Based on your last 6 weeks + this week's weather, order ~35kg not 50kg") to prevent over-purchasing.
- NGOs get a distinct view: donation offers prioritized for near-zero-value stock, capacity-aware.

## A4. Judging Criteria Alignment Map
| Criteria | Weight | Primary Sanjeevani feature(s) |
|---|---|---|
| Impact on Waste Reduction | 20% | Waste-risk scoring, dual-agent negotiated redistribution, NGO donation priority for near-expiry stock |
| Innovation & Originality | 15% | Two-sided negotiating agents (not one-sided routing), live agent-log UX, demand-prediction to prevent over-purchasing |
| Technical Execution | 15% | Trained CV+regression shelf-life model, trained demand-forecast model, real-time inventory deduction engine |
| AI Implementation | 15% | Multi-agent negotiation protocol, two properly trained ML models (not just API calls) |
| Scalability | 10% | Stateless agent workers, large synthetic dataset validated at scale, sharded regional matching |
| Cost-Effectiveness | 10% | Web-only, no hardware/app dependency, works on any browser |
| User Experience (UX) | 10% | Two focused dashboards, transparent live process log instead of generic spinners, distinctive visual identity |
| Business Viability & Deployment | 5% | Subscription + transaction fee + ESG-certificate revenue, real dataset-backed pilot story |

## A5. Virtual Order Placement & Inventory Simulation (core new mechanic)
This is the transactional heart of the demo: it must visibly behave like a real marketplace, even though payment/logistics are simulated.
1. Buyer finds a listing (e.g., "Wholesaler Ramesh — Tomato — 200kg available — ₹28/kg").
2. Buyer places an order for a quantity (e.g., 40kg).
3. **Buyer-side agent** and **Producer-side agent** negotiate (price, delivery window, minimum quantity) — visible live in the log console.
4. On confirmation: order status moves `placed → negotiating → confirmed → fulfilled`; the listing's **available quantity decreases in real time** (200kg → 160kg) and is reflected instantly on the Producer Dashboard and to every other Buyer viewing that listing.
5. If available quantity hits a low-stock threshold, the listing auto-flags "low stock" and stops accepting new orders beyond remaining quantity (no overselling).
6. If a listing's waste-risk score crosses a critical threshold before it sells out, remaining quantity is auto-routed into the NGO/rescue flow (M8) instead of staying listed at full price.

## A6. Judging-relevant Non-Goals (explicit, to keep scope honest)
- No native mobile app — web-responsive only.
- No real payment processing — order placement is a functional simulation (status lifecycle + inventory deduction are real; money movement is mocked).
- No WhatsApp/IVR channel in MVP — all interaction happens on the two web dashboards (may be listed as a Phase 3 future channel only).

## A7. Target Users / Personas
1. **Farmer/small producer** — lists small batches, wants fair price and fast sale before spoilage.
2. **Wholesaler/mandi trader** — lists bulk inventory, manages many concurrent listings and incoming orders.
3. **Retailer/kirana owner** — browses listings, places recurring and one-off orders, wants demand guidance.
4. **Restaurant/local buyer** — posts standing weekly needs, values consistency and freshness score.
5. **NGO coordinator** — sees only donation-eligible near-expiry stock, accepts/declines with pickup capacity limits.
6. **Platform admin** — monitors agent activity, waste analytics, dataset health.

## A8. Goals & Success Metrics
- **North Star:** kilograms of produce moved from listing to a completed order or donation before spoilage, across the simulated network.
- Secondary: negotiation success rate (offers that reach `confirmed`), average negotiation rounds to close, over-purchase reduction % (actual order qty vs. naive baseline), % of near-expiry stock rescued vs. lost.

## A9. Scope
- **MVP (hackathon):** Both dashboards, listing + order-placement + live inventory deduction, dual-agent negotiation (rule-based + LLM-assisted reasoning) with live log console, trained shelf-life model (v1, on public + synthetic data), trained demand-prediction model (v1, on synthetic historical orders + weather/season features), large synthetic dataset (farmers/wholesalers/retailers/NGOs), Waste Analytics & Audit dashboard, lightweight QR traceability, ESG impact certificate.
- **Phase 2 (production):** Real payment integration, live AGMARKNET/NGO-DARPAN ingestion replacing synthetic seed data, model retraining pipeline on real platform data, WhatsApp as an *additional* channel layered on top of the web core.
- **Phase 3 (scale):** Multi-region sharding, IoT sensor input, government/FSSAI data partnerships, ESG-certificate B2B API.

## A10. Business Model
- Freemium SaaS for Producer/Buyer accounts (listing/order volume tiers).
- Transaction fee on confirmed orders above a threshold.
- ESG/CSR certificate API for enterprises.
- Aggregated, anonymized regional demand/spoilage insights sold to FMCG/logistics partners.

## A11. High-Level Architecture
```
        PRODUCER DASHBOARD (web)              BUYER DASHBOARD (web)
        Farmers / Wholesalers                 Retailers / Local Buyers / NGOs
              │  list produce                        │  post needs / browse / order
              ▼                                       ▼
      ┌───────────────────┐                 ┌───────────────────┐
      │  Listing Service    │                 │  Order Service      │
      │  + Shelf-Life Model │                 │  + Demand Model     │
      └─────────┬──────────┘                 └─────────┬──────────┘
                │                                       │
                │        ┌────────────────────┐        │
                └───────►│   Event/Agent Bus    │◄───────┘
                         └─────────┬──────────┘
                    ┌──────────────┼───────────────┐
                    ▼              ▼               ▼
           Producer-side       Negotiation     Buyer-side
             Agent            Protocol Engine     Agent
        (pricing, counter-   (rounds, rules,   (order qty guard,
         offers, rescue        thresholds)      counter-offers)
         routing)                    │
                                     ▼
                          Inventory Deduction Engine
                          (real-time quantity update)
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
             Live Log Console   Waste Analytics   ESG / Traceability
             (both dashboards)   & Audit Dashboard   (QR + certificate)
```

## A12. Recommended Tech Stack
- **Frontend:** React + Vite + Tailwind (custom tokens, see Part C), WebSocket client for the live log console, Recharts/D3 for analytics.
- **Backend:** Node.js (NestJS) or FastAPI; WebSocket/SSE gateway for streaming agent events to both dashboards in real time.
- **ML:**
  - Shelf-life: TensorFlow/Keras or PyTorch CNN backbone (e.g., EfficientNet-lite / MobileNetV3) + tabular regression head (age, temp, humidity) — see Part E.
  - Demand forecasting: LightGBM/XGBoost or Prophet-style seasonal model on tabular time-series features — see Part E.
- **Agent orchestration:** LangGraph or a custom finite-state negotiation engine; each agent = a scoped service with an explicit tool allowlist.
- **DB:** PostgreSQL (core relational data — listings, orders, users), Redis (agent event queue + live log pub/sub), S3-compatible storage (images).
- **Dataset generation:** Python + Faker (India locale) + real reference distributions from AGMARKNET/NGO-DARPAN for realism (see Part D of FRD).

## A13. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Negotiation logic feels scripted/fake | Ground it in real constraints (price bounds from AGMARKNET, quantity from actual listing) and show genuine multi-round back-and-forth in the log, not a single fixed exchange |
| Two ML models is ambitious for hackathon timeline | Ship v1 models trained on a clearly documented (if smaller) dataset with honest metrics; document the production retraining plan rather than overclaiming |
| Synthetic dataset looks obviously fake | Base distributions (city names, produce types, price ranges, org types) on real Indian sources (AGMARKNET, NGO-DARPAN, FSSAI) even though individual records are generated |
| Inventory race conditions (two buyers ordering the last units simultaneously) | Atomic decrement with row-level locking / optimistic concurrency check on the Listing Service |

## A14. Build Timeline (sequencing for Antigravity)
1. Data layer: schema, synthetic dataset generation (Part D of FRD), auth, both dashboards' CRUD (listings, needs).
2. Shelf-life model v1 training + integration into listing risk score.
3. Order Service + Inventory Deduction Engine (core simulation loop) + low-stock/oversell guards.
4. Demand-prediction model v1 + "suggested order quantity" surfaced on Buyer Dashboard.
5. Dual-agent negotiation engine + event bus + live log console (both dashboards).
6. Waste Analytics & Audit dashboard, QR traceability, ESG certificate generator.
7. Security pass (Part F), polish, demo data storyline, pitch deck.

---

# PART B — FUNCTIONAL REQUIREMENTS DOCUMENT (FRD)

## B1. Module Overview
| ID | Module | MVP? |
|---|---|---|
| M1 | Producer Dashboard (listings) | Yes |
| M2 | Buyer Dashboard (needs, browse, order) | Yes |
| M3 | Shelf-Life & Waste-Risk Model (trained) | Yes |
| M4 | Demand Prediction Model (trained) | Yes |
| M5 | Virtual Order Placement & Inventory Deduction Engine | Yes |
| M6 | Dual-Agent Negotiation System | Yes |
| M7 | Live Agent Activity Log Console | Yes |
| M8 | Rescue/Donation Routing (near-expiry → NGO) | Yes |
| M9 | Traceability & QR Batch Tracking | Yes (lightweight) |
| M10 | Waste Analytics & Audit Dashboard | Yes |
| M11 | Synthetic Dataset (farmers/wholesalers/retailers/NGOs) | Yes |
| M12 | ESG Impact Certificates | Yes |
| M13 | Admin Console | Stretch |

### M1 — Producer Dashboard
- **Actors:** Farmer, Wholesaler, Mandi trader
- **Functions:** create/edit/close a listing (produce type, quantity, price/kg, harvest/arrival date, storage temp/humidity, photos); view live waste-risk score per listing; view incoming orders and negotiation state; view remaining quantity updating live; access Waste Analytics for own listings.
- **Acceptance criteria:** a new listing appears on the Buyer Dashboard search within 2 seconds of creation.

### M2 — Buyer Dashboard
- **Actors:** Retailer, Local buyer/restaurant, NGO
- **Functions:** post a standing "need" (produce type, quantity/period, max price, max distance); browse/search/filter live listings; place an order (quantity, against a specific listing); see agent negotiation live; see demand-prediction suggested quantity before confirming; NGO-specific filtered view of donation-eligible stock only.
- **Acceptance criteria:** order placement reflects updated available quantity on both dashboards within 2 seconds.

### M3 — Shelf-Life & Waste-Risk Model (trained)
See **Part E1** for full training specification. Functional summary:
- **Input:** produce image, produce type, days since harvest/arrival, storage temperature, storage humidity.
- **Output:** `{ waste_risk_score: 0-100, estimated_remaining_days_range, confidence, risk_tier }`.
- **Business rule:** never output a single exact spoilage timestamp — always a range + confidence; low-confidence predictions are flagged for manual review.

### M4 — Demand Prediction Model (trained)
See **Part E2** for full training specification. Functional summary:
- **Input:** buyer's historical order volumes, produce type, season/month, local weather forecast, festival/event calendar, current listing prices.
- **Output:** suggested order quantity range + rationale ("last 4 weeks avg 42kg, monsoon typically -10%, suggest 35-40kg").
- **Goal:** shown on the Buyer Dashboard *before* order confirmation to reduce over-purchasing and resulting downstream waste.

### M5 — Virtual Order Placement & Inventory Deduction Engine
- **Order lifecycle states:** `placed → negotiating → confirmed → fulfilled` (or `rejected` / `expired`).
- **Inventory rule:** on `confirmed`, listing.available_quantity -= order.quantity, atomically (row-lock/optimistic concurrency), never allowed to go below 0.
- **Low-stock rule:** when available_quantity < configurable threshold (e.g., 10% of original), listing flags `low_stock` and blocks new orders exceeding what's left.
- **Auto-rescue trigger:** if a listing's waste-risk score crosses a critical threshold (e.g., >80) while unsold quantity remains, remaining quantity is automatically pushed into M8 (NGO/discount routing) rather than sitting unlisted.
- **Acceptance criteria:** two simultaneous orders against the last unit of stock never both succeed (no overselling); one is auto-rejected with a clear reason.

### M6 — Dual-Agent Negotiation System
- **Producer-side Agent:** goal = maximize realized value before spoilage; constraints = floor price (from AGMARKNET reference), current risk score, existing order queue.
- **Buyer-side Agent:** goal = secure needed quantity within budget/distance constraints; constraints = buyer's max price, demand-prediction suggested quantity (won't over-order without explicit human override).
- **Negotiation protocol:** bounded number of rounds (e.g., max 4); each round = offer → counter-offer → accept/continue; every round emits an event to the Event Bus.
- **Human-in-loop rule:** any confirmed order above a configurable value/quantity threshold requires the human user (on the relevant dashboard) to give final approval before `confirmed`.
- **Acceptance criteria:** every negotiation session has a full, replayable event history (who offered what, when, why) stored in `AgentLog`.

### M7 — Live Agent Activity Log Console (core UX requirement)
- **Purpose:** replace a generic loading spinner with a visible, readable stream of what the system is actually doing — directly requested as a UX priority.
- **Placement:** a persistent, collapsible console panel on both dashboards (e.g., bottom-right dock or side rail), styled to match the brand (see Part C), not a generic black terminal.
- **Content per log line:** timestamp, actor icon (Producer Agent / Buyer Agent / System), short human-readable action ("Buyer Agent checking listings within 8km for tomato…", "Producer Agent countered ₹30/kg → ₹28/kg", "Inventory updated: 160kg remaining"), and a status color (searching = amber, negotiating = blue, success = green, blocked/rejected = red).
- **Delivery mechanism:** WebSocket/SSE stream from the Event Bus, rendered incrementally (typewriter or line-by-line append), not one big blocking spinner.
- **Interaction:** user can expand a log line to see the underlying data (e.g., the full offer payload) — supports both transparency and debugging during judging.
- **Acceptance criteria:** any action taking longer than ~500ms on the backend has a corresponding visible log line within that time, so the user is never staring at a blank/spinning state.

### M8 — Rescue/Donation Routing
- **Trigger:** M5's auto-rescue trigger, or manual "route to NGO" action by a producer.
- **Logic:** matches remaining quantity to verified NGOs first (priority for near-zero-value stock), then B2B discount buyers.
- **Acceptance criteria:** a listing that crosses critical risk with unsold stock never simply expires unlisted — it always generates at least one rescue offer if a matching NGO/buyer exists in the dataset.

### M9 — Traceability & QR Batch Tracking
- Hash-chained batch record (origin, listing, order, fulfillment events); QR resolves to a public batch history page. Unchanged from v1 design — lightweight, demoable, tamper-evident.

### M10 — Waste Analytics & Audit Dashboard
- **Views:** total listed vs. sold vs. rescued/donated vs. lost (by region, produce type, time period); waste-risk score distribution over time; negotiation success rate; over-purchase reduction achieved by the Demand Prediction Model (actual order qty vs. naive historical-average baseline); full audit trail of every order and agent decision, filterable and exportable (CSV).
- **Actors:** Producer (own listings only), Buyer (own orders only), Admin (network-wide).
- **Acceptance criteria:** every number shown is traceable back to underlying `Order`/`AgentLog`/`FreshnessAssessment` records — no unexplained aggregate figures.

### M11 — Synthetic Dataset (see Part D for full generation plan)
Large mock dataset of Indian farmers, wholesalers, retailers, and NGOs, statistically grounded in real Indian sources, used to seed both dashboards and train/validate M3 and M4.

### M12 — ESG Impact Certificates
- Per-org, per-period PDF certificate: kg saved via rescue/donation, downloadable, shareable — output of Waste Analytics module, tied to the ESG/CSR revenue line.

### M13 — Admin Console (stretch)
Network health, dataset health, agent activity monitor, dispute override.

## B2. Core Data Model (updated)
```
User(id, phone, name, role[farmer|wholesaler|retailer|buyer|ngo|admin], org_id, verified)
Organization(id, name, type, state, city, lat, lng, accepted_or_produced_types[], verified)
Listing(id, org_id, produce_type, quantity_total, quantity_available, price_per_kg,
        harvest_or_arrival_ts, storage_temp, storage_humidity, images[], status[active|low_stock|closed])
Need(id, org_id, produce_type, quantity_per_period, period, max_price, max_distance_km)
FreshnessAssessment(id, listing_id, waste_risk_score, estimated_days_range, confidence, risk_tier, model_version, ts)
DemandForecast(id, org_id, produce_type, suggested_qty_min, suggested_qty_max, rationale, model_version, ts)
Order(id, listing_id, buyer_org_id, quantity, negotiated_price, status[placed|negotiating|confirmed|fulfilled|rejected|expired], ts)
NegotiationSession(id, order_id, round_count, final_price, final_qty, outcome)
AgentEvent(id, negotiation_session_id OR listing_id, agent_name[producer_agent|buyer_agent|system],
           event_type, payload, human_readable_text, status_color, ts)
Certificate(id, org_id, kg_saved, period_start, period_end, pdf_url)
```

## B3. Sample API Contracts (updated)
```
POST /api/v1/listings                 → create a produce listing (Producer Dashboard)
GET  /api/v1/listings?produce_type=&radius_km=&lat=&lng=&max_price=   → browse (Buyer Dashboard)
POST /api/v1/needs                    → post a standing need (Buyer Dashboard)
POST /api/v1/orders                   → place a virtual order { listing_id, buyer_org_id, quantity }
GET  /api/v1/orders/{id}              → order status + negotiation state
WS   /ws/v1/agent-log?session_id=     → live stream for the log console (M7)
GET  /api/v1/analytics/waste?org_id=&period=   → Waste Analytics & Audit data (M10)
GET  /api/v1/forecast/demand?org_id=&produce_type=   → Demand Prediction (M4)
GET  /api/v1/freshness/{listing_id}   → current waste-risk score (M3)
```

## B4. Non-Functional Requirements (updated)
- **Platform:** must run fully in a standard web browser (desktop and mobile web) — no native app build required.
- **Real-time:** listing quantity and log console updates delivered within 2 seconds via WebSocket/SSE.
- **Concurrency:** inventory deduction must be race-safe under simultaneous orders (see M5 acceptance criteria).
- **Model performance:** shelf-life model MAE and demand model MAPE tracked and reported (see Part E) — not just "it runs."
- **Localization:** Hindi + English UI copy, India-specific units (kg, ₹), Indian address/city data throughout.

---

# PART C — UI/UX DESIGN DIRECTIVE

**Anti-patterns to avoid:** purple/blue AI-gradient hero, glassmorphism cards, generic spinner/loading circle as the *only* feedback for background work, floating 3D robot/brain icon, a single geometric sans font doing everything, centered-box SaaS layout.

**Two-dashboard visual distinction:** Producer Dashboard and Buyer Dashboard should feel like two rooms of the same house — shared palette/type system, but Producer side leans warm/earthy (clay, marigold, leaf green — evokes a farm/mandi) and Buyer side leans slightly cooler/cleaner (still warm-neutral, not corporate blue) to signal "storefront."

**Signature visual — the Live Log Console (M7):** this is the single biggest UX differentiator requested. Design it as a **branded activity ticker**, not a developer terminal:
- Small rounded panel, dockable/collapsible, brand color-coded status dots (amber = searching, blue = negotiating, green = confirmed, red = blocked).
- Each line animates in (slide/fade), not an abrupt jump — feels alive, not laggy.
- Small agent avatars/icons (a simple line-drawn "farmer agent" vs. "buyer agent" glyph) next to each line so the user can visually tell who's "speaking."
- Expandable line-items reveal the underlying offer data in a clean key-value mini-card, not raw JSON.
- This console should visibly replace every spinner in the product — any async action (search, negotiate, deduct inventory) narrates itself here instead of showing a blank loading state.

**Typography/palette/illustration/motion:** unchanged from v1 direction — distinctive display type for headlines, warm earthy palette, hand-drawn produce/basket iconography, asymmetric mandi-stall-inspired grid, Hindi-English code-switched microcopy, purposeful motion (numbers/quantities animating as they change rather than jumping).

---

# PART D — SYNTHETIC / MOCK DATASET PLAN (NGOs, Wholesalers, Retailers, Farmers)

Real, complete datasets of India's NGOs and produce wholesalers willing to transact don't exist publicly at usable scale — so the dataset is generated, but **statistically grounded in real Indian sources** so it behaves realistically in demos and model training.

1. **Grounding sources (used to shape distributions, not scraped verbatim):**
   - AGMARKNET/data.gov.in mandi price dataset → realistic price ranges and produce-type distribution per region.
   - NGO-DARPAN → realistic NGO naming conventions, state-wise distribution, org-type categories.
   - FSSAI storage guidance → realistic storage temperature/humidity baselines per produce type.
   - Census/city-tier data → realistic geographic spread (metro, tier-2, tier-3 India).
2. **Generation method:** Python + Faker (India locale) for names/addresses/phone formats, combined with sampled real-world distributions above for produce type, pricing, and org type — not uniform-random nonsense.
3. **Target scale (MVP seed):**
   | Entity | Count |
   |---|---|
   | Farmers/small producers | 3,000 |
   | Wholesalers/mandi traders | 800 |
   | Retailers/local buyers | 4,000 |
   | Restaurants | 1,000 |
   | NGOs (verified subset) | 500 |
   | Historical orders (for demand model training) | 50,000+ synthetic time-stamped records across 6+ months, seasonally varied |
4. **Time-series realism for the demand model:** synthetic historical orders are generated with seasonal patterns (e.g., higher tomato demand around festivals, monsoon-linked price/demand shifts) so the trained model has genuine signal to learn from, not random noise.
5. **Own captured spoilage dataset:** small controlled time-series photo set (5 produce types × several days × deterioration stages) captured specifically for this project to fine-tune/calibrate M3 alongside the public multimodal dataset — see Part E1.

---

# PART E — MACHINE LEARNING MODEL SPECIFICATIONS

## E1. Shelf-Life & Waste-Risk Model (M3)
- **Task framing:** multi-output — (a) risk-tier classification (fresh / slight / moderate / high / spoiled), (b) remaining-days regression, both with a confidence estimate. Never framed as "exact spoilage timestamp."
- **Training data:**
  - Public multimodal perishable produce dataset (guava, carrot, tomato, Indian gooseberry, banana, mango — RGB/IR + decomposition readings).
  - Own captured time-series dataset (5 produce types, daily photos + labeled deterioration stage + logged temp/humidity) — captured specifically to calibrate against real temporal decay, not just static freshness classification.
  - FSSAI storage-condition baselines used as prior/rule features (expected shelf life per produce type under given storage class).
- **Features:** image embeddings (CNN backbone), produce type (categorical), days since harvest/arrival, storage temperature, storage humidity.
- **Architecture:** CNN backbone (EfficientNet-lite/MobileNetV3, transfer-learned) → embedding concatenated with tabular features → shared dense layers → two heads (classification head for risk tier, regression head for remaining-days range).
- **Training plan:** 70/15/15 train/val/test split, stratified by produce type; data augmentation (rotation, brightness, crop) on the image side to compensate for a small captured dataset; class-weighted loss to handle imbalance across deterioration stages.
- **Evaluation metrics:** classification accuracy/F1 per risk tier; MAE (days) on the regression head; calibration check (confidence should correlate with actual error) — all reported honestly in the demo, including limitations from the small custom dataset.
- **Retraining loop (Phase 2):** every closed order/rescue event with an outcome (sold fresh / discounted / donated / lost) feeds back as a labeled training example, so the model improves on real platform data over time.

## E2. Demand Prediction Model (M4)
- **Task framing:** regression — predict a recommended order-quantity range for a given buyer, produce type, and time window, explicitly to reduce over-purchasing (and the resulting downstream waste).
- **Training data:** synthetic historical order dataset (Part D, 50,000+ records) with seasonal/weather/festival signal engineered in; once live, real platform `Order` history replaces/augments synthetic data.
- **Features:** buyer's rolling historical order volume (last 4/8/12 weeks), produce type, month/season, local weather forecast (rain/heat flags), festival/event calendar flag, current listing price level, buyer type (retailer vs. restaurant vs. NGO — different consumption patterns).
- **Architecture:** gradient-boosted trees (LightGBM/XGBoost) as the primary model — strong on tabular seasonal data and fast to train/retrain; a simple seasonal-naive baseline is also computed so the dashboard can show "our model vs. naive guess" for credibility.
- **Training plan:** time-based train/val/test split (train on earlier months, validate/test on later months — never randomly shuffled, to avoid leakage across time).
- **Evaluation metrics:** MAPE (mean absolute percentage error) against actual order volume; explicit comparison against the naive baseline to demonstrate real uplift — this comparison is what's shown on the Waste Analytics dashboard as "over-purchase reduction achieved."
- **Output surfaced to user:** a quantity range + one-line rationale, shown on the Buyer Dashboard before order confirmation (M4 functional spec).

---

# PART F — SECURITY PROTOCOLS (secure-by-design)

## F1. Threat Model (updated for two-dashboard + negotiation + simulation)
1. Fake listings/needs polluting both dashboards and poisoning model training data.
2. Order-placement abuse — race conditions on the last units of stock, or scripted bulk-ordering to manipulate inventory/negotiation.
3. Agent manipulation — a user trying to force negotiation outcomes outside allowed bounds via crafted inputs.
4. Prompt injection against LLM-assisted negotiation reasoning via listing/need free-text fields.
5. PII exposure — farmer/retailer/NGO phone numbers and locations are sensitive under India's DPDP Act, 2023.
6. Log console information leakage — the live log must not expose another org's private negotiation details.
7. Dataset integrity — synthetic seed data must be clearly flagged internally as synthetic so it's never confused with real user-submitted data in analytics.

## F2. Authentication & Authorization
- Phone-number + OTP authentication for all Producer/Buyer accounts; email+password for admin.
- JWT access tokens (short-lived) + rotating refresh tokens (httpOnly, secure, SameSite=strict).
- **RBAC roles:** `farmer`, `wholesaler`, `retailer`, `buyer_restaurant`, `ngo_verified`, `ngo_pending`, `admin`, `agent_service`.
- Ownership checks on every listing/order/need mutation — a buyer cannot alter another org's listing or see another org's private negotiation payloads.

## F3. Data Protection & Compliance
- TLS 1.3 in transit; AES-256 at rest; field-level encryption for phone numbers and precise coordinates.
- DPDP Act 2023 alignment: explicit consent at signup, stated purpose, data minimization, defined retention/deletion policy.
- Public QR traceability page shows batch/region-level data only — never a producer's or buyer's phone/exact address.

## F4. API & Application Security (OWASP-mapped)
| Risk | Control |
|---|---|
| Broken access control | Server-side RBAC + org-ownership checks on every request |
| Injection | Parameterized queries/ORM, strict schema validation on all inputs (listings, needs, orders) |
| Insecure design | Threat-modeled per module; order/inventory concurrency handled explicitly (F5) |
| Vulnerable components | Automated dependency/SCA scanning in CI |
| Auth failures | OTP rate limiting, short JWT expiry, refresh-token rotation with reuse detection |
| Data integrity failures | Hash-chained traceability, atomic inventory decrement |
| Logging/monitoring failures | Full `AgentEvent`/audit log for every order and negotiation step |
| SSRF | Allowlisted outbound domains only (AGMARKNET, weather, Places) |
- Rate limiting on listing creation, order placement, and search endpoints to block scraping/spam and bulk-order abuse.
- WAF + API gateway in front of all public endpoints; admin/agent-internal endpoints on a private network only.

## F5. Order & Inventory Concurrency Security
- Every order confirmation performs an atomic, row-locked (or optimistic-concurrency-checked) decrement of `quantity_available` — two simultaneous orders for the last units can never both succeed; the loser receives a clear "stock no longer available" response, not a silent failure.
- Order quantity is server-side validated against current `quantity_available` at confirmation time, never trusted from a stale client-side value.

## F6. AI Agent Security
- Producer Agent and Buyer Agent each have a **fixed, allowlisted action set** (offer, counter-offer, accept, reject) — neither can directly write to `Order.status = confirmed` above the human-in-loop threshold without user approval.
- All free-text fields (listing descriptions, need descriptions) are treated as **untrusted input** to any LLM-assisted reasoning step — never allowed to override system instructions or trigger an out-of-allowlist action (prompt-injection defense).
- Every agent action is validated against business rules (price floor/ceiling, quantity ≤ available stock) by a rules engine before it can affect `Order`/`Listing` state — the agent proposes, the rules engine and/or human disposes.
- Full `AgentEvent` logging makes every negotiation fully explainable and auditable after the fact.

## F7. Log Console Data Isolation
- The live log console only streams events belonging to the viewing user's own org/session (`WS /ws/v1/agent-log?session_id=`, server-authorized) — never a global unfiltered feed, so one buyer never sees another buyer's negotiation with the same producer.

## F8. Infrastructure & Secrets
- Secrets in a managed vault, injected at runtime, never committed to source control.
- VPC segmentation: public API tier, private app tier, isolated data tier; least-privilege IAM per service.
- Container image and dependency scanning gated in CI before deploy.

## F9. Monitoring, Audit & Incident Response
- Centralized, tamper-evident audit log for auth, orders, and every agent decision.
- Anomaly alerting: sudden spikes in order volume from one org, repeated failed OTP attempts, negotiation offers outside expected bounds.
- Documented breach-notification process aligned with DPDP Act 2023 timelines.

## F10. Security Checklist (minimum viable, still real)
- [ ] OTP auth + short-lived JWT
- [ ] Server-side RBAC + ownership checks on listings/orders/needs
- [ ] Atomic, race-safe inventory decrement (F5)
- [ ] Schema-level input validation on all endpoints
- [ ] Rate limiting on listing/order/search endpoints
- [ ] Log console scoped per-session, never global (F7)
- [ ] Secrets in vault, never committed
- [ ] TLS enforced end-to-end
- [ ] Agent actions allowlisted + rules-engine-validated before affecting state
- [ ] Full audit log for every order and agent decision

---

*End of document v2.0 — ready to hand to the Antigravity build agent as the build specification.*
