import React from 'react';
import { 
  QrCode, 
  CheckCircle, 
  ShieldCheck
} from 'lucide-react';
import type { Destination } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';

interface EcoPassCardProps {
  destination: Destination;
}

export const EcoPassCard: React.FC<EcoPassCardProps> = ({ destination }) => {
  const { divertedTripsCount, totalCarbonSavedKg, lastRerouteNotice, clearRerouteNotice } = useCorridorStore();

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-5 space-y-4">
      {/* Toast Notification on Successful Reroute */}
      {lastRerouteNotice && (
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center justify-between gap-2 text-emerald-950 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gov-green shrink-0" />
            <span className="font-bold">{lastRerouteNotice}</span>
          </div>
          <button
            onClick={clearRerouteNotice}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-bold underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Official Green Travel Pass Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-lg border border-emerald-700 shadow-inner">
            🌿
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span>Digital Green Travel Pass</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300 uppercase">
                Official Voucher
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Ministry of Tourism • Sustainable Western Ghats Decongestion Initiative
            </p>
          </div>
        </div>

        <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 text-right self-start sm:self-auto font-mono text-xs font-bold text-slate-800">
          PASS ID: ECO-MH-2026-092
        </div>
      </div>

      {/* Pass Body & QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Pass Details */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gov-green" />
            <span className="text-xs font-bold text-slate-800">
              Verified Destination: <strong className="text-gov-navy font-black">{destination.name}</strong> ({destination.district})
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            By choosing a certified under-visited destination, you help protect delicate Western Ghats biodiversity and avoid up to 2 hours of bottleneck traffic.
          </p>

          {/* Cumulative Carbon Offset Summary */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Total Trips Diverted
              </span>
              <span className="text-xl font-black text-gov-navy">
                {divertedTripsCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Corridor CO₂ Saved
              </span>
              <span className="text-xl font-black text-gov-green">
                ~{totalCarbonSavedKg.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>

        {/* QR Code for Checkpoints */}
        <div className="md:col-span-4 bg-white p-4 rounded-2xl border-2 border-slate-300 flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
          <div className="p-2 bg-slate-900 text-white rounded-xl">
            <QrCode className="w-16 h-16 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-black text-gov-navy uppercase tracking-wider block">
              Priority Toll QR
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Show at highway toll booths for green lane entry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
