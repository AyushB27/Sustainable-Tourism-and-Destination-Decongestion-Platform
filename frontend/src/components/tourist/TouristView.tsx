import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  X, 
  Camera, 
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateDCCMetrics, getTwinRecommendations } from '../../lib/engine';
import { HeroDCCStatus } from './HeroDCCStatus';
import { DemandCurveChart } from './DemandCurveChart';
import { TwinAlternativeCards } from './TwinAlternativeCards';
import { TouristFilters } from './TouristFilters';
import { EcoPassCard } from './EcoPassCard';
import { FutureTripPlanner } from './FutureTripPlanner';

export const TouristView: React.FC = () => {
  const {
    destinations,
    selectedDestinationId,
    setSelectedDestinationId,
    userPreferences,
    promotions,
    lastRerouteNotice,
    clearRerouteNotice
  } = useCorridorStore();

  const selectedDestination = destinations.find(d => d.id === selectedDestinationId) || destinations[0];
  const selectedMetrics = calculateDCCMetrics(selectedDestination);

  // Twin Destination recommendations
  const recommendations = getTwinRecommendations(
    selectedDestination,
    destinations,
    userPreferences,
    promotions
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Toast Notification on Successful Destination Change */}
      <AnimatePresence>
        {lastRerouteNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-gov-green text-white p-4 rounded-2xl shadow-lg border-2 border-emerald-400 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-gov-green p-2 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">Destination Switched Successfully</p>
                <p className="text-xs text-emerald-100">{lastRerouteNotice}</p>
              </div>
            </div>
            <button
              onClick={clearRerouteNotice}
              aria-label="Close notification"
              className="text-white hover:text-amber-300 p-1 rounded hover:bg-emerald-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcoming Citizen Travel Banner */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gov-navy text-amber-300 rounded-2xl shrink-0 shadow-inner">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-gov-navy leading-tight">
              Tourist Advisory & Real-Time Travel Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Check live destination crowds, bypass highway traffic bottlenecks, and explore certified scenic twin spots
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-gov-green" />
          <span>Official MTDC Verified</span>
        </div>
      </div>

      {/* Step 1: Destination Selector & Filters */}
      <TouristFilters
        destinations={destinations}
        selectedId={selectedDestinationId}
        onSelectDestination={setSelectedDestinationId}
      />

      {/* Step 2: Live Crowd, Road Traffic & Safety Meter */}
      <HeroDCCStatus
        destination={selectedDestination}
        metrics={selectedMetrics}
      />

      {/* Step 3: Recommended Less Crowded Alternatives */}
      <TwinAlternativeCards
        targetDestination={selectedDestination}
        targetMetrics={selectedMetrics}
        recommendations={recommendations}
      />

      {/* Step 4: Best Times to Visit Today (Hourly Forecast) */}
      <DemandCurveChart destination={selectedDestination} />

      {/* Step 5: Multi-Day Trip & Itinerary Planner */}
      <FutureTripPlanner destinations={destinations} />

      {/* Step 6: Destination Profile & Digital Green Pass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Camera className="w-4 h-4 text-gov-navy" />
              Destination Highlights & Tourist Guide
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
              {selectedDestination.travelTimeFromHub}
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden h-48 sm:h-56 bg-slate-900">
            <img
              src={selectedDestination.imageUrl}
              alt={selectedDestination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-4">
              <p className="text-white text-xs sm:text-sm font-medium">
                {selectedDestination.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Must-Visit Experience Points & Viewpoints:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selectedDestination.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-center text-xs font-bold text-slate-800 hover:bg-amber-50 hover:border-gov-gold transition"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Digital Green Travel Pass */}
        <div className="space-y-4">
          <EcoPassCard
            destination={selectedDestination}
          />

          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm text-xs space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Smart Travel Tip</span>
            </div>
            <p className="leading-relaxed">
              Choosing certified twin destinations helps protect delicate Western Ghats biodiversity and saves you up to 90 minutes of roadblock waiting time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
