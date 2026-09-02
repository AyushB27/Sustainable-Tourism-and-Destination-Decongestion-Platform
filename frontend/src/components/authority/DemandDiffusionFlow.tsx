import React from 'react';
import { 
  GitFork, 
  ArrowRight, 
  Car, 
  Navigation
} from 'lucide-react';
import type { Destination } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';
import { TRANSLATIONS } from '../../lib/i18n';

interface DemandDiffusionFlowProps {
  destinations?: Destination[];
}

export const DemandDiffusionFlow: React.FC<DemandDiffusionFlowProps> = () => {
  const { language } = useCorridorStore();
  const t = TRANSLATIONS[language];

  const corridorFlows = [
    {
      origin: 'Mumbai / Thane Metropolitan Hub',
      primaryTarget: 'Lonavala & Khandala (LON)',
      targetDcc: 0.92,
      targetStatus: 'CRITICAL',
      divertedTarget: 'Matheran Eco-Zone (MAT)',
      altDcc: 0.32,
      altStatus: 'OPTIMAL',
      divertedVolumePerHour: 340,
      reliefPct: 38,
      routeDescription: 'NH-48 Ghat bypass via Neral Station route'
    },
    {
      origin: 'Pune / Pimpri-Chinchwad Urban Hub',
      primaryTarget: 'Lonavala & Khandala (LON)',
      targetDcc: 0.92,
      targetStatus: 'CRITICAL',
      divertedTarget: 'Bhandardara Haven (BHA)',
      altDcc: 0.24,
      altStatus: 'OPTIMAL',
      divertedVolumePerHour: 220,
      reliefPct: 29,
      routeDescription: 'Nashik Highway via Ghoti bypass route'
    },
    {
      origin: 'South Mumbai Ferry Terminal',
      primaryTarget: 'Alibaug Beach (ALB)',
      targetDcc: 0.84,
      targetStatus: 'CRITICAL',
      divertedTarget: 'Kashid & Murud Waters (KAS)',
      altDcc: 0.30,
      altStatus: 'OPTIMAL',
      divertedVolumePerHour: 280,
      reliefPct: 32,
      routeDescription: 'Revdanda coastal highway corridor'
    },
    {
      origin: 'Pune / Satara Highway Corridor',
      primaryTarget: 'Mahabaleshwar Plateau (MAH)',
      targetDcc: 0.89,
      targetStatus: 'CRITICAL',
      divertedTarget: 'Tapola & Koyna Backwaters (TAP)',
      altDcc: 0.23,
      altStatus: 'OPTIMAL',
      divertedVolumePerHour: 190,
      reliefPct: 26,
      routeDescription: 'Shivsagar lake artery scenic detour'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              {t.demandDiffusionTitle}
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                AI Traffic Diffusion
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Live analysis of tourist migration from saturated hotspots to under-visited twin catchments
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          Corridor Flux: ~1,030 tourists/hr redistributed
        </span>
      </div>

      {/* Origin-Destination Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {corridorFlows.map((flow, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
          >
            {/* Origin */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Navigation className="w-3 h-3 text-slate-400" />
                Origin: {flow.origin}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                +{flow.reliefPct}% Corridor Relief
              </span>
            </div>

            {/* Split Flow Visualization */}
            <div className="grid grid-cols-11 items-center gap-1 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              {/* Saturated Hotspot */}
              <div className="col-span-5 p-2 rounded-lg bg-rose-50 border border-rose-200 space-y-0.5">
                <span className="text-[9px] font-bold text-rose-600 uppercase block">Overloaded Hotspot</span>
                <strong className="text-slate-900 block truncate text-xs">{flow.primaryTarget.split('(')[0]}</strong>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1 py-0.2 rounded inline-block">
                  DCC {flow.targetDcc.toFixed(2)} (Red)
                </span>
              </div>

              {/* Arrow and Reroute Volume */}
              <div className="col-span-1 flex flex-col items-center justify-center text-emerald-600">
                <ArrowRight className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>

              {/* Decongested Twin */}
              <div className="col-span-5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 space-y-0.5">
                <span className="text-[9px] font-bold text-emerald-700 uppercase block">Rerouted Twin Haven</span>
                <strong className="text-slate-900 block truncate text-xs">{flow.divertedTarget.split('(')[0]}</strong>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded inline-block">
                  DCC {flow.altDcc.toFixed(2)} (Optimal)
                </span>
              </div>
            </div>

            {/* Flow Statistics Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
              <span className="flex items-center gap-1 font-medium">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                Diverted: <strong>~{flow.divertedVolumePerHour} tourists/hr</strong>
              </span>
              <span className="text-slate-400 text-[10px] font-mono truncate max-w-[200px]">
                {flow.routeDescription}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
