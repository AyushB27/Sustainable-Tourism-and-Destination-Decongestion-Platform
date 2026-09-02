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
    <div className="bg-white rounded-xl border-2 border-slate-300 shadow-sm p-5 space-y-4">
      {/* Reroute Alert Notification if present */}
      {lastRerouteNotice && (
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-lg flex items-center justify-between gap-2 text-emerald-950 text-xs shadow-sm">
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

      {/* Official Green Yatra Pass Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-lg border border-emerald-700 shadow-inner">
            🌿
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
              <span>हरित यात्रा प्रमाण-पत्र</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-gov-green">Digital Green Corridor Pass</span>
            </h3>
            <p className="text-[11px] text-slate-600">
              Ministry of Tourism • Sustainable Western Ghats Decongestion Accreditation
            </p>
          </div>
        </div>

        <div className="bg-slate-100 px-3 py-1 rounded border border-slate-300 text-right self-start sm:self-auto font-mono text-[11px] font-bold text-slate-800">
          PASS ID: ECO-MH-2026-092
        </div>
      </div>

      {/* Pass Body with Official Seal and QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Pass Details */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gov-green" />
            <span className="text-xs font-bold text-slate-800">
              Approved Destination: <strong className="text-gov-navy font-black">{destination.name}</strong> ({destination.district})
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            By choosing a certified under-visited twin destination, you reduce high-altitude vehicular emissions and alleviate municipal infrastructure bottlenecks in eco-sensitive Sahyadri zones.
          </p>

          {/* Cumulative Carbon Avoided Pill */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Total Trips Diverted
              </span>
              <span className="text-lg font-black text-gov-navy">
                {divertedTripsCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Corridor CO₂ Offset
              </span>
              <span className="text-lg font-black text-gov-green">
                ~{totalCarbonSavedKg.toFixed(1)} kg
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Card for Checkpoints */}
        <div className="md:col-span-4 bg-white p-3.5 rounded-xl border-2 border-slate-300 flex flex-col items-center justify-center text-center space-y-1.5 shadow-sm">
          <div className="p-2 bg-slate-900 text-white rounded-lg">
            <QrCode className="w-16 h-16 text-emerald-400" />
          </div>
          <span className="text-[10px] font-black text-gov-navy uppercase tracking-wider">
            Fast-Track Toll QR
          </span>
          <span className="text-[9px] text-slate-500 font-medium">
            Scan at MSRDC Toll Plaza for green lane transit
          </span>
        </div>
      </div>
    </div>
  );
};
