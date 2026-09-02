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
      {/* Toast Notification on Successful Reroute */}
      <AnimatePresence>
        {lastRerouteNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-gov-green text-white p-4 rounded-xl shadow-lg border-2 border-emerald-400 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-gov-green p-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">मार्ग परिवर्तन सफल | Trip Rerouted Successfully</p>
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

      {/* Official Citizen Welcome Ribbon */}
      <div className="bg-white rounded-xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gov-navy text-amber-300 rounded-lg shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-gov-navy leading-tight">
              नागरिक पर्यटन परामर्श व सुगम यात्रा योजना
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Check real-time destination congestion, bypass highway bottleneck checkpoints, and explore certified eco-friendly twin destinations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-gov-green" />
          <span>MTDC & MO Tourism Verified</span>
        </div>
      </div>

      {/* Destination Selector and Preference Filters */}
      <TouristFilters
        destinations={destinations}
        selectedId={selectedDestinationId}
        onSelectDestination={setSelectedDestinationId}
      />

      {/* Hero DCC Status Card (Real-time badge, Queuing Wait Time, Capacity Gauge) */}
      <HeroDCCStatus
        destination={selectedDestination}
        metrics={selectedMetrics}
      />

      {/* Preference-Preserving Twin Alternative Nudge */}
      <TwinAlternativeCards
        targetDestination={selectedDestination}
        targetMetrics={selectedMetrics}
        recommendations={recommendations}
      />

      {/* 12-Hour Hourly Predictive Inflow Curve */}
      <DemandCurveChart destination={selectedDestination} />

      {/* Destination Deep-Dive & Visual Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Camera className="w-4 h-4 text-gov-navy" />
              प्रमुख आकर्षण व स्थानिक माहिती | Destination Profile
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              {selectedDestination.travelTimeFromHub}
            </span>
          </div>

          <div className="relative rounded-lg overflow-hidden h-48 sm:h-56 bg-slate-900">
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
              Must-Visit Experience Points (प्रमुख दर्शनीय स्थल)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selectedDestination.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-center text-xs font-bold text-slate-800 hover:bg-amber-50 hover:border-gov-gold transition"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Eco Pass Component */}
        <div className="space-y-4">
          <EcoPassCard
            destination={selectedDestination}
          />

          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 shadow-sm text-xs space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>सस्टेनेबल पर्यटन परामर्श | Advisory</span>
            </div>
            <p className="leading-relaxed">
              Choosing certified twin destinations helps preserve delicate Western Ghats biodiversity and reduces vehicle queue wait times by up to 90 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
