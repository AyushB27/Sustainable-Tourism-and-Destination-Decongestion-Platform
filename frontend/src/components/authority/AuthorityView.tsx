import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  WifiOff,
  AlertTriangle,
  ArrowRight,
  Filter,
  Clock
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateCorridorMetrics, calculateDCCMetrics } from '../../lib/engine';
import { CorridorKpiBar } from './CorridorKpiBar';
import { CorridorMap } from './CorridorMap';
import { DemandDiffusionFlow } from './DemandDiffusionFlow';
import { AdvisoryManager } from './AdvisoryManager';
import { PolicySimulator } from './PolicySimulator';
import { ImpactReview } from './ImpactReview';
import { Link, useLocation } from 'react-router-dom';
import { sessionManager, DEMO_ACCOUNTS } from '../../lib/sessionManager';

export type CorridorFilterId = 'ALL' | 'EXPRESSWAY' | 'COASTAL' | 'HIGHLAND' | 'ECO_RESERVE';

export interface CorridorDefinition {
  id: CorridorFilterId;
  name: string;
  shortName: string;
  district: string;
  spotIds: string[];
  description: string;
}

export const CORRIDOR_DEFINITIONS: CorridorDefinition[] = [
  {
    id: 'ALL',
    name: 'All Monitored Corridors (Statewide Aggregate)',
    shortName: 'All Corridors',
    district: 'Statewide',
    spotIds: ['LON', 'MAT', 'BHA', 'ALB', 'KAS', 'MAH', 'TAP'],
    description: 'Aggregated view covering all 7 monitored tourist hubs across Pune, Raigad, Satara, and Ahmednagar districts.'
  },
  {
    id: 'EXPRESSWAY',
    name: 'Mumbai–Pune Expressway Corridor',
    shortName: 'Expressway Corridor',
    district: 'Pune / Raigad',
    spotIds: ['LON', 'MAT'],
    description: 'NH-48 transit artery encompassing Lonavala, Khandala & Matheran eco-zone.'
  },
  {
    id: 'COASTAL',
    name: 'Raigad Coastal & Maritime Corridor',
    shortName: 'Coastal Corridor',
    district: 'Raigad',
    spotIds: ['ALB', 'KAS'],
    description: 'Arabian Sea coastal route covering Mandwa Ro-Ro, Alibaug, and Kashid / Murud Janjira.'
  },
  {
    id: 'HIGHLAND',
    name: 'Western Ghats & Satara Heritage Corridor',
    shortName: 'Satara Highland',
    district: 'Satara',
    spotIds: ['MAH', 'TAP'],
    description: 'High-altitude Sahyadri plateau covering Mahabaleshwar strawberry valley & Tapola Koyna fjord backwaters.'
  },
  {
    id: 'ECO_RESERVE',
    name: 'Nashik–Bhandardara Highland Eco-Corridor',
    shortName: 'Bhandardara Reserve',
    district: 'Ahmednagar',
    spotIds: ['BHA'],
    description: 'Arthur Lake & Kalsubai Peak pristine catchment eco-reserve.'
  }
];

