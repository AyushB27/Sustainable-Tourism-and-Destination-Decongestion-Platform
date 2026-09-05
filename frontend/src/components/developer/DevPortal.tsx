import React, { useEffect, useState, useCallback } from 'react';
import {
  Activity,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Server,
  Code2,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PipelineStatus {
  source: string;
  status: string;
  temperature_c?: number;
  rain_mm?: number;
  wind_kmh?: number;
  hazard_score?: number;
  delay_factor?: number;
  current_speed_kmh?: number;
  free_flow_speed_kmh?: number;
  footfall_factor?: number;
  live_busyness_pct?: number;
  osm_poi_nodes?: number;
}

interface DestTransparency {
  id: string;
  name: string;
  current_inflow: number;
  physical_capacity: number;
  dcc_score: number;
  status: string;
  wait_minutes: number;
  pipelines: {
    weather: PipelineStatus;
    traffic: PipelineStatus;
    footfall: PipelineStatus;
    osm: PipelineStatus;
  };
}

interface DevStatus {
  backend_version: string;
  server_uptime_seconds: number;
  last_telemetry_sync: string | null;
  total_sensor_readings_logged: number;
  destinations: DestTransparency[];
  api_key_status: Record<string, string>;
  database: {
    path: string;
    journal_mode: string;
    sensor_readings_count: number;
    green_passes_issued: number;
    active_advisories: number;
  };
  sih_requirement_status: Record<string, string>;
  frontend_api_connections: Record<string, string>;
}

interface SensorLogRow {
  id: number;
  destination_id: string;
  timestamp: string;
  temperature_c: number;
  rain_mm: number;
  dcc_score: number;
  status: string;
  traffic_delay_factor: number;
  footfall_factor: number;
  calculated_inflow: number;
  wait_minutes: number;
}

// ─── Helper: Pipeline Status Pill ─────────────────────────────────────────────

function PipelinePill({ pipelineStatus }: { pipelineStatus: PipelineStatus }) {
  const s = pipelineStatus.status?.toLowerCase() ?? '';
  const src = pipelineStatus.source ?? '';

  let icon = '🟡';
  let colorClass = 'bg-amber-900/50 text-amber-300 border-amber-700';
  let label = 'SIMULATED';

  if (s === 'connected' || s === 'live_verified') {
    icon = '🟢';
    colorClass = 'bg-emerald-900/50 text-emerald-300 border-emerald-700';
    label = 'LIVE';
  } else if (s === 'fallback' || s === 'cached_estimate') {
    icon = '🔴';
    colorClass = 'bg-rose-900/50 text-rose-300 border-rose-700';
    label = 'FALLBACK';
  } else if (s === 'hardcoded') {
    icon = '⚫';
    colorClass = 'bg-slate-800 text-slate-400 border-slate-600';
    label = 'HARDCODED';
  }

  // Short source label
  const shortSrc = src
    .replace('Open-Meteo Live API', 'Open-Meteo')
    .replace('Open-Meteo Simulator', 'Simulator')
    .replace('TomTom Heuristic Diurnal Model', 'Heuristic')
    .replace('TomTom Live Traffic API', 'TomTom Live')
    .replace('TomTom Cached Fallback', 'TomTom Fallback')
    .replace('BestTime Hourly Model', 'BestTime Model')
    .replace('BestTime Live API', 'BestTime Live')
    .replace('BestTime Fallback', 'BestTime Fallback')
    .replace('OpenStreetMap Overpass API', 'OSM Overpass');

  return (
    <div className={`inline-flex flex-col gap-0.5 px-2 py-1 rounded border text-[10px] font-mono ${colorClass}`}>
      <span className="font-bold">{icon} {label}</span>
      <span className="opacity-70">{shortSrc}</span>
    </div>
  );
}

// ─── Helper: Raw Value Readout ─────────────────────────────────────────────────

function RawValue({ label, value, unit = '' }: { label: string; value: number | null | undefined; unit?: string }) {
  if (value == null) return null;
  return (
    <span className="text-[9px] font-mono text-slate-400">
      {label}: <span className="text-slate-200">{value}{unit}</span>
    </span>
  );
}

// ─── Helper: Format uptime ────────────────────────────────────────────────────

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

// ─── Helper: SIH Status Badge ─────────────────────────────────────────────────

function SihBadge({ text }: { text: string }) {
  if (text.startsWith('DONE')) {
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700">✅ DONE</span>;
  }
  if (text.startsWith('PARTIAL')) {
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/60 text-amber-300 border border-amber-700">🟡 PARTIAL</span>;
  }
  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-900/60 text-rose-300 border border-rose-700">❌ NOT STARTED</span>;
}

// ─── Helper: Connection Badge ─────────────────────────────────────────────────

function ConnBadge({ text }: { text: string }) {
  if (text.startsWith('CONNECTED')) {
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700">✅ Connected</span>;
  }
  if (text.startsWith('AVAILABLE')) {
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700">📖 Available</span>;
  }
  return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-600">❌ Not Connected</span>;
}

// ─── Main DevPortal Component ─────────────────────────────────────────────────

export const DevPortal: React.FC = () => {
  const [status, setStatus] = useState<DevStatus | null>(null);
  const [sensorLogs, setSensorLogs] = useState<SensorLogRow[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>('—');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async () => {
    setRefreshing(true);
    try {
      const [statusRes, logsRes] = await Promise.allSettled([
        fetch('http://127.0.0.1:8000/api/dev/status', { signal: AbortSignal.timeout(6000) }),
        fetch('http://127.0.0.1:8000/api/destinations/live', { signal: AbortSignal.timeout(6000) }),
      ]);

      let isOnline = false;

      if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
        const data: DevStatus = await statusRes.value.json();
        setStatus(data);
        isOnline = true;
      }

      // Build a mock sensor log from live destinations for the log viewer
      if (logsRes.status === 'fulfilled' && logsRes.value.ok) {
        const liveData = await logsRes.value.json();
        const rows: SensorLogRow[] = (liveData.destinations ?? []).map(
          (d: {
            id: string;
            dcc_score: number;
            status: string;
            current_inflow: number;
            estimated_wait_minutes: number;
            live_sensors?: {
              weather?: { temperature_c: number; rain_mm: number; hazard_score: number };
              traffic?: { delay_factor: number };
              footfall?: { footfall_factor: number };
            };
          }, i: number) => ({
            id: i + 1,
            destination_id: d.id,
            timestamp: new Date().toISOString(),
            temperature_c: d.live_sensors?.weather?.temperature_c ?? 0,
            rain_mm: d.live_sensors?.weather?.rain_mm ?? 0,
            dcc_score: d.dcc_score,
            status: d.status,
            traffic_delay_factor: d.live_sensors?.traffic?.delay_factor ?? 1.0,
            footfall_factor: d.live_sensors?.footfall?.footfall_factor ?? 1.0,
            calculated_inflow: d.current_inflow,
            wait_minutes: d.estimated_wait_minutes,
          })
        );
        setSensorLogs(rows);
        isOnline = true;
      }

      setBackendOnline(isOnline);
    } catch {
      setBackendOnline(false);
    }
    setLastRefresh(new Date().toLocaleTimeString());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // ─── SIH requirement labels
  const sihLabels: Record<string, string> = {
    req_1_collect_signals: 'Collect tourism signals (weather, traffic, footfall)',
    req_2_predict_congestion: 'Predict destination-level tourist congestion',
    req_3_identify_overcrowding: 'Identify overcrowding thresholds',
    req_4_recommend_twins: 'Recommend alternative destinations',
    req_5_recommend_times: 'Recommend alternative times & routes',
    req_6_estimate_wait_times: 'Estimate waiting time & congestion',
    req_7_demand_spread: 'Analyse tourist movement between destinations',
    req_8_authority_forecasts: 'Provide authorities with demand forecasts',
    req_9_underutilised_spots: 'Identify under-utilised destinations',
    req_10_advisories: 'Create temporary advisories & restrictions',
    req_11_multilingual: 'Provide multilingual recommendations',
    req_12_eco_indicators: 'Support sustainable tourism indicators',
    req_13_trip_planning: 'Future trip planning (multi-day itinerary)',
    req_14_ai_helpline: '24x7 AI tourism helpline',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono p-4 sm:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
            <Code2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white">
              EcoRoute Bharat — Developer Production Portal
            </h1>
            <p className="text-[11px] text-slate-500">
              SIH26204 • Data Transparency & System Audit • Read-only inspector
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500">Last refresh: {lastRefresh}</span>
          <button
            onClick={fetchStatus}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] font-bold text-slate-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {backendOnline === null ? (
            <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">Connecting…</span>
          ) : backendOnline ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-emerald-900/40 border border-emerald-700 rounded text-[10px] text-emerald-300">
              <Wifi className="w-3 h-3" /> Backend Online
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 bg-rose-900/40 border border-rose-700 rounded text-[10px] text-rose-400">
              <WifiOff className="w-3 h-3" /> Backend Offline
            </span>
          )}
        </div>
      </div>

      {/* ── Section A: Backend Health & Uptime ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <Server className="w-3.5 h-3.5" />
          Section A — Backend Health & Uptime
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              label: 'Uptime',
              icon: <Clock className="w-3.5 h-3.5 text-emerald-400" />,
              value: status ? formatUptime(status.server_uptime_seconds) : '—',
            },
            {
              label: 'Backend Version',
              icon: <Activity className="w-3.5 h-3.5 text-blue-400" />,
              value: status?.backend_version ?? '—',
            },
            {
              label: 'Sensor Readings',
              icon: <BarChart3 className="w-3.5 h-3.5 text-amber-400" />,
              value: status ? `${status.total_sensor_readings_logged} rows` : '—',
            },
            {
              label: 'DB Journal Mode',
              icon: <Database className="w-3.5 h-3.5 text-purple-400" />,
              value: status?.database.journal_mode ?? '—',
            },
            {
              label: 'Last Sync',
              icon: <RefreshCw className="w-3.5 h-3.5 text-slate-400" />,
              value: status?.last_telemetry_sync
                ? new Date(status.last_telemetry_sync).toLocaleTimeString()
                : 'No sync yet',
            },
          ].map((card) => (
            <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                {card.icon} {card.label}
              </div>
              <div className="text-xs font-bold text-white break-all">{card.value}</div>
            </div>
          ))}
        </div>
        {/* DB Counts */}
        {status && (
          <div className="flex flex-wrap gap-3 text-[11px]">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              🗄️ DB Path: <span className="text-white font-bold">{status.database.path}</span>
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              🟢 Passes Issued: <span className="text-emerald-300 font-bold">{status.database.green_passes_issued}</span>
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              🚨 Active Advisories: <span className="text-amber-300 font-bold">{status.database.active_advisories}</span>
            </span>
          </div>
        )}
      </section>

      {/* ── Section B: Data Source Transparency ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <Activity className="w-3.5 h-3.5" />
          Section B — Data Source Transparency Panel
        </div>
        <div className="text-[10px] text-slate-600 flex flex-wrap gap-3 pb-1">
          <span>🟢 LIVE — External API responding</span>
          <span>🟡 SIMULATED — Heuristic/time-based model</span>
          <span>🔴 FALLBACK — API failed/timed out</span>
          <span>⚫ HARDCODED — Static value</span>
        </div>
        {backendOnline === false ? (
          <div className="bg-rose-950/40 border border-rose-800 p-4 rounded-xl text-rose-300 text-sm">
            ⚠️ Backend is offline. Start the server: <code className="bg-rose-900/50 px-1 rounded">python backend/main.py</code>
          </div>
        ) : status && status.destinations.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-[10px] min-w-[700px]">
              <thead className="bg-slate-900/80">
                <tr>
                  {['Destination', 'Live Metrics', 'Weather', 'Traffic', 'Footfall', 'OSM Amenities'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {status.destinations.map((dest, i) => (
                  <tr key={dest.id} className={`border-b border-slate-800/60 ${i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950'}`}>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="font-bold text-white text-[11px]">{dest.name}</div>
                      <div className="text-slate-600 text-[9px]">ID: {dest.id}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-0.5">
                        <div className="text-[10px]">
                          Inflow: <span className={`font-bold ${dest.dcc_score >= 0.85 ? 'text-rose-400' : dest.dcc_score >= 0.70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {dest.current_inflow?.toLocaleString()}
                          </span>/{dest.physical_capacity?.toLocaleString()}
                        </div>
                        <div className="text-[10px]">
                          DCC: <span className={`font-bold ${dest.dcc_score >= 0.85 ? 'text-rose-400' : dest.dcc_score >= 0.70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {dest.dcc_score?.toFixed(2)}
                          </span>
                          <span className="ml-1 text-slate-500">({dest.status})</span>
                        </div>
                        {dest.wait_minutes > 0 && (
                          <div className="text-rose-400 text-[9px]">+{dest.wait_minutes}min wait</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <PipelinePill pipelineStatus={dest.pipelines.weather} />
                      <div className="mt-1 flex flex-col gap-0.5">
                        <RawValue label="🌧" value={dest.pipelines.weather.rain_mm} unit="mm" />
                        <RawValue label="💨" value={dest.pipelines.weather.wind_kmh} unit="km/h" />
                        <RawValue label="🌡" value={dest.pipelines.weather.temperature_c} unit="°C" />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <PipelinePill pipelineStatus={dest.pipelines.traffic} />
                      <div className="mt-1 flex flex-col gap-0.5">
                        <RawValue label="×" value={dest.pipelines.traffic.delay_factor} />
                        <RawValue label="spd" value={dest.pipelines.traffic.current_speed_kmh} unit="km/h" />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <PipelinePill pipelineStatus={dest.pipelines.footfall} />
                      <div className="mt-1 flex flex-col gap-0.5">
                        <RawValue label="×" value={dest.pipelines.footfall.footfall_factor} />
                        <RawValue label="busy" value={dest.pipelines.footfall.live_busyness_pct} unit="%" />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <PipelinePill pipelineStatus={dest.pipelines.osm} />
                      <div className="mt-1">
                        <RawValue label="nodes" value={dest.pipelines.osm.osm_poi_nodes} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-500 text-sm text-center">
            Waiting for first telemetry sync… (triggers within 60 seconds of backend start)
          </div>
        )}
      </section>

      {/* ── Section C: SIH Requirement Audit ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Section C — SIH26204 Requirement Audit ({Object.keys(sihLabels).length} requirements)
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-[10px] min-w-[600px]">
            <thead className="bg-slate-900/80">
              <tr>
                {['Req #', 'Requirement', 'Status', 'Implementation Detail'].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(sihLabels).map(([key, label], i) => {
                const detail = status?.sih_requirement_status?.[key] ?? 'Fetching…';
                return (
                  <tr key={key} className={`border-b border-slate-800/60 ${i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950'}`}>
                    <td className="px-3 py-2 text-slate-500 font-bold whitespace-nowrap">{i + 1}</td>
                    <td className="px-3 py-2 text-slate-300 max-w-[220px]">{label}</td>
                    <td className="px-3 py-2 whitespace-nowrap"><SihBadge text={detail} /></td>
                    <td className="px-3 py-2 text-slate-400 max-w-[300px]">
                      {detail.replace(/^(DONE|PARTIAL|NOT STARTED) — /, '')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section D: API Endpoint Registry ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <Code2 className="w-3.5 h-3.5" />
          Section D — API Endpoint Registry
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-[10px] min-w-[500px]">
            <thead className="bg-slate-900/80">
              <tr>
                {['Endpoint', 'Frontend Connected?', 'Notes'].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {status
                ? Object.entries(status.frontend_api_connections).map(([endpoint, detail], i) => (
                    <tr key={endpoint} className={`border-b border-slate-800/60 ${i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950'}`}>
                      <td className="px-3 py-2 font-mono text-cyan-400 whitespace-nowrap">{endpoint}</td>
                      <td className="px-3 py-2 whitespace-nowrap"><ConnBadge text={detail} /></td>
                      <td className="px-3 py-2 text-slate-400">{detail.replace(/^(CONNECTED|NOT CONNECTED|AVAILABLE) — /, '')}</td>
                    </tr>
                  ))
                : (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-slate-600 text-center">Loading endpoint registry…</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section E: Live SQLite Log Viewer ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <Database className="w-3.5 h-3.5" />
          Section E — Live Telemetry Log (Current Snapshot — updates every 60s via background worker)
        </div>
        {sensorLogs.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-[10px] min-w-[700px] font-mono">
              <thead className="bg-slate-900/80">
                <tr>
                  {['Destination', 'Timestamp', 'Inflow', 'DCC Score', 'Status', 'Traffic ×', 'Footfall ×', 'Rain mm', 'Wait min'].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sensorLogs.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-800/60 ${i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950'}`}>
                    <td className="px-3 py-2 text-cyan-400 font-bold">{row.destination_id}</td>
                    <td className="px-3 py-2 text-slate-500">{new Date(row.timestamp).toLocaleTimeString()}</td>
                    <td className="px-3 py-2 text-white">{row.calculated_inflow?.toLocaleString()}</td>
                    <td className={`px-3 py-2 font-bold ${row.dcc_score >= 0.85 ? 'text-rose-400' : row.dcc_score >= 0.70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {row.dcc_score?.toFixed(3)}
                    </td>
                    <td className={`px-3 py-2 font-bold ${row.status === 'CRITICAL' ? 'text-rose-400' : row.status === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {row.status}
                    </td>
                    <td className="px-3 py-2 text-slate-300">{row.traffic_delay_factor?.toFixed(2)}×</td>
                    <td className="px-3 py-2 text-slate-300">{row.footfall_factor?.toFixed(2)}×</td>
                    <td className="px-3 py-2 text-slate-300">{row.rain_mm}</td>
                    <td className="px-3 py-2 text-slate-300">{row.wait_minutes > 0 ? `+${row.wait_minutes}` : '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-500 text-sm text-center">
            {backendOnline === false
              ? 'Backend offline — no telemetry available.'
              : 'Waiting for live destinations feed…'}
          </div>
        )}
      </section>

      {/* ── Section F: Architecture Reality Notice ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <AlertTriangle className="w-3.5 h-3.5" />
          Section F — Architecture Reality Notice
        </div>

        {/* API Key Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {status
            ? Object.entries(status.api_key_status).map(([key, val]) => {
                const isConfigured = val.startsWith('CONFIGURED') || val.startsWith('NO_KEY');
                return (
                  <div key={key} className={`flex items-start gap-2 p-3 rounded-xl border text-[10px] ${isConfigured ? 'bg-emerald-950/30 border-emerald-800' : 'bg-amber-950/30 border-amber-800'}`}>
                    {isConfigured
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      : <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    }
                    <div>
                      <div className="font-bold text-white">{key}</div>
                      <div className="text-slate-400 mt-0.5">{val}</div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>

        <div className="bg-amber-950/30 border-2 border-amber-700/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Architecture Reality & Transparency Statement
          </div>
          <ul className="text-[11px] text-amber-200/80 space-y-1.5 pl-4 list-disc">
            <li>
              <strong>Weather data is LIVE</strong> — Open-Meteo API is called for every destination with real GPS coordinates. No API key required.
            </li>
            <li>
              <strong>Traffic data is SIMULATED</strong> — No TomTom API key configured. A heuristic model applies 2.1× peak weekend, 1.4× weekend, 1.05× weekday multipliers.
            </li>
            <li>
              <strong>Footfall data is SIMULATED</strong> — No BestTime API key configured. An hourly model applies 1.45× midday weekends, 0.85× mornings.
            </li>
            <li>
              <strong>OSM Amenities are LIVE</strong> — OpenStreetMap Overpass API queried per destination. Falls back to 18 nodes on timeout.
            </li>
            <li>
              <strong>SQLite database is REAL</strong> — WAL mode enabled. Background worker writes telemetry every 60 seconds.
            </li>
            <li>
              <strong>TouristView now uses live data</strong> — Dynamic destination selection wired to Zustand store, which polls <code className="bg-amber-900/50 px-0.5 rounded">/api/destinations/live</code> every 25 seconds.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
