import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  RefreshCw, 
  CheckCircle2, 
  WifiOff, 
  ArrowRight, 
  ExternalLink,
  Calculator
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateCorridorMetrics, calculateDCCMetrics } from '../lib/engine';
import { CorridorKpiBar } from '../components/authority/CorridorKpiBar';
import { CorridorMap } from '../components/authority/CorridorMap';

export const AuthorityCommandPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    destinations,
    selectedDestinationId,
    setSelectedDestinationId,
    advisories,
    liveBackendStatus,
    fetchLiveBackendFeed
  } = useCorridorStore();

  // Policy simulator state (§5.3)
  const [simSpotId, setSimSpotId] = useState<string>('LON');
  const [capVehiclesPerHour, setCapVehiclesPerHour] = useState<number>(1200);

  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const corridorMetrics = calculateCorridorMetrics(destinations, activeAdvisoriesCount);

  const simSpot = destinations.find(d => d.id === simSpotId) || destinations[0];
  const originalMetrics = calculateDCCMetrics(simSpot);

  // Modeled effect using transparent DCC formula
  const currentHourlyInflow = Math.round(simSpot.currentInflow / 3.5);
  const modeledInflow = Math.min(simSpot.currentInflow, capVehiclesPerHour * 3.5);
  const modeledUtilization = modeledInflow / simSpot.physicalCapacity;
  const modeledDcc = Number(((0.70 * modeledUtilization) + (0.30 * simSpot.weatherHazardScore)).toFixed(2));
  const modeledWaitMins = Math.max(0, Math.round(((modeledInflow - simSpot.physicalCapacity) / simSpot.physicalCapacity) * simSpot.avgDwellTimeHours * 60));
  const queueTimeSaved = Math.max(0, originalMetrics.waitTimeMinutes - modeledWaitMins);

  const handleSelectSpot = (id: string) => {
    setSelectedDestinationId(id);
    navigate(`/authority/spot/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Official State Authority Command Center Header */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gov-navy text-amber-300 flex items-center justify-center font-bold text-2xl border-2 border-gov-gold shrink-0 shadow">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Disaster & Traffic Command HQ
              </span>
              <span className="text-xs font-mono text-slate-500">
                WESTERN GHATS DISTRICT CELL
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              District GIS Carrying Capacity Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Corridor overview across Pune, Raigad, and Satara. Click any destination to access its full canonical Spot Page with live authority controls.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <button
            onClick={fetchLiveBackendFeed}
            disabled={liveBackendStatus === 'syncing'}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm border ${
              liveBackendStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-400 hover:bg-emerald-100'
                : liveBackendStatus === 'offline'
                ? 'bg-amber-50 text-amber-900 border-amber-400 hover:bg-amber-100'
                : 'bg-gov-navy text-white border-gov-navy hover:bg-gov-navy-light'
            }`}
          >
            {liveBackendStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
            ) : liveBackendStatus === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-gov-green" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-600" />
            )}
            <span>
              {liveBackendStatus === 'syncing'
                ? 'Ingesting Python Feeds…'
                : liveBackendStatus === 'connected'
                ? 'Live Python Sensors Active'
                : 'Simulator Mode (Click to Sync)'}
            </span>
          </button>

          <Link
            to="/advisories"
            className="px-4 py-2 bg-slate-900 text-amber-300 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <span>All Gazette Advisories ({activeAdvisoriesCount})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Corridor KPI Statistics Bar */}
      <CorridorKpiBar metrics={corridorMetrics} />

      {/* Interactive GIS Map & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <CorridorMap
            destinations={destinations}
            selectedId={selectedDestinationId}
            onSelectDestination={handleSelectSpot}
          />
          <p className="text-[11px] text-slate-500 mt-2 italic">
            💡 Tip: Click any destination pin on the map to jump directly into its canonical Spot Page with authority panels.
          </p>
        </div>

        {/* 5.3 Policy Simulator Widget */}
        <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-slate-300 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calculator className="w-5 h-5 text-gov-navy" />
              <div>
                <span className="text-[10px] font-bold text-gov-navy uppercase tracking-wider block">
                  Capacity Throttle Simulation (§5.3)
                </span>
                <h3 className="font-black text-slate-900 text-base">
                  Policy Impact Simulator
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Model the mathematical effect of capping vehicular entry rates on checkpoint delays using the transparent DCC formula.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Target Destination:</label>
              <select
                value={simSpotId}
                onChange={e => setSimSpotId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.district})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Cap Inflow Gate:</span>
                <strong className="text-gov-navy font-mono text-sm">{capVehiclesPerHour} veh/hr</strong>
              </label>
              <input
                type="range"
                min={400}
                max={3000}
                step={100}
                value={capVehiclesPerHour}
                onChange={e => setCapVehiclesPerHour(Number(e.target.value))}
                className="w-full accent-gov-navy cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                Current unconstrained hourly inflow: ~{currentHourlyInflow} vehicles/hr
              </span>
            </div>

            {/* Modeled Impact Metrics */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Modeled DCC Index:</span>
                <strong className={modeledDcc >= 0.85 ? 'text-rose-600' : modeledDcc >= 0.7 ? 'text-amber-600' : 'text-emerald-600'}>
                  {modeledDcc.toFixed(2)} (was {originalMetrics.dccScore.toFixed(2)})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modeled Queue Delay:</span>
                <strong className="text-slate-900">{modeledWaitMins} mins (was {originalMetrics.waitTimeMinutes}m)</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="font-bold text-emerald-800">Queue Time Saved:</span>
                <strong className="text-emerald-700 font-black">-{queueTimeSaved} minutes</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectSpot(simSpot.id)}
            className="w-full py-2.5 bg-gov-navy hover:bg-gov-navy-light text-amber-300 font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-1"
          >
            <span>Open {simSpot.name} Authority Panel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monitored Destinations Threshold Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Corridor Destination Threshold Monitoring Table
            </h2>
            <p className="text-xs text-slate-500">
              Click any row to view its canonical Spot Page with live authority sensors and emergency capacity overrides.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
            Auto-syncing
          </span>
        </div>

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
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {destinations.map(dest => {
                const { dccScore, status, waitTimeMinutes } = calculateDCCMetrics(dest);
                const statusBadge = {
                  OPTIMAL: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  MODERATE: 'bg-amber-100 text-amber-800 border-amber-300',
                  CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                }[status];

                return (
                  <tr
                    key={dest.id}
                    onClick={() => handleSelectSpot(dest.id)}
                    className="hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          status === 'CRITICAL' ? 'bg-rose-500' : status === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <strong className="text-slate-900 block">{dest.name}</strong>
                          <span className="text-[10px] text-slate-400">{dest.district}, {dest.state}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{dest.category}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold">{dest.currentInflow.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block">/ {dest.physicalCapacity.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{dccScore.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">{waitTimeMinutes} mins</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs font-bold text-gov-navy hover:underline inline-flex items-center gap-1">
                        <span>Inspect Spot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
