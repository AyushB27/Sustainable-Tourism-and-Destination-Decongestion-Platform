import React from 'react';
import {
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateDCCMetrics } from '../../lib/engine';
import { Link } from 'react-router-dom';

export const ImpactReview: React.FC = () => {
  const { destinations, totalCarbonSavedKg, divertedTripsCount } = useCorridorStore();

  // Expired / Historical Advisory Impact Mock Log
  const historicalImpacts = [
    {
      id: 'IMP-LON-01',
      advisoryTitle: 'Monsoon Ghat Landslide Diversion (Lonavala → Matheran/Bhandardara)',
      period: 'Aug 15 - Aug 18, 2026',
      targetSpot: 'Lonavala & Khandala',
      twinAbsorbed: 'Matheran Eco-Zone & Bhandardara',
      beforeDcc: 0.94,
      afterDcc: 0.72,
      peakWaitBefore: '95 mins',
      peakWaitAfter: '15 mins',
      diversionsAchieved: 3420,
      carbonSavedKg: 68.4
    },
    {
      id: 'IMP-MAH-02',
      advisoryTitle: 'Venna Lake Parking Saturation Action (Mahabaleshwar → Tapola)',
      period: 'Jul 26 - Jul 28, 2026',
      targetSpot: 'Mahabaleshwar Plateau',
      twinAbsorbed: 'Tapola & Koyna Backwaters',
      beforeDcc: 0.89,
      afterDcc: 0.68,
      peakWaitBefore: '60 mins',
      peakWaitAfter: '5 mins',
      diversionsAchieved: 1850,
      carbonSavedKg: 37.0
    }
  ];

  // Under-utilized destinations (DCC < 0.45 or utilization < 40%)
  const underUtilizedSpots = destinations
    .map(d => ({
      spot: d,
      metrics: calculateDCCMetrics(d)
    }))
    .filter(item => item.metrics.capacityUtilization < 0.45)
    .sort((a, b) => a.metrics.dccScore - b.metrics.dccScore);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Corridor Diversions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-slate-900">{(5270 + divertedTripsCount).toLocaleString()}</span>
            <span className="text-xs text-emerald-700 font-bold">vehicles redirected</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Zero accidents in geofenced alert zones</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative Carbon Avoided</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-emerald-700">{(105.4 + totalCarbonSavedKg).toFixed(1)}</span>
            <span className="text-xs text-slate-500 font-bold">kg CO2</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Calculated from avoided idling in ghat traffic</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Corridor Carrying Balance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-gov-navy">+34%</span>
            <span className="text-xs text-emerald-700 font-bold">diffusion efficiency</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Twin destinations absorbed peak weekend overflow</span>
        </div>
      </div>

      {/* Section A: Historical Advisory Post-Mortem Impact Review */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Advisory Incident Post-Mortem & Decongestion Impact Review</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical before/after telemetry review demonstrating the effectiveness of digital gazette advisories and twin incentives.
          </p>
        </div>

        <div className="space-y-4">
          {historicalImpacts.map((imp) => (
            <div key={imp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold">{imp.id}</span>
                  <strong className="text-slate-900 text-sm">{imp.advisoryTitle}</strong>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{imp.period}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-center">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase block">Before DCC</span>
                  <strong className="text-rose-600 text-sm block mt-0.5">{imp.beforeDcc.toFixed(2)}</strong>
                  <span className="text-[9px] text-slate-400">Peak Congestion</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase block">After DCC</span>
                  <strong className="text-emerald-700 text-sm block mt-0.5">{imp.afterDcc.toFixed(2)}</strong>
                  <span className="text-[9px] text-emerald-700 font-bold">-23% Load</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase block">Queue Time Saved</span>
                  <strong className="text-emerald-700 text-sm block mt-0.5">{imp.peakWaitBefore} → {imp.peakWaitAfter}</strong>
                  <span className="text-[9px] text-slate-400">Ghat Bottleneck</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase block">Diversions</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">{imp.diversionsAchieved.toLocaleString()}</strong>
                  <span className="text-[9px] text-slate-400">to {imp.twinAbsorbed}</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-slate-400 uppercase block">Carbon Saved</span>
                  <strong className="text-emerald-700 text-sm block mt-0.5">{imp.carbonSavedKg} kg</strong>
                  <span className="text-[9px] text-emerald-700 font-bold">CO2 Avoided</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Under-Utilized Destination Promotion Targets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Under-Utilized Destinations (Algorithmic Promotion Planning)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Destinations currently operating below 45% safe capacity, flagged for Discover feed visibility boost and MTDC homestay discount vouchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {underUtilizedSpots.map(({ spot, metrics }) => (
            <div key={spot.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 text-sm">{spot.name}</strong>
                  <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                    DCC {metrics.dccScore.toFixed(2)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">{spot.district}</span>
                <p className="text-slate-600 mt-1 text-[11px]">{spot.tagline}</p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Inflow / Cap</span>
                  <span className="text-slate-800">{spot.currentInflow} / {spot.physicalCapacity}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Safe Headroom</span>
                  <strong className="text-emerald-700">+{spot.physicalCapacity - spot.currentInflow} tourists</strong>
                </div>
              </div>

              <Link
                to={`/spot/${spot.id}`}
                className="w-full py-2 text-center bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-800 transition flex items-center justify-center gap-1"
              >
                <span>Drill into Spot Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-gov-navy" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
