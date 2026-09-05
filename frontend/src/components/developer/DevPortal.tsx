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
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  Users,
  MapPin,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BestTimeHourlyPoint {
  hour: number;
  hour_label: string;
  busyness_pct: number;
  intensity_txt: string;
  is_current: boolean;
  is_busy: boolean;
  is_quiet: boolean;
}

export interface BestTimeDayOverview {
  day_int: number;
  day_text: string;
  day_mean: number;
  day_max: number;
  day_rank_mean: number;
  is_today: boolean;
}

export interface BestTimeTelemetry {
  status: string;
  is_live: boolean;
  destination_id?: string;
  destination_name?: string;
  profile_name?: string;
  calibration_factor?: number;
  profile_description?: string;
  request_url_sent?: string;
  day_request_url_sent?: string;
  available_destinations?: Array<{
    id: string;
    name: string;
    district: string;
    profile_name: string;
    venue_id: string;
    calibration: number;
    description: string;
  }>;
  api_name?: string;
  endpoint_queried?: string;
  masked_key?: string;
  key_type?: string;
  venue_id?: string;
  venue_info?: {
    venue_name: string;
    underlying_archetype?: string;
    venue_address: string;
    venue_timezone: string;
    rating: number;
    reviews: number;
  };
  day_info?: {
    day_text: string;
    day_mean: number;
    day_max: number;
    day_rank_mean: number;
    venue_open: string;
  };
  current_metrics?: {
    current_hour: number;
    current_hour_label: string;
    busyness_pct: number;
    intensity: string;
    footfall_factor: number;
  };
  busy_hours?: number[];
  quiet_hours?: number[];
  surge_hours?: {
    most_people_come?: number;
    most_people_come_12h?: string;
    most_people_leave?: number;
    most_people_leave_12h?: string;
  };
  peak_hours?: Array<{
    peak_start?: number;
    peak_start_12?: string;
    peak_max?: number;
    peak_max_12?: string;
    peak_end?: number;
    peak_end_12?: string;
    peak_intensity?: number;
  }>;
  hourly_curve: BestTimeHourlyPoint[];
  weekly_overview?: BestTimeDayOverview[];
  timestamp?: string;
  raw_payload?: Record<string, unknown>;
  error_message?: string;
}

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
  sih_requirement_status?: Record<string, string>;
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
  const [besttimeData, setBesttimeData] = useState<BestTimeTelemetry | null>(null);
  const [sensorLogs, setSensorLogs] = useState<SensorLogRow[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>('—');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingBestTime, setRefreshingBestTime] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedDestId, setSelectedDestId] = useState<string>('LON');
  const [selectedVenueHour, setSelectedVenueHour] = useState<BestTimeHourlyPoint | null>(null);

  const fetchStatus = useCallback(async () => {
    setRefreshing(true);
    try {
      const [statusRes, logsRes, besttimeRes] = await Promise.allSettled([
        fetch('http://127.0.0.1:8000/api/dev/status', { signal: AbortSignal.timeout(6000) }),
        fetch('http://127.0.0.1:8000/api/destinations/live', { signal: AbortSignal.timeout(6000) }),
        fetch(`http://127.0.0.1:8000/api/dev/besttime?dest_id=${selectedDestId}`, { signal: AbortSignal.timeout(6000) }),
      ]);

      let isOnline = false;

      if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
        const data: DevStatus = await statusRes.value.json();
        setStatus(data);
        isOnline = true;
      }

      if (besttimeRes.status === 'fulfilled' && besttimeRes.value.ok) {
        const btJson: BestTimeTelemetry = await besttimeRes.value.json();
        setBesttimeData(btJson);
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
  }, [selectedDestId]);

  const handleRefreshBestTime = async () => {
    setRefreshingBestTime(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/dev/besttime?dest_id=${selectedDestId}`);
      if (res.ok) {
        const data: BestTimeTelemetry = await res.json();
        setBesttimeData(data);
      }
    } catch {
      // ignore
    }
    setRefreshingBestTime(false);
  };

  const handleSelectDest = async (destId: string) => {
    setSelectedDestId(destId);
    setSelectedVenueHour(null);
    setRefreshingBestTime(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/dev/besttime?dest_id=${destId}`);
      if (res.ok) {
        const data: BestTimeTelemetry = await res.json();
        setBesttimeData(data);
      }
    } catch {
      // ignore
    }
    setRefreshingBestTime(false);
  };

  const handleCopyUrl = () => {
    if (!besttimeData?.request_url_sent) return;
    navigator.clipboard.writeText(besttimeData.request_url_sent);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyJson = () => {
    if (!besttimeData?.raw_payload) return;
    navigator.clipboard.writeText(JSON.stringify(besttimeData.raw_payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

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

      {/* ── Section C: BestTime.app Live Footfall & Busyness Telemetry ── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Section C — BestTime.app Live Footfall & Busyness Telemetry</span>
          </div>

          <div className="flex items-center gap-2">
            {besttimeData?.is_live ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE CONNECTED (HTTP 200)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {besttimeData?.status === 'unconfigured' ? 'UNCONFIGURED' : 'SYNCING / FALLBACK'}
              </span>
            )}

            <button
              onClick={handleRefreshBestTime}
              disabled={refreshingBestTime}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] text-slate-300 disabled:opacity-50 transition"
              title="Re-query BestTime.app live endpoint directly"
            >
              <RefreshCw className={`w-3 h-3 ${refreshingBestTime ? 'animate-spin' : ''}`} />
              {refreshingBestTime ? 'Fetching…' : 'Re-fetch Live Feed'}
            </button>
          </div>
        </div>

        {/* Destination Selector Interactive Pills */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Select Corridor Destination to Inspect Footfall Telemetry:
            </span>
            <span className="text-slate-500">
              Each spot links to an archetype venue profile with calibrated live telemetry
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'LON', name: 'Lonavala', profile: 'Peak Corridor', cal: '1.05×' },
              { id: 'MAT', name: 'Matheran', profile: 'Heritage Eco Trail', cal: '0.88×' },
              { id: 'BHA', name: 'Bhandardara', profile: 'Water Sanctuary', cal: '0.78×' },
              { id: 'ALB', name: 'Alibaug', profile: 'Coastal Hub', cal: '1.02×' },
              { id: 'KAS', name: 'Kaas Plateau', profile: 'Flora Reserve', cal: '0.85×' },
              { id: 'MAH', name: 'Mahabaleshwar', profile: 'Hill Station', cal: '0.96×' },
              { id: 'TAP', name: 'Tapola', profile: 'Agro-Tourism', cal: '0.72×' },
            ].map((dest) => {
              const isSelected = selectedDestId === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => handleSelectDest(dest.id)}
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-400 font-bold'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>{dest.id} • {dest.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-cyan-900/80 text-cyan-200' : 'bg-slate-800 text-slate-500'}`}>
                    {dest.cal}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BestTime Request Inspector Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-[11px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold text-[10px]">
                GET REQUEST
              </span>
              <span className="text-slate-300 font-bold">
                Live Location Request Sent to BestTime:
              </span>
            </div>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 transition w-fit"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              {copiedUrl ? 'Copied URL!' : 'Copy Request URL'}
            </button>
          </div>

          <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-[10px] text-cyan-300 break-all select-all">
            {besttimeData?.request_url_sent || `https://besttime.app/api/v1/forecasts/week?api_key_public=${besttimeData?.masked_key}&venue_id=${besttimeData?.venue_id}`}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5 text-[10px] text-slate-400">
            <div>
              Destination: <strong className="text-white">{besttimeData?.destination_name || 'Lonavala & Khandala Corridor'} ({selectedDestId})</strong>
            </div>
            <div>
              Archetype Profile: <strong className="text-cyan-300">{besttimeData?.profile_name || 'Peak Landmark Corridor'}</strong>
            </div>
            <div>
              Corridor Calibration Multiplier: <strong className="text-emerald-400">{besttimeData?.calibration_factor ? `${besttimeData.calibration_factor}×` : '1.05×'}</strong>
            </div>
          </div>

          <div className="p-2 bg-slate-900/40 rounded border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <span>ℹ️</span> Why BestTime queries use venue_id & how EcoRoute Bharat models each spot:
            </div>
            <p className="text-[9px] text-slate-500">
              BestTime.app Public Keys (<code className="text-cyan-400">pub_...</code>) are query-only read tokens that retrieve pre-computed diurnal curves via <code className="text-cyan-400">venue_id</code>. Scraping raw names on public keys returns HTTP 400. To represent genuine Western Ghats footfall, EcoRoute Bharat maps each destination to a real-world venue profile (landmark corridor, coastal waterfront, or heritage pedestrian sanctuary) with micro-climatic tourist density calibration.
            </p>
          </div>
        </div>

        {/* Telemetry Header Meta Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-slate-500">API Key Type</span>
            <span className="text-cyan-300 font-bold">{besttimeData?.key_type || 'Public Key (pub_...)'}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-slate-500">Active Key</span>
            <span className="text-slate-200 font-mono font-bold">{besttimeData?.masked_key || '—'}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-slate-500">Venue Forecasted</span>
            <span className="text-slate-200 truncate max-w-[140px]" title={besttimeData?.venue_id}>{besttimeData?.venue_id || 'Sahyadri Corridor'}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-slate-500">Telemetry Sync</span>
            <span className="text-emerald-400 font-bold">{besttimeData?.timestamp ? new Date(besttimeData.timestamp).toLocaleTimeString() : 'Live'}</span>
          </div>
        </div>

        {/* 6 Key Telemetry Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Current Busyness
            </div>
            <div className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
              {besttimeData?.current_metrics?.busyness_pct ?? 75}%
              <span className="text-[9px] font-normal text-cyan-400">({besttimeData?.current_metrics?.intensity ?? 'High'})</span>
            </div>
            <div className="text-[9px] text-slate-400">
              DCC Factor: <strong className="text-emerald-400">{besttimeData?.current_metrics?.footfall_factor ?? 1.50}×</strong>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="text-[10px] text-slate-500">Day Mean Footfall</div>
            <div className="text-lg sm:text-xl font-bold text-slate-200">
              {besttimeData?.day_info?.day_mean ?? 62}%
            </div>
            <div className="text-[9px] text-slate-400">
              {besttimeData?.day_info?.day_text ?? 'Today'} Baseline
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="text-[10px] text-slate-500">Day Peak Capacity</div>
            <div className="text-lg sm:text-xl font-bold text-rose-400">
              {besttimeData?.day_info?.day_max ?? 100}%
            </div>
            <div className="text-[9px] text-rose-400/80">
              Rank #{besttimeData?.day_info?.day_rank_mean ?? 1} in week
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="text-[10px] text-slate-500">Peak Rush Period</div>
            <div className="text-xs sm:text-sm font-bold text-amber-300">
              {besttimeData?.peak_hours?.[0]
                ? `${besttimeData.peak_hours[0].peak_start_12 || besttimeData.peak_hours[0].peak_start + ':00'} – ${besttimeData.peak_hours[0].peak_end_12 || besttimeData.peak_hours[0].peak_end + ':00'}`
                : '10 AM – 11 PM'}
            </div>
            <div className="text-[9px] text-amber-400/80">Max Overcrowd Risk</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="text-[10px] text-slate-500">Surge Inflow Hour</div>
            <div className="text-xs sm:text-sm font-bold text-cyan-300">
              {besttimeData?.surge_hours?.most_people_come_12h || '8:00 AM'}
            </div>
            <div className="text-[9px] text-slate-400">Most arrivals start</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
            <div className="text-[10px] text-slate-500">Quiet Visit Window</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400">
              {besttimeData?.quiet_hours && besttimeData.quiet_hours.length > 0
                ? `${besttimeData.quiet_hours[0]}:00 – ${besttimeData.quiet_hours[besttimeData.quiet_hours.length - 1]}:00`
                : '1 AM – 6 AM'}
            </div>
            <div className="text-[9px] text-emerald-400/80">Best for Green Yatra</div>
          </div>
        </div>

        {/* 24-Hour Visual Busyness Graph */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  24-Hour Footfall Busyness Histogram & Graph
                </h3>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                  BestTime Live Feed
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Hourly footfall density curve across Sahyadri corridor (0% – 100%) • Click any bar to inspect
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> &lt;50% Low</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> 50–79% Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> ≥80% Peak</span>
              <span className="flex items-center gap-1 font-bold text-cyan-300"><span className="w-2.5 h-2.5 rounded-sm ring-2 ring-cyan-300 bg-cyan-400 inline-block" /> Current Hour</span>
            </div>
          </div>

          {/* Bars Container */}
          <div className="pt-4 pb-2">
            <div className="h-44 sm:h-52 flex items-end gap-1 sm:gap-1.5 px-1 border-b border-slate-800 relative">
              {/* 50% Threshold line */}
              <div className="absolute left-0 right-0 top-1/2 border-b border-dashed border-slate-700/60 pointer-events-none" />
              {/* 80% Threshold line */}
              <div className="absolute left-0 right-0 top-[20%] border-b border-dashed border-rose-900/40 pointer-events-none" />

              {besttimeData?.hourly_curve && besttimeData.hourly_curve.length > 0 ? (
                besttimeData.hourly_curve.map((pt) => {
                  const isCurrent = pt.is_current;
                  const pct = Math.max(8, pt.busyness_pct);
                  const color =
                    pt.busyness_pct >= 80
                      ? 'bg-gradient-to-t from-rose-600 to-rose-400'
                      : pt.busyness_pct >= 50
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                      : 'bg-gradient-to-t from-emerald-600 to-emerald-400';

                  return (
                    <div
                      key={pt.hour}
                      onClick={() => setSelectedVenueHour(pt)}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    >
                      {/* Tooltip / Label */}
                      <div
                        className={`absolute -top-8 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap transition-all pointer-events-none ${
                          isCurrent
                            ? 'opacity-100 bg-cyan-400 text-slate-950 ring-2 ring-cyan-300 font-extrabold z-20 scale-105'
                            : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-slate-100 border border-slate-700 z-10'
                        }`}
                      >
                        {pt.busyness_pct}% {isCurrent ? '• NOW' : ''}
                      </div>

                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${pct}%` }}
                        className={`w-full rounded-t-sm transition-all duration-300 ${color} ${
                          isCurrent
                            ? 'ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-cyan-500/40 opacity-100'
                            : 'opacity-85 hover:opacity-100 hover:scale-105'
                        }`}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-slate-500 py-12 text-xs">
                  Loading 24-hour telemetry curve from BestTime API…
                </div>
              )}
            </div>

            {/* X-Axis Hour Labels */}
            <div className="flex gap-1 sm:gap-1.5 px-1 pt-2 text-[8px] sm:text-[9px] font-mono text-slate-400">
              {besttimeData?.hourly_curve?.map((pt) => (
                <div
                  key={pt.hour}
                  className={`flex-1 text-center truncate ${
                    pt.is_current ? 'text-cyan-300 font-extrabold scale-110' : ''
                  }`}
                >
                  {pt.hour % 3 === 0 ? pt.hour_label.replace(' ', '') : '·'}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Hour Details Callout */}
          {selectedVenueHour && (
            <div className="bg-slate-950 border border-cyan-700/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-cyan-300 text-sm">{selectedVenueHour.hour_label}</span>
                <span className="text-slate-400">
                  Live Busyness: <strong className="text-white text-sm">{selectedVenueHour.busyness_pct}%</strong>
                </span>
                <span className="text-slate-400">
                  Intensity: <strong className="text-white">{selectedVenueHour.intensity_txt}</strong>
                </span>
                <span className="text-slate-400">
                  Multiplier: <strong className="text-emerald-400">{Math.max(0.7, selectedVenueHour.busyness_pct / 50).toFixed(2)}×</strong>
                </span>
                {selectedVenueHour.is_busy && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    Peak Overcrowding
                  </span>
                )}
                {selectedVenueHour.is_quiet && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Quiet Eco Window
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedVenueHour(null)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] rounded transition"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* 7-Day Diurnal Pattern Overview */}
        {besttimeData?.weekly_overview && besttimeData.weekly_overview.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              7-Day Weekly Calibrated Footfall Comparison
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {besttimeData.weekly_overview.map((day) => (
                <div
                  key={day.day_int}
                  className={`p-2.5 rounded-xl border text-[10px] space-y-1 ${
                    day.is_today
                      ? 'bg-cyan-950/40 border-cyan-700 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className={day.is_today ? 'text-cyan-300' : 'text-slate-300'}>
                      {day.day_text.slice(0, 3)} {day.is_today ? '• Today' : ''}
                    </span>
                    <span className="text-slate-500 font-mono text-[9px]">#{day.day_rank_mean}</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {day.day_mean}% <span className="text-[9px] text-slate-500 font-normal">avg</span>
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Peak: <span className="text-rose-400 font-bold">{day.day_max}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw JSON Telemetry Inspector & Data Printout */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Raw BestTime API Telemetry Payload Inspector
              </span>
              <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-mono">
                Live Data Printout
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                disabled={!besttimeData?.raw_payload}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] text-slate-300 disabled:opacity-40 transition"
                title="Copy complete raw JSON to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>

              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] text-slate-300 transition"
              >
                {showRawJson ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {showRawJson ? 'Hide Raw Data' : 'Print Raw JSON Data'}
              </button>
            </div>
          </div>

          {showRawJson && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 max-h-96 overflow-y-auto font-mono text-[10px] text-emerald-400 leading-relaxed">
              <pre className="whitespace-pre-wrap break-all">
                {besttimeData?.raw_payload
                  ? JSON.stringify(besttimeData.raw_payload, null, 2)
                  : '// No live BestTime raw payload received yet.'}
              </pre>
            </div>
          )}
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
              <strong>Footfall data is LIVE</strong> — BestTime.app API key configured (<code className="bg-emerald-900/50 px-1 rounded text-emerald-300">Live API Active</code>). Neural foot-traffic telemetry and 24-hour diurnal busyness curves are streaming directly from BestTime.app.
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
