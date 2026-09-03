import React from 'react';
import { 
  Users, 
  Activity,
  BedDouble
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateDCCMetrics } from '../../lib/engine';
import { LiveInventoryCard } from './LiveInventoryCard';
import { InflowPredictorTimeline } from './InflowPredictorTimeline';
import { OffPeakIncentiveCard } from './OffPeakIncentiveCard';

export const ProviderView: React.FC = () => {
  const {
    destinations,
    selectedDestinationId,
    setSelectedDestinationId,
    promotions
  } = useCorridorStore();

  const selectedDestination = destinations.find(d => d.id === selectedDestinationId) || destinations[0];
  const selectedMetrics = calculateDCCMetrics(selectedDestination);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Official MTDC Homestay & Provider Header */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gov-navy text-amber-300 flex items-center justify-center font-bold text-2xl border-2 border-gov-gold shrink-0 shadow-inner">
            🏨
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                MTDC Accredited Operator Console
              </span>
              <span className="text-xs font-mono text-slate-500">
                REG-ID: MTDC/WL/2026-HOTEL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Local Hospitality, Homestay & Tour Operator Console
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Report live room occupancy, publish off-peak tourist discount schemes, and support local carrying capacity balance
            </p>
          </div>
        </div>

        {/* Destination Operator Switcher */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Managing Property In
            </span>
            <span className="font-extrabold text-gov-navy text-sm">{selectedDestination.name}</span>
          </div>

          <select
            value={selectedDestinationId}
            onChange={(e) => setSelectedDestinationId(e.target.value)}
            aria-label="Managing Property In Destination"
            className="bg-slate-50 border-2 border-slate-300 hover:border-gov-navy focus:border-gov-navy rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none transition cursor-pointer shadow-inner"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                🏨 {d.name} ({d.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Destination Live Pulse Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-gov-green rounded-lg border border-emerald-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Carrying Capacity Status</span>
            <p className="text-base font-black text-slate-900">
              {selectedMetrics.dccScore.toFixed(2)} DCC ({selectedMetrics.status})
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-lg border border-sky-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Current Tourist Inflow</span>
            <p className="text-base font-black text-slate-900">
              {selectedDestination.currentInflow.toLocaleString()} / {selectedDestination.physicalCapacity.toLocaleString()} cap
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Reported Hotel Occupancy</span>
            <p className="text-base font-black text-slate-900">
              {selectedDestination.hotelOccupancyPct}% Occupied
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Inventory & Inflow Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveInventoryCard destination={selectedDestination} />
        <InflowPredictorTimeline destination={selectedDestination} />
      </div>

      {/* Off-Peak Incentive Promotion Dispatcher */}
      <OffPeakIncentiveCard
        destination={selectedDestination}
        promotions={promotions}
      />
    </div>
  );
};
