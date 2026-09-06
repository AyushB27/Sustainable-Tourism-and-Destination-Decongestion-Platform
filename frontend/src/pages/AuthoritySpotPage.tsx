import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertOctagon, 
  CheckCircle2, 
  Activity, 
  Users, 
  Clock, 
  CloudRain, 
  Car, 
  Sliders, 
  Send, 
  Sparkles, 
  RefreshCw,
  Compass,
  Radio
} from 'lucide-react';
import { useSpotData } from '../hooks/useSpotData';
import { useCorridorStore } from '../store/useCorridorStore';

export const AuthoritySpotPage: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();

  const {
    currentUser,
    broadcastAdvisory,
    overrideCapacity,
    liveBackendStatus,
    fetchLiveBackendFeed
  } = useCorridorStore();

  const {
    spot,
    metrics,
    telemetry,
    forecast,
    mlData,
    twins,
    checkIns,
    notFound
  } = useSpotData(spotId);

  // Tactical Controls State
  const [inflowThrottle, setInflowThrottle] = useState<number>(spot ? spot.physicalCapacity : 5000);
  const [throttleSaved, setThrottleSaved] = useState<boolean>(false);
  const [advisoryTitle, setAdvisoryTitle] = useState('');
  const [advisoryMessage, setAdvisoryMessage] = useState('');
  const [advisorySeverity, setAdvisorySeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [advisorySent, setAdvisorySent] = useState(false);
  const [selectedForecastIndex, setSelectedForecastIndex] = useState<number | null>(null);

  if (notFound || !spot || !metrics || !telemetry) {
    return (
      <div className="min-h-[70vh] max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Compass className="w-12 h-12 mx-auto text-slate-400 animate-spin" />
        <h1 className="text-2xl font-black text-slate-900">Destination Not Found in Command Registry</h1>
        <p className="text-sm text-slate-600">
          The requested hub &ldquo;{spotId}&rdquo; is not part of the active Western Ghats & Maharashtra Corridor registry.
        </p>
        <div className="pt-4">
          <Link
            to="/authority"
            className="px-5 py-2.5 bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Incident Command Center</span>
          </Link>
        </div>
      </div>
    );
  }

  const isCritical = metrics.status === 'CRITICAL';
  const isModerate = metrics.status === 'MODERATE';
  const statusBadgeColor = isCritical
    ? 'bg-rose-100 text-rose-900 border-rose-300'
    : isModerate
    ? 'bg-amber-100 text-amber-900 border-amber-300'
    : 'bg-emerald-100 text-emerald-900 border-emerald-300';

  const utilizationPct = Math.round((spot.currentInflow / Math.max(1, spot.physicalCapacity)) * 100);
  const headroom = Math.max(0, spot.physicalCapacity - spot.currentInflow);

  // Breach probability calculation
  const breachProb = mlData?.critical_breach_probability_4h ?? (isCritical ? 0.85 : isModerate ? 0.55 : 0.15);
  const isHighBreachRisk = breachProb >= 0.50;

  const handleApplyThrottle = async () => {
    await overrideCapacity(spot.id, inflowThrottle, `Tactical Inflow Throttle enforced by ${currentUser.name}`);
    setThrottleSaved(true);
    setTimeout(() => setThrottleSaved(false), 3000);
  };

  const handleBroadcastAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryTitle.trim() || !advisoryMessage.trim()) return;

    broadcastAdvisory({
      destinationId: spot.id,
      destinationName: spot.name,
      severity: advisorySeverity,
      title: advisoryTitle.trim(),
      message: advisoryMessage.trim(),
      active: true,
      author: `${currentUser.name} (${currentUser.designation || 'District Control Cell'})`
    });

    setAdvisoryTitle('');
    setAdvisoryMessage('');
    setAdvisorySent(true);
    setTimeout(() => setAdvisorySent(false), 4000);
  };

  const handleApplyPresetAdvisory = (title: string, msg: string, severity: 'high' | 'critical') => {
    setAdvisoryTitle(title);
    setAdvisoryMessage(msg);
    setAdvisorySeverity(severity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Top Navigation & Breadcrumb ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <Link
          to="/authority"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700" />
          <span>Back to Command Center Overview</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
            Official: <strong>{currentUser.name}</strong> ({currentUser.badgeNumber})
          </span>
          <span className="font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300">
            Jurisdiction: {currentUser.jurisdiction?.type ? `${currentUser.jurisdiction.type.toUpperCase()}: ${currentUser.jurisdiction.value}` : 'Statewide Access'}
          </span>
        </div>
      </div>

      {/* ── Official Destination Command Header ── */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-5 sm:p-7 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider bg-slate-900 text-white font-bold px-2 py-0.5 rounded">
              Tactical Operations Desk
            </span>
            <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${statusBadgeColor}`}>
              Status: {metrics.status} ({utilizationPct}% Load)
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Hub Code: <strong>{spot.code}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {spot.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {spot.district} District, {spot.state} • Coordinates: {spot.coordinates[0].toFixed(3)}°N, {spot.coordinates[1].toFixed(3)}°E • Statutory Baseline: {spot.base_capacity_source_citation || 'District Carrying Capacity Norms'}
          </p>
        </div>

        {/* Live Status Pill & Quick Ingest */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLiveBackendFeed}
            disabled={liveBackendStatus === 'syncing'}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${liveBackendStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>{liveBackendStatus === 'syncing' ? 'Refreshing Feeds...' : 'Sync Live Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* ── Tactical Telemetry KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Inflow vs Physical Capacity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Inflow Volume</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{spot.currentInflow.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-mono">/ {spot.physicalCapacity.toLocaleString()} cap</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                utilizationPct >= 85 ? 'bg-rose-500' : utilizationPct >= 65 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, utilizationPct)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-mono flex justify-between">
            <span>Utilization: <strong>{utilizationPct}%</strong></span>
            <span>Headroom: <strong>{headroom.toLocaleString()}</strong></span>
          </p>
        </div>

        {/* KPI 2: DCC Index & Queue Delay */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">DCC Stress Score</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.dccScore.toFixed(2)}</span>
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${statusBadgeColor}`}>
              {metrics.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-600">
            Dwell Time: ~{spot.avgDwellTimeHours}h • Wait Delay: <strong className={metrics.waitTimeMinutes > 20 ? 'text-rose-600' : 'text-slate-900'}>{metrics.waitTimeMinutes} mins</strong>
          </p>
        </div>

        {/* KPI 3: Weather & Hazard Severity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weather & Highway Risk</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {(spot.weatherHazardScore * 100).toFixed(0)}%
            </span>
            <span className="text-xs text-slate-500">Hazard Index</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Rain: <strong>{telemetry.weather.rain_mm.toFixed(1)} mm/hr</strong> • Delay: <strong>{spot.gettingThere?.bottleneckActive ? '+45m Jam' : 'Flowing'}</strong>
          </p>
        </div>

        {/* KPI 4: Local Amenity Saturation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Local Infrastructure</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {spot.localPressure.parkingSaturationPct}%
            </span>
            <span className="text-xs text-slate-500">Parking Full</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Hotel Occupancy: <strong>{spot.hotelOccupancyPct}%</strong> • Water Stress: <strong>{spot.localPressure.waterStressIndex.toFixed(2)}</strong>
          </p>
        </div>
      </div>

      {/* ── AI PREDICTIVE EARLY-WARNING & 12-HOUR FORECAST PANEL ── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gov-navy" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Predictive Crowd Intelligence & Carrying Capacity Projection
              </h2>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                {mlData?.is_ml_active ? 'XGBoost AI Model (Live)' : 'Calibrated Diurnal Heuristic'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              12-Hour continuous machine learning forecast with 95% Confidence Interval bounds and 4-hour critical capacity breach probability.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span>Model: <strong>{mlData?.model_engine || 'XGBoost Forecaster'}</strong></span>
          </div>
        </div>

        {/* Early-Warning Breach Banner */}
        {isHighBreachRisk ? (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  Critical Warning Alert
                </span>
                <span className="text-xs font-bold text-rose-900">
                  {Math.round(breachProb * 100)}% Probability of Carrying Capacity Breach within 4 Hours
                </span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                The ML model projects traffic inflow to reach <strong>{mlData?.peak_forecast_visitors?.toLocaleString() || Math.round(spot.physicalCapacity * 1.15).toLocaleString()} visitors</strong> near <strong>{mlData?.peak_forecast_hour || '15:00'}</strong>, exceeding physical capacity ({spot.physicalCapacity.toLocaleString()}).
              </p>
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setInflowThrottle(Math.round(spot.physicalCapacity * 0.80))}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-2xs transition"
                >
                  Set Inflow Throttle to 80% ({Math.round(spot.physicalCapacity * 0.80).toLocaleString()})
                </button>
                <button
                  onClick={() => handleApplyPresetAdvisory(
                    `CAPACITY ADVISORY: ${spot.name} Approaching Maximum Load`,
                    `District administration reports heavy congestion near ${spot.name}. Inbound visitors are strongly urged to divert to accredited alternative twin destinations.`,
                    'critical'
                  )}
                  className="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 font-bold text-xs rounded-lg shadow-2xs transition"
                >
                  Draft Gazette Advisory
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-900 font-medium">
              <strong>Low Breach Risk:</strong> Model estimates only a <strong>{Math.round(breachProb * 100)}% probability</strong> of threshold saturation over the next 4 hours. No emergency restrictions required at this time.
            </p>
          </div>
        )}

        {/* 12-Hour Forecast Point-and-Stem Visual Graph */}
        <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 text-white space-y-4">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">12-Hour Numerical Inflow Projection</span>
              <span className="text-[10px] text-slate-400 font-mono">
                (Statutory Limit: <strong className="text-amber-300">{spot.physicalCapacity.toLocaleString()}</strong>)
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> &lt;65% Cap
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 65-84% Cap
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> &ge;85% Cap
              </span>
            </div>
          </div>

          {/* Graph Canvas */}
          <div className="h-44 sm:h-52 flex items-end gap-2 sm:gap-4 px-2 relative pt-6 pb-2 border-b border-slate-800">
            {/* 100% Capacity Reference Line */}
            {(() => {
              const maxPoint = Math.max(...forecast.map(f => f.upper_ci_95 || f.inflow), spot.physicalCapacity * 1.25);
              const capPct = Math.min(95, Math.round((spot.physicalCapacity / maxPoint) * 100));
              return (
                <div
                  style={{ bottom: `${capPct}%` }}
                  className="absolute left-0 right-0 border-b border-dashed border-rose-400/50 z-0 pointer-events-none flex items-center justify-end pr-2"
                >
                  <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 shadow-sm">
                    100% Physical Capacity Limit ({spot.physicalCapacity.toLocaleString()})
                  </span>
                </div>
              );
            })()}

            {forecast.map((pt, idx) => {
              const maxPoint = Math.max(...forecast.map(f => f.upper_ci_95 || f.inflow), spot.physicalCapacity * 1.25);
              const barHeightPct = Math.max(16, Math.min(100, Math.round((pt.inflow / maxPoint) * 100)));
              const pointLoad = pt.inflow / spot.physicalCapacity;
              const isPointCritical = pointLoad >= 0.85;
              const isPointModerate = pointLoad >= 0.65 && pointLoad < 0.85;

              const isSelected = selectedForecastIndex === idx;

              const barColor = isPointCritical
                ? 'from-rose-600 to-rose-400'
                : isPointModerate
                ? 'from-amber-600 to-amber-400'
                : 'from-emerald-600 to-emerald-400';

              const dotColor = isPointCritical
                ? 'bg-rose-400 ring-rose-300'
                : isPointModerate
                ? 'bg-amber-400 ring-amber-300'
                : 'bg-emerald-400 ring-emerald-300';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedForecastIndex(isSelected ? null : idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer z-10"
                >
                  {/* Tooltip on Hover / Selected */}
                  <div className={`absolute -top-7 text-center whitespace-nowrap transition-transform duration-150 ${isSelected ? 'scale-110' : ''}`}>
                    <span className={`text-[10px] font-black font-mono px-1 py-0.5 rounded ${
                      isPointCritical ? 'text-rose-300' : isPointModerate ? 'text-amber-300' : 'text-emerald-300'
                    }`}>
                      {pt.inflow >= 1000 ? `${(pt.inflow / 1000).toFixed(1)}k` : pt.inflow}
                    </span>
                  </div>

                  {/* Stem / Bar */}
                  <div
                    style={{ height: `${barHeightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg bg-gradient-to-t ${barColor} transition-all duration-200 flex flex-col items-center justify-start pt-1 ${
                      isSelected ? 'ring-2 ring-white' : 'opacity-90 group-hover:opacity-100'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${dotColor} ring-2`} />
                  </div>

                  {/* Hour Label */}
                  <div className="mt-2 text-[10px] font-mono text-slate-400 truncate text-center w-full">
                    {pt.timeLabel.replace(':00', '')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Hour Details Inspector */}
          {selectedForecastIndex !== null && forecast[selectedForecastIndex] && (() => {
            const pt = forecast[selectedForecastIndex];
            const loadPct = Math.round((pt.inflow / spot.physicalCapacity) * 100);
            return (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-white text-sm">Forecast Inspection: {pt.timeLabel}</strong>
                  <p className="text-slate-400 mt-0.5">
                    Predicted Inflow: <strong className="text-white">{pt.inflow.toLocaleString()}</strong> ({loadPct}% capacity load)
                    {pt.lower_ci_95 && pt.upper_ci_95 && (
                      <span className="text-slate-300 ml-2">
                        • 95% CI Range: [{pt.lower_ci_95.toLocaleString()} - {pt.upper_ci_95.toLocaleString()}]
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedForecastIndex(null)}
                  className="text-slate-400 hover:text-white text-[11px] underline self-start sm:self-auto"
                >
                  Close Details
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── TACTICAL INTERVENTION CONTROLS GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Inflow Throttle & Capacity Adjustment */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-gov-navy" />
            <div>
              <h3 className="text-base font-black text-slate-900">Corridor Access & Toll Gate Inflow Throttle</h3>
              <p className="text-xs text-slate-500">Temporarily restrict permissible vehicular rate at expressway toll gates</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-bold">Active Permissible Inflow Limit:</span>
              <span className="font-mono text-base font-black text-slate-900">
                {inflowThrottle.toLocaleString()} visitors
              </span>
            </div>

            <input
              type="range"
              min={Math.round(spot.physicalCapacity * 0.3)}
              max={Math.round(spot.physicalCapacity * 1.5)}
              step={100}
              value={inflowThrottle}
              onChange={(e) => setInflowThrottle(Number(e.target.value))}
              className="w-full accent-gov-navy cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Severe Restriction ({Math.round(spot.physicalCapacity * 0.3).toLocaleString()})</span>
              <span>Baseline ({spot.physicalCapacity.toLocaleString()})</span>
              <span>Max Unrestricted ({Math.round(spot.physicalCapacity * 1.5).toLocaleString()})</span>
            </div>

            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
              <span className="text-sm shrink-0">🛡️</span>
              <p className="leading-tight">
                <strong>Statutory Exemption Rule:</strong> Throttle applies strictly to transient day-trippers. Vehicles with confirmed hotel/homestay vouchers or resident FASTags maintain uninterrupted corridor access.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleApplyThrottle}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Enforce Inflow Limit</span>
              </button>

              {throttleSaved && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 animate-fadeIn">
                  Throttle Enforced on Highway Signboards!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Module 2: Emergency Gazette Advisory Dispatcher */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Radio className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">1-Click Emergency Advisory Dispatcher</h3>
              <p className="text-xs text-slate-500">Broadcast official alerts to travelers with active Green Passes heading to {spot.name}</p>
            </div>
          </div>

          <form onSubmit={handleBroadcastAdvisory} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Advisory Title</label>
              <input
                type="text"
                value={advisoryTitle}
                onChange={(e) => setAdvisoryTitle(e.target.value)}
                placeholder="e.g. FLASH MONSOON WARNING: Bhushi Dam Ghat Closed"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Official Instructions / Broadcast Message</label>
              <textarea
                value={advisoryMessage}
                onChange={(e) => setAdvisoryMessage(e.target.value)}
                rows={2}
                placeholder="Specify diversion route or precautionary advice for travelers..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <label className="font-bold text-slate-600">Severity:</label>
                <select
                  value={advisorySeverity}
                  onChange={(e) => setAdvisorySeverity(e.target.value as any)}
                  className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="critical">Critical (Red Banner)</option>
                  <option value="high">High (Orange Banner)</option>
                  <option value="medium">Medium (Yellow Banner)</option>
                  <option value="low">Info (Blue Banner)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>

            {advisorySent && (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-300 animate-fadeIn">
                Official Advisory dispatched to Citizen Portal and Highway Digital Displays!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* ── RECOMMENDED TWIN DEFLECTION DESTINATIONS ── */}
      {twins.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <span>Accredited Twin Deflection Destinations</span>
              </h3>
              <p className="text-xs text-slate-500">Under-visited scenic hubs ready to absorb diverted traffic from {spot.name}</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded">
              4D Vector Cosine Matching
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {twins.slice(0, 2).map((tw) => {
              const twHeadroom = Math.max(0, tw.destination.physicalCapacity - tw.destination.currentInflow);
              const twLoad = Math.round((tw.destination.currentInflow / tw.destination.physicalCapacity) * 100);

              return (
                <div
                  key={tw.destination.id}
                  className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 text-sm">{tw.destination.name}</strong>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                        {Math.round(tw.similarityScore * 100)}% Profile Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{tw.destination.district} District • {tw.travelTimeDeltaText}</p>
                    <div className="pt-2 flex items-center gap-3 text-xs font-mono text-slate-700">
                      <span>Available Headroom: <strong className="text-emerald-700">{twHeadroom.toLocaleString()}</strong></span>
                      <span>Load: <strong>{twLoad}%</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60">
                    <span className="text-[11px] text-slate-500">
                      Twin DCC: <strong>{tw.candidateDccScore.toFixed(2)}</strong> (Optimal)
                    </span>
                    <button
                      onClick={() => handleApplyPresetAdvisory(
                        `RECOMMENDED ROUTE DIVERSION: Divert to ${tw.destination.name}`,
                        `Due to peak crowds at ${spot.name}, district administration advises transient tourists to proceed to ${tw.destination.name} with ample parking and zero wait times. (Confirmed hotel bookings and local residents retain guaranteed access).`,
                        'high'
                      )}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-2xs transition"
                    >
                      Trigger Traffic Diversion
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RECENT CITIZEN CROWD REPORTS FOR THIS SPOT ── */}
      {checkIns.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <span>Recent Geofenced Field Reports ({checkIns.length} Verified Check-ins)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checkIns.slice(0, 4).map((chk) => (
              <div key={chk.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{chk.user_label}</span>
                  <span className="text-[10px] text-slate-500">{chk.timestamp}</span>
                </div>
                <p className="text-slate-600 italic">&ldquo;{chk.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthoritySpotPage;
