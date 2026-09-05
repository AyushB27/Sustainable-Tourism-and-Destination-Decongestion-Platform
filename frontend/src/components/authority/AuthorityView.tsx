import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  WifiOff,
  AlertTriangle,
  Sliders,
  Award,
  Layers,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateCorridorMetrics, calculateDCCMetrics } from '../../lib/engine';
import { CorridorKpiBar } from './CorridorKpiBar';
import { CorridorMap } from './CorridorMap';
import { DemandDiffusionFlow } from './DemandDiffusionFlow';
import { AdvisoryManager } from './AdvisoryManager';
import { PolicySimulator } from './PolicySimulator';
import { ImpactReview } from './ImpactReview';
import { Link } from 'react-router-dom';
import { sessionManager, DEMO_ACCOUNTS } from '../../lib/sessionManager';

export const AuthorityView: React.FC = () => {
  const {
    destinations,
    selectedDestinationId,
    setSelectedDestinationId,
    advisories,
    currentUser,
    loginUser,
    liveBackendStatus,
    fetchLiveBackendFeed
  } = useCorridorStore();

  const [activeTab, setActiveTab] = useState<'command' | 'advisories' | 'simulator' | 'impact'>('command');
  const [forecastWindow, setForecastWindow] = useState<'current' | 'weekend' | 'holiday'>('current');

  // Auto-sync authority session if needed
  React.useEffect(() => {
    if (currentUser.role !== 'authority') {
      const authSession = sessionManager.getSession('authority');
      if (authSession && authSession.user) {
        loginUser(authSession.user);
      } else {
        const demoAuth = DEMO_ACCOUNTS.find(d => d.role === 'authority');
        if (demoAuth) loginUser(demoAuth.user);
      }
    }
  }, [currentUser.role, loginUser]);

  // RBAC Jurisdiction Check
  const isAuthority = currentUser.role === 'authority';
  const jur = currentUser.jurisdiction;

  // Filter spots in official's jurisdiction (or all if state-level or none assigned)
  const jurisdictionSpots = useMemo(() => {
    if (!jur || jur.type === 'state') return destinations;
    if (jur.type === 'district') {
      const jurVal = String(jur.value).toLowerCase();
      const filtered = destinations.filter(d => {
        const dist = d.district.toLowerCase();
        return jurVal.includes(dist) || dist.includes(jurVal);
      });
      return filtered.length > 0 ? filtered : destinations;
    }
    if (jur.type === 'spot_list' && Array.isArray(jur.value)) {
      const filtered = destinations.filter(d => jur.value.includes(d.id));
      return filtered.length > 0 ? filtered : destinations;
    }
    return destinations;
  }, [destinations, jur]);

  // Ranked Triage List (Urgency Sorted: CRITICAL -> MODERATE -> OPTIMAL)
  const rankedTriageSpots = useMemo(() => {
    // Multiplier based on forecast window
    const multiplier = forecastWindow === 'weekend' ? 1.35 : forecastWindow === 'holiday' ? 1.60 : 1.0;

    return jurisdictionSpots.map(d => {
      const simulatedInflow = Math.round(d.currentInflow * multiplier);
      const simulatedHazard = forecastWindow === 'holiday' ? Math.min(1.0, d.weatherHazardScore * 1.2) : d.weatherHazardScore;
      const metrics = calculateDCCMetrics({
        ...d,
        currentInflow: simulatedInflow,
        weatherHazardScore: simulatedHazard
      });

      return {
        spot: d,
        metrics,
        simulatedInflow
      };
    }).sort((a, b) => b.metrics.dccScore - a.metrics.dccScore);
  }, [jurisdictionSpots, forecastWindow]);

  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const corridorMetrics = calculateCorridorMetrics(jurisdictionSpots, activeAdvisoriesCount);

  // If user is not authenticated as authority, show official login barrier
  if (!isAuthority) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Operations Desk Protected</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Corridor incident triage and capacity controls require an active operations session.
        </p>
        <button
          onClick={() => {
            const demo = DEMO_ACCOUNTS.find(d => d.role === 'authority');
            if (demo) loginUser(demo.user);
          }}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl shadow-md transition"
        >
          Activate Operations Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Official Header & Jurisdiction Banner ── */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gov-navy text-amber-300 flex items-center justify-center font-bold text-2xl border-2 border-gov-gold shrink-0 shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Official Command HQ
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {currentUser.name} ({currentUser.badgeNumber})
              </span>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                Jurisdiction: {jur?.type ? `${jur.type.toUpperCase()}: ${jur.value}` : 'Statewide'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              District GIS Carrying Capacity & Incident Command Center
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Live multi-source sensor monitoring, automated triage, and server-enforced emergency gazette dispatchers
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <button
            onClick={fetchLiveBackendFeed}
            disabled={liveBackendStatus === 'syncing'}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs border ${
              liveBackendStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-400 hover:bg-emerald-100'
                : liveBackendStatus === 'offline'
                ? 'bg-amber-50 text-amber-900 border-amber-400 hover:bg-amber-100'
                : 'bg-gov-navy text-white border-gov-navy hover:bg-slate-800'
            }`}
          >
            {liveBackendStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
            ) : liveBackendStatus === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : liveBackendStatus === 'offline' ? (
              <WifiOff className="w-4 h-4 text-amber-600" />
            ) : (
              <RefreshCw className="w-4 h-4 text-amber-300" />
            )}
            <span>
              {liveBackendStatus === 'syncing'
                ? 'Ingesting Sensor Feeds...'
                : liveBackendStatus === 'connected'
                ? 'Sensors Active (Live)'
                : liveBackendStatus === 'offline'
                ? 'Backend Offline'
                : 'Sync Telemetry'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setActiveTab('command')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'command'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Command Overview & Triage</span>
        </button>

        <button
          onClick={() => setActiveTab('advisories')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'advisories'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Advisory Management ({advisories.filter(a => a.active).length} Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Policy Simulator (DCC Math Sandbox)</span>
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'impact'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Impact Review & Promotion Planning</span>
        </button>
      </div>

      {/* ── TAB 1: COMMAND OVERVIEW & TRIAGE ── */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          {/* Corridor KPI Statistics Bar */}
          <CorridorKpiBar metrics={corridorMetrics} />

          {/* Forecast Window Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Calendar className="w-4 h-4 text-gov-navy" />
              <span className="font-bold">Temporal Triage Window:</span>
              <span className="text-slate-500 hidden sm:inline">
                Reuses 12-hour diurnal forecast model to predict upcoming surges
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setForecastWindow('current')}
                className={`px-3 py-1 rounded-lg transition ${forecastWindow === 'current' ? 'bg-white text-slate-900 shadow-xs' : ''}`}
              >
                Live Now
              </button>
              <button
                onClick={() => setForecastWindow('weekend')}
                className={`px-3 py-1 rounded-lg transition ${forecastWindow === 'weekend' ? 'bg-white text-gov-navy shadow-xs' : ''}`}
              >
                Saturday Peak (+35%)
              </button>
              <button
                onClick={() => setForecastWindow('holiday')}
                className={`px-3 py-1 rounded-lg transition ${forecastWindow === 'holiday' ? 'bg-white text-rose-700 shadow-xs' : ''}`}
              >
                Next Holiday Surge (+60%)
              </button>
            </div>
          </div>

          {/* GIS Leaflet Map & Needs-Attention Triage List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive GIS Map */}
            <div className="lg:col-span-7">
              <CorridorMap
                destinations={jurisdictionSpots}
                selectedId={selectedDestinationId}
                onSelectDestination={setSelectedDestinationId}
              />
            </div>

            {/* Ranked "Needs Attention" Triage List */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Ranked Priority Triage List</span>
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {jurisdictionSpots.length} Hubs Monitored
                  </span>
                </div>

                <div className="space-y-2.5 mt-3">
                  {rankedTriageSpots.map(({ spot, metrics, simulatedInflow }) => {
                    const statusColor = metrics.status === 'CRITICAL'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : metrics.status === 'MODERATE'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950';

                    return (
                      <div
                        key={spot.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 text-xs ${statusColor}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 text-sm">{spot.name}</strong>
                            <span className="text-[10px] font-mono uppercase bg-white/80 px-1.5 py-0.2 rounded border border-current font-bold">
                              {metrics.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] opacity-90 font-mono">
                            <span>Inflow: {simulatedInflow} / {spot.physicalCapacity}</span>
                            <span>DCC: {metrics.dccScore.toFixed(2)}</span>
                            {metrics.waitTimeMinutes > 0 && (
                              <span className="font-bold text-rose-700">Wait: ~{metrics.waitTimeMinutes}m</span>
                            )}
                          </div>
                        </div>

                        {/* Canonical Spot Page Drilldown (Per Non-Negotiable Directives) */}
                        <Link
                          to={`/spot/${spot.id}`}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg border border-slate-300 transition shadow-2xs flex items-center gap-1 shrink-0"
                          title={`Drill into ${spot.name} canonical spot page`}
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                💡 Clicking <strong>Manage</strong> navigates to the canonical <code>/spot/:spotId</code> page where the Authority Capacity Control & Incident Dispatcher panel is composed at the bottom.
              </div>
            </div>
          </div>

          {/* Regional Demand Diffusion Matrix (Origin-Destination Movement Patterns) */}
          <DemandDiffusionFlow destinations={jurisdictionSpots} />
        </div>
      )}

      {/* ── TAB 2: ADVISORY MANAGEMENT ── */}
      {activeTab === 'advisories' && <AdvisoryManager />}

      {/* ── TAB 3: POLICY SIMULATOR ── */}
      {activeTab === 'simulator' && <PolicySimulator />}

      {/* ── TAB 4: IMPACT REVIEW ── */}
      {activeTab === 'impact' && <ImpactReview />}
    </div>
  );
};
