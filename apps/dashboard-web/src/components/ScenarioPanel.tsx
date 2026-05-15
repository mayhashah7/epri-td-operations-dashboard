import { useState } from 'react';
import { postJson, type Substation } from '../lib/api';

const SCENARIOS = [
  { id: 'price-spike', label: 'LMP Spike Forecast', agent: 'tdo-market-price-forecast', hint: 'Heat-wave & gen retirement → forecast LMPs next 48h' },
  { id: 'ami-gap', label: 'AMI Gap Recovery', agent: 'tdo-ami-backcast-forecast', hint: 'Sub S-07 had 4h comms outage — backcast intervals' },
  { id: 'outage-burst', label: 'Domestic Outage Burst', agent: 'tdo-domestic-outage-detection', hint: '1,200 last-gasps in 90s — locate the fault' },
  { id: 'storm-incoming', label: 'Storm Incoming', agent: 'tdo-extreme-weather-forecast', hint: 'Cat-2 hurricane 36h out — estimate circuit impact' },
  { id: 'storm-coord', label: 'Storm Coordination', agent: 'tdo-storm-response-coordination', hint: 'Pre-stage 14 mutual-aid crews' },
  { id: 'constraint-warning', label: 'Contingency Warning', agent: 'tdo-constraint-forecasting', hint: 'N-1 risk on 230kV ring next hour' },
  { id: 'oms-query', label: 'OMS Q&A', agent: 'tdo-oms-knowledge-retrieval', hint: 'Show all rear-lot outages > 4h since Jan' },
  { id: 'reliability-driver', label: 'Reliability Driver Audit', agent: 'tdo-reliability-index-analytics', hint: 'Decompose SAIDI YTD by cause' },
];

export function ScenarioPanel({ onRan, substations }: { onRan: () => void; substations: Substation[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [last, setLast] = useState<string>('');
  const sub = substations[0]?.substation_id ?? '';

  async function run(id: string) {
    setBusy(id); setLast('');
    try {
      const body: any = id === 'storm-outage' ? { substation_id: sub, feeder_index: 7 }
                       : id === 'theft'       ? { substation_id: sub, count: 3 }
                       : id === 'heat-wave'   ? {}
                       : { substation_id: sub };
      const r = await postJson<any>(`/api/scenarios/${id}`, body);
      setLast(`✓ ${id} → ${r.agent_dispatched ?? 'dispatched'}`);
      onRan();
    } catch (e: any) { setLast(`error: ${e.message}`); }
    finally { setBusy(null); }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold tracking-wide">SCENARIOS</h2>
        <span className="text-xs text-slate-500">click to inject + auto-dispatch agent</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 flex-1 overflow-y-auto">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            disabled={!!busy}
            onClick={() => run(s.id)}
            className="text-left p-1.5 rounded-lg bg-grid-bg border border-grid-border hover:border-grid-accent disabled:opacity-50 transition group"
            title={s.hint}
          >
            <div className="text-xs font-medium text-grid-accent leading-tight">{busy === s.id ? '⏳' : s.label}</div>
            <div className="text-xs text-grid-info font-mono mt-0.5">→ {s.agent}</div>
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.hint}</div>
          </button>
        ))}
      </div>
      {last && <div className="text-xs text-grid-ok mt-1 truncate font-mono">{last}</div>}
    </div>
  );
}
