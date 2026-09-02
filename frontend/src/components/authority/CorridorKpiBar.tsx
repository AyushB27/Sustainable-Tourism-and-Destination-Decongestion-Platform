import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Radio, 
  Activity
} from 'lucide-react';
import type { CorridorMetrics } from '../../types';

interface CorridorKpiBarProps {
  metrics: CorridorMetrics;
}

export const CorridorKpiBar: React.FC<CorridorKpiBarProps> = ({ metrics }) => {
  const {
    totalCapacity,
    totalInflow,
    criticalCount,
    moderateCount,
    optimalCount,
    redPercentage,
    activeAdvisoriesCount,
    avgDcc
  } = metrics;

  const totalDestinations = criticalCount + moderateCount + optimalCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Corridor Aggregate Tourist Volume */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Corridor Active Visitors
          </span>
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900">
            {totalInflow.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500">
            / {totalCapacity.toLocaleString()} cap
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${Math.min(100, (totalInflow / totalCapacity) * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 mt-1 block">
          Corridor Capacity Load: {((totalInflow / totalCapacity) * 100).toFixed(1)}%
        </span>
      </div>

      {/* KPI 2: Destinations in Red Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Critical Hotspots (Red)
          </span>
          <div className={`p-2 rounded-xl ${criticalCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-black ${criticalCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {criticalCount}
          </span>
          <span className="text-xs text-slate-500">
            of {totalDestinations} zones ({redPercentage}%)
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1 font-medium">
          {criticalCount > 0 
            ? 'Active rerouting nudges dispatched to mobile tourists' 
            : 'All corridor sectors running within safe thresholds'}
        </p>
      </div>

      {/* KPI 3: Mean Corridor DCC Score */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Corridor DCC Health Index
          </span>
          <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-black ${avgDcc >= 0.85 ? 'text-rose-600' : avgDcc >= 0.70 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {avgDcc.toFixed(2)}
          </span>
          <span className="text-xs text-slate-500">
            Corridor Avg Score
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
          <span className="text-emerald-600 font-bold">{optimalCount} Optimal</span> • 
          <span className="text-amber-600 font-bold">{moderateCount} Mod</span> • 
          <span className="text-rose-600 font-bold">{criticalCount} Crit</span>
        </div>
      </div>

      {/* KPI 4: Active Emergency Advisories */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Digital Broadcasts
          </span>
          <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
            <Radio className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900">
            {activeAdvisoriesCount}
          </span>
          <span className="text-xs text-slate-500">
            Notices on Air
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Synchronized to mobile portal banners in real-time
        </p>
      </div>
    </div>
  );
};
