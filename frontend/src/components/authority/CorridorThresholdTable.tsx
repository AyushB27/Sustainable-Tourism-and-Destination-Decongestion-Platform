import React from 'react';
import { Eye } from 'lucide-react';
import type { Destination } from '../../types';
import { calculateDCCMetrics } from '../../lib/engine';

interface CorridorThresholdTableProps {
  destinations: Destination[];
  selectedId: string;
  onSelectDestination: (id: string) => void;
}

export const CorridorThresholdTable: React.FC<CorridorThresholdTableProps> = ({
  destinations,
  selectedId,
  onSelectDestination
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Corridor Destination Threshold Monitoring Table
          </h3>
          <p className="text-xs text-slate-500">
            Real-time telemetry, Dynamic Carrying Capacity (DCC) indices, and authority control throttles
          </p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto font-mono">
          Auto-updated live
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Destination Hub</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Inflow / Capacity</th>
              <th className="py-3 px-4">DCC Index</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Est. Wait</th>
              <th className="py-3 px-4">Local Pressure</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {destinations.map((dest) => {
              const { dccScore, status, capacityUtilization, waitTimeMinutes } = calculateDCCMetrics(dest);
              const isSelected = dest.id === selectedId;
              const utilPct = Math.round(capacityUtilization * 100);

              const statusBadge = {
                OPTIMAL: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                MODERATE: 'bg-amber-100 text-amber-800 border-amber-300',
                CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
              }[status];

              return (
                <tr
                  key={dest.id}
                  onClick={() => onSelectDestination(dest.id)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-emerald-50/60 font-medium' : ''
                  }`}
                >
                  {/* Destination Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'CRITICAL' ? 'bg-rose-500' : status === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <strong className="text-slate-900 block">{dest.name}</strong>
                        <span className="text-[10px] text-slate-400">{dest.district}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                      {dest.category}
                    </span>
                  </td>

                  {/* Inflow vs Physical Capacity */}
                  <td className="py-3 px-4">
                    <div className="space-y-1 min-w-[120px]">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{dest.currentInflow.toLocaleString()}</span>
                        <span className="text-slate-500">/ {dest.physicalCapacity.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            utilPct > 100 ? 'bg-rose-500' : utilPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, utilPct)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* DCC Score */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {dccScore.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (W: {(dest.weatherHazardScore * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusBadge}`}>
                      {status}
                    </span>
                  </td>

                  {/* Est. Wait */}
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${waitTimeMinutes > 30 ? 'text-rose-600 font-bold' : waitTimeMinutes > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {waitTimeMinutes > 0 ? `${waitTimeMinutes} mins` : '0 min'}
                    </span>
                  </td>

                  {/* Local Pressure */}
                  <td className="py-3 px-4 text-[11px]">
                    <div className="text-slate-600 space-y-0.5">
                      <div>Parking: <strong className={dest.localPressure.parkingSaturationPct > 80 ? 'text-rose-600' : 'text-slate-700'}>{dest.localPressure.parkingSaturationPct}%</strong></div>
                      <div>Water: <strong>{(dest.localPressure.waterStressIndex * 100).toFixed(0)}%</strong></div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDestination(dest.id);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg text-xs font-medium transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Focus</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