export const AuthorityView: React.FC = () => {
  const location = useLocation();

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

  // Derive activeTab from current route path
  const activeTab: 'command' | 'advisories' | 'simulator' | 'impact' = useMemo(() => {
    if (location.pathname.startsWith('/authority/advisories')) return 'advisories';
    if (location.pathname.startsWith('/authority/policy-simulator')) return 'simulator';
    if (location.pathname.startsWith('/authority/impact')) return 'impact';
    return 'command';
  }, [location.pathname]);

  const [selectedCorridor, setSelectedCorridor] = useState<CorridorFilterId>('ALL');
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

  // Active Corridor Definition and Filtered Spots
  const activeCorridorDef = useMemo(() => {
    return CORRIDOR_DEFINITIONS.find(c => c.id === selectedCorridor) || CORRIDOR_DEFINITIONS[0];
  }, [selectedCorridor]);

  const corridorFilteredSpots = useMemo(() => {
    if (selectedCorridor === 'ALL') return jurisdictionSpots;
    const filtered = jurisdictionSpots.filter(d => activeCorridorDef.spotIds.includes(d.id));
    return filtered.length > 0 ? filtered : jurisdictionSpots;
  }, [jurisdictionSpots, selectedCorridor, activeCorridorDef]);

  // Ranked Triage List (Urgency Sorted: CRITICAL -> MODERATE -> OPTIMAL)
  const rankedTriageSpots = useMemo(() => {
    const multiplier = forecastWindow === 'weekend' ? 1.35 : forecastWindow === 'holiday' ? 1.60 : 1.0;

    return corridorFilteredSpots.map(d => {
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
  }, [corridorFilteredSpots, forecastWindow]);

  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const corridorMetrics = calculateCorridorMetrics(corridorFilteredSpots, activeAdvisoriesCount);

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

      {/* ── TAB 1: COMMAND OVERVIEW & TRIAGE ── */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          {/* Corridor KPI Statistics Bar */}
          <CorridorKpiBar
            metrics={corridorMetrics}
            corridorName={selectedCorridor === 'ALL' ? undefined : activeCorridorDef.shortName}
          />

          {/* Operations Control Toolbar: Corridor-Wise Filter & Temporal Triage Window */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Corridor Filter Controls */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gov-navy" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Corridor Sector Filter:
                  </span>
                  <span className="text-xs font-bold text-gov-navy bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {activeCorridorDef.shortName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {activeCorridorDef.description}
                </p>

                {/* Corridor Filter Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {CORRIDOR_DEFINITIONS.map(corridor => {
                    const isSelected = selectedCorridor === corridor.id;
                    return (
                      <button
                        key={corridor.id}
                        type="button"
                        onClick={() => setSelectedCorridor(corridor.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-gov-navy text-white border-gov-navy shadow-sm ring-2 ring-gov-navy/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span>{corridor.shortName}</span>
                        {corridor.id !== 'ALL' && (
                          <span className={`ml-1.5 text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-white/20 text-amber-300' : 'bg-slate-200 text-slate-600'}`}>
                            {corridor.spotIds.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Temporal Triage Window Selector */}
              <div className="space-y-1.5 lg:border-l lg:border-slate-200 lg:pl-6 shrink-0">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gov-navy" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Temporal Triage Window:
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Forecast multiplier for predictive capacity interventions
                </p>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => setForecastWindow('current')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      forecastWindow === 'current'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${forecastWindow === 'current' ? 'bg-white' : 'bg-emerald-500'}`} />
                    <span>Live Telemetry (Now)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForecastWindow('weekend')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      forecastWindow === 'weekend'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${forecastWindow === 'weekend' ? 'bg-white' : 'bg-amber-500'}`} />
                    <span>Weekend Peak (+35%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForecastWindow('holiday')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      forecastWindow === 'holiday'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${forecastWindow === 'holiday' ? 'bg-white' : 'bg-rose-500'}`} />
                    <span>Holiday Surge (+60%)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* GIS Leaflet Map & Needs-Attention Triage List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive GIS Map */}
            <div className="lg:col-span-7">
              <CorridorMap
                destinations={corridorFilteredSpots}
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
                    <span>Priority Triage Queue</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {corridorFilteredSpots.length} Zones in Scope
                    </span>
                    {selectedCorridor !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setSelectedCorridor('ALL')}
                        className="text-[10px] font-bold text-gov-navy underline hover:text-gov-navy-light"
                      >
                        Reset
                      </button>
                    )}
                  </div>
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

                        {/* Dedicated Authority Operations Command Drilldown */}
                        <Link
                          to={`/authority/spot/${spot.id}`}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg border border-slate-300 transition shadow-2xs flex items-center gap-1 shrink-0"
                          title={`Launch ${spot.name} District Operations Command Desk`}
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                <span>💡 Click <strong>Manage</strong> on any corridor hub to access dedicated toll gate throttles, AI forecast breach curves, and 1-click gazette advisories.</span>
              </div>
            </div>
          </div>

          {/* Regional Demand Diffusion Matrix (Origin-Destination Movement Patterns) */}
          <DemandDiffusionFlow destinations={corridorFilteredSpots} />
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
