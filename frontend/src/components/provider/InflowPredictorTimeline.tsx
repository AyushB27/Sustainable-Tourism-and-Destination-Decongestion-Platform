import React from 'react';
import { 
  Clock, 
  BarChart3
} from 'lucide-react';
import type { Destination } from '../../types';

interface InflowPredictorTimelineProps {
  destination: Destination;
}

export const InflowPredictorTimeline: React.FC<InflowPredictorTimelineProps> = ({ destination }) => {
  const baseInflow = destination.currentInflow;
  const capacity = destination.physicalCapacity;

  // 3-day projection points
  const projectionDays = [
    {
      day: 'Today (Live Velocity)',
      date: 'Saturday (Peak)',
      inflow: baseInflow,
      ratio: baseInflow / capacity,
      peakHours: '11:00 AM – 3:30 PM',
      staffRecommendation: baseInflow > capacity ? 'Full emergency staffing + extra valet' : 'Standard weekend crew'
    },
    {
      day: 'Tomorrow (Forecast)',
      date: 'Sunday (Sustained)',
      inflow: Math.round(baseInflow * 0.92),
      ratio: (baseInflow * 0.92) / capacity,
      peakHours: '10:30 AM – 2:00 PM',
      staffRecommendation: (baseInflow * 0.92) > capacity ? 'High turnover prep + early breakfast slots' : 'Normal operations'
    },
    {
      day: 'Day 3 (Forecast)',
      date: 'Monday (Off-Peak)',
      inflow: Math.round(capacity * 0.40),
      ratio: 0.40,
      peakHours: '12:00 PM – 2:00 PM',
      staffRecommendation: 'Maintenance & supply restocking'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              3-Day Footfall Velocity & Inflow Predictor
            </h3>
            <p className="text-xs text-slate-500">
              Predictive AI demand velocity for local tour operators & hospitality businesses
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
          Corridor AI Model v2
        </span>
      </div>

      {/* 3-Day Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {projectionDays.map((proj, idx) => {
          const isOverCap = proj.inflow > capacity;
          const statusColor = isOverCap ? 'border-rose-200 bg-rose-50/50' : 'border-emerald-200 bg-emerald-50/50';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${statusColor} flex flex-col justify-between space-y-3`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold uppercase tracking-wider">{proj.day}</span>
                  <span className="text-[10px] font-mono">{proj.date}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-2xl font-black ${isOverCap ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {proj.inflow.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">visitors</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className={`h-full ${isOverCap ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, proj.ratio * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Peak Window: <strong>{proj.peakHours}</strong></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <strong>Staff Advice:</strong> {proj.staffRecommendation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
