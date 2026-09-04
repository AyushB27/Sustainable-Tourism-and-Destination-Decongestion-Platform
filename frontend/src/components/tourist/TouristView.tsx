import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, WifiOff, AlertTriangle, X } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateDCCMetrics, getTwinRecommendations } from '../../lib/engine';
import { HeroDCCStatus } from './HeroDCCStatus';
import { TwinAlternativeCards } from './TwinAlternativeCards';
import { DemandCurveChart } from './DemandCurveChart';
import { FutureTripPlanner } from './FutureTripPlanner';
import { EcoPassCard } from './EcoPassCard';
import type { DestinationCategory } from '../../types';

export const TouristView: React.FC = () => {
  const {
    destinations,
    selectedDestinationId,
    setSelectedDestinationId,
    categoryFilter,
    setCategoryFilter,
    userPreferences,
    liveBackendStatus,
    promotions,
    advisories,
    dismissAdvisory,
  } = useCorridorStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Active advisories relevant to the selected destination or corridor-wide
  const relevantAdvisories = advisories.filter(
    a => a.active && (a.destinationId === 'ALL' || a.destinationId === selectedDestinationId)
  );

  // Derive the currently selected destination from live store
  const selectedDestination = destinations.find(d => d.id === selectedDestinationId) ?? destinations[0];

  // Compute live DCC metrics client-side from Zustand data (which is fed by /api/destinations/live)
  const metrics = selectedDestination ? calculateDCCMetrics(selectedDestination) : null;

  // Compute twin recommendations from live store data
  const twins = selectedDestination && metrics
    ? getTwinRecommendations(selectedDestination, destinations, userPreferences, promotions)
    : [];

  // Filtered destination list for the category pills
  const filteredDestinations = destinations.filter(d => {
    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Update selected if current selection filtered out
  useEffect(() => {
    if (filteredDestinations.length > 0 && !filteredDestinations.find(d => d.id === selectedDestinationId)) {
      setSelectedDestinationId(filteredDestinations[0].id);
    }
  }, [filteredDestinations, selectedDestinationId, setSelectedDestinationId]);

  if (!selectedDestination || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading live destination data…</div>
      </div>
    );
  }

  const categories: Array<'ALL' | DestinationCategory> = ['ALL', 'Hill Station', 'Coastal', 'Heritage', 'Pilgrimage'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Offline Banner ── */}
        {liveBackendStatus === 'offline' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-4 py-2.5 rounded-xl text-amber-900 text-xs font-semibold"
          >
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            📡 Offline Mode — Using last cached metrics. Start the Python backend to receive live sensor data.
          </motion.div>
        )}

        {/* ── Active Gazette Emergency Advisories ── */}
        <AnimatePresence>
          {relevantAdvisories.map((adv) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-xs shadow-sm ${
                adv.severity === 'critical' || adv.severity === 'high'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                  adv.severity === 'critical' || adv.severity === 'high' ? 'text-rose-600' : 'text-amber-600'
                }`} />
                <div>
                  <div className="font-bold flex items-center gap-2 flex-wrap">
                    <span>{adv.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-white/70 border border-current">
                      {adv.destinationName} • {adv.severity}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] opacity-90">{adv.message}</p>
                </div>
              </div>
              <button
                onClick={() => dismissAdvisory(adv.id)}
                className="p-1 hover:bg-black/5 rounded-lg text-slate-500 hover:text-slate-900 shrink-0"
                title="Dismiss advisory"
                aria-label="Dismiss advisory"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wide uppercase mb-1">
              <span className={`w-2 h-2 rounded-full inline-block ${liveBackendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              {liveBackendStatus === 'connected' ? 'Live Western Ghats Corridor Telemetry' : 'Cached Western Ghats Corridor Data'}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Where would you like to travel?
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time crowd monitoring and queue-free scenic alternatives across Maharashtra
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search destination…"
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm text-slate-700 focus:outline-none"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Category Pills ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl shadow-sm shrink-0 transition ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Destinations' : cat}
            </button>
          ))}
        </div>

        {/* ── Destination Selector Chips ── */}
        {filteredDestinations.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {filteredDestinations.map(dest => {
              const m = calculateDCCMetrics(dest);
              const dot = m.status === 'CRITICAL' ? 'bg-rose-500' : m.status === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500';
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setSelectedDestinationId(dest.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0 border transition ${
                    dest.id === selectedDestinationId
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  {dest.name}
                </button>
              );
            })}
          </div>
        )}

        {/* ── SECTION 1: Live Hero DCC Status ── */}
        <motion.div
          key={selectedDestinationId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <HeroDCCStatus destination={selectedDestination} metrics={metrics} />
        </motion.div>

        {/* ── SECTION 2: Twin Alternative Recommendations ── */}
        {twins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
          >
            <TwinAlternativeCards
              targetDestination={selectedDestination}
              targetMetrics={metrics}
              recommendations={twins.slice(0, 2)}
            />
          </motion.div>
        )}

        {/* ── SECTION 3: 12-Hour Demand Curve ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.14 }}
        >
          <DemandCurveChart destination={selectedDestination} />
        </motion.div>

        {/* ── SECTION 4: Green Yatra Pass ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.18 }}
        >
          <EcoPassCard destination={selectedDestination} />
        </motion.div>

        {/* ── SECTION 5: Future Trip Planner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.22 }}
        >
          <FutureTripPlanner destinations={destinations} />
        </motion.div>

      </div>
    </div>
  );
};
