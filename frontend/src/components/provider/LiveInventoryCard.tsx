import React from 'react';
import { 
  BedDouble, 
  TrendingUp, 
  Sparkles, 
  Sliders
} from 'lucide-react';
import type { Destination } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';

interface LiveInventoryCardProps {
  destination: Destination;
}

export const LiveInventoryCard: React.FC<LiveInventoryCardProps> = ({ destination }) => {
  const { updateDestinationHotelOccupancy } = useCorridorStore();

  const occupancy = destination.hotelOccupancyPct;
  const isHighOccupancy = occupancy >= 85;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Live Hotelier & Homestay Inventory Console
            </h3>
            <p className="text-xs text-slate-500">
              Reported room occupancy for <strong>{destination.name}</strong>
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          isHighOccupancy ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          {occupancy}% Occupancy
        </span>
      </div>

      {/* Main Slider Control */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            Adjust Reported Hotel & Resort Occupancy %
          </span>
          <span className="font-mono text-base font-black text-emerald-700">
            {occupancy}%
          </span>
        </div>

        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={occupancy}
          onChange={(e) => {
            const val = Number(e.target.value);
            updateDestinationHotelOccupancy(destination.id, val);
            // Fire-and-forget sync to backend PUT /api/destinations/{id}/occupancy
            fetch(`http://127.0.0.1:8000/api/destinations/${destination.id}/occupancy`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ occupancy_pct: val, available_rooms: Math.max(0, Math.round(100 - val)) }),
              signal: AbortSignal.timeout(2000)
            }).catch(() => { /* silent fallback */ });
          }}
          aria-label={`Reported Hotel and Resort Occupancy percentage for ${destination.name}`}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />

        <div className="flex justify-between text-[11px] text-slate-400">
          <span>10% (High Vacancy / Discount Zone)</span>
          <span>50% (Normal)</span>
          <span>100% (Fully Booked)</span>
        </div>
      </div>

      {/* Dynamic Pricing Recommendation Pill */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Dynamic Yield Guidance
          </span>
          <p className="font-bold text-slate-800">
            {occupancy < 50
              ? '📉 Lower occupancy detected: Post a 20-30% discount to attract rerouted tourists.'
              : occupancy > 85
              ? '📈 Peak capacity reached: Consider implementing green decongestion tariffs.'
              : '⚖️ Balanced demand: Standard seasonal tariff recommended.'}
          </p>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Corridor Feedback Loop
          </span>
          <p className="text-slate-600 text-[11px]">
            Adjusting hotel occupancy directly feeds into local parking stress indices and updates the destination's DCC score in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};
