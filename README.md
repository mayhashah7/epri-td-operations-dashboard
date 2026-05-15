# T&D Operations, Planning & Markets

> EPRI AI for Power Challenge — agentic dashboard built on Azure AI Foundry.

Forecasting, AMI analytics, outage management, storm response, and reliability orchestration across transmission & distribution

## Architecture

- **Backend**: FastAPI + WebSocket + synthetic data simulator
- **Frontend**: React / Vite / Tailwind / MapLibre / Recharts
- **Agents**: 11 agents registered in **Azure AI Foundry**
  (orchestrator + 10 specialists)
- **Models**: GPT-5 family per-agent (gpt-5 / gpt-5-mini / gpt-5-chat)
- **Deployment**: Azure Container Apps, Bicep IaC

## Agent fabric

| Agent | Domain | Mission |
|---|---|---|
| `tdo-orchestrator` | routing | Routes requests + aggregates evidence |
| `tdo-market-price-forecast` | market | DA + RT LMP forecast w/ confidence bands |
| `tdo-ami-backcast-forecast` | ami_history | Reconstruct missing AMI intervals + 7-day forward |
| `tdo-ami-data-validation` | ami_validation | VEE pipeline w/ adaptive anomaly thresholds |
| `tdo-domestic-outage-detection` | outage | Last-gasp + pings + customer calls → outage extent |
| `tdo-high-speed-recording` | phasor | PMU / DFR insights — fault localization & oscillations |
| `tdo-constraint-forecasting` | constraint | N-1 / N-1-1 contingency forecasts hour ahead |
| `tdo-extreme-weather-forecast` | weather | Storm impact mapping per circuit |
| `tdo-storm-response-coordination` | storm | Mutual-aid + crew dispatch optimization |
| `tdo-oms-knowledge-retrieval` | oms | Conversational search across OMS history |
| `tdo-reliability-index-analytics` | reliability | SAIDI / SAIFI / CAIDI driver decomposition |

## Scenarios

- **LMP Spike Forecast** → `tdo-market-price-forecast` — Heat-wave & gen retirement → forecast LMPs next 48h
- **AMI Gap Recovery** → `tdo-ami-backcast-forecast` — Sub S-07 had 4h comms outage — backcast intervals
- **Domestic Outage Burst** → `tdo-domestic-outage-detection` — 1,200 last-gasps in 90s — locate the fault
- **Storm Incoming** → `tdo-extreme-weather-forecast` — Cat-2 hurricane 36h out — estimate circuit impact
- **Storm Coordination** → `tdo-storm-response-coordination` — Pre-stage 14 mutual-aid crews
- **Contingency Warning** → `tdo-constraint-forecasting` — N-1 risk on 230kV ring next hour
- **OMS Q&A** → `tdo-oms-knowledge-retrieval` — Show all rear-lot outages > 4h since Jan
- **Reliability Driver Audit** → `tdo-reliability-index-analytics` — Decompose SAIDI YTD by cause

## Local dev

```bash
# API
cd apps/dashboard-api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web
cd apps/dashboard-web
npm install && npm run dev
```

## Deploy

```bash
./scripts/deploy.sh   # provisions Container Apps + seeds Foundry agents
```

---
Part of the [EPRI AI for Power Challenge 2026](https://epri.brightidea.com/AIforPower2026) demo set.
