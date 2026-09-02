import React from 'react';
import { RefreshCw, CheckCircle2, WifiOff } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateCorridorMetrics } from '../../lib/engine';
import { CorridorKpiBar } from './CorridorKpiBar';
import { CorridorMap } from './CorridorMap';
import { CorridorThresholdTable } from './CorridorThresholdTable';
import { EcoHealthCommunityWidget } from './EcoHealthCommunityWidget';
import { DigitalAdvisoryDispatcher } from './DigitalAdvisoryDispatcher';
import { DemandDiffusionFlow } from './DemandDiffusionFlow';

export const AuthorityView: React.FC = () => {
  const {
    destinations,
    selectedDestinationId,
    setSelectedDestinationId,
    advisories,
    liveBackendStatus,
    fetchLiveBackendFeed
  } = useCorridorStore();

  const selectedDestination = destinations.find(d => d.id === selectedDestinationId) || destinations[0];
  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const corridorMetrics = calculateCorridorMetrics(destinations, activeAdvisoriesCount);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Official State Authority Command Center Header */}
      <div className="bg-white rounded-xl border-2 border-slate-300 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gov-navy text-amber-300 flex items-center justify-center font-bold text-2xl border-2 border-gov-gold shrink-0 shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                आपदा व यातायात नियंत्रण कक्ष | Command HQ
              </span>
              <span className="text-xs font-mono text-slate-500">
                PUNE-RAIGAD-SATARA DISTRICT CELL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              District GIS Carrying Capacity & Incident Command Center
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Live multi-source sensor monitoring, automated carrying capacity alarms, and digital emergency gazette dispatchers
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {/* Live Backend Pipeline Sync Button */}
          <button
            onClick={fetchLiveBackendFeed}
            disabled={liveBackendStatus === 'syncing'}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm border ${
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
            ) : liveBackendStatus === 'offline' ? (
              <WifiOff className="w-4 h-4 text-amber-600" />
            ) : (
              <RefreshCw className="w-4 h-4 text-amber-300" />
            )}
            <span>
              {liveBackendStatus === 'syncing'
                ? 'Ingesting Python Sensor Feeds...'
                : liveBackendStatus === 'connected'
                ? 'Python Sensors Active (Live)'
                : liveBackendStatus === 'offline'
                ? 'Backend Offline (Click to Retry)'
                : 'Sync Python Live Sensor Pipeline'}
            </span>
          </button>
        </div>
      </div>

      {/* Corridor KPI Statistics Bar */}
      <CorridorKpiBar metrics={corridorMetrics} />

      {/* GIS Leaflet Map & Eco-Health Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive GIS Map */}
        <div className="lg:col-span-7">
          <CorridorMap
            destinations={destinations}
            selectedId={selectedDestinationId}
            onSelectDestination={setSelectedDestinationId}
          />
        </div>

        {/* Selected Hub Eco-Health & Administrative Controls */}
        <div className="lg:col-span-5">
          <EcoHealthCommunityWidget destination={selectedDestination} />
        </div>
      </div>

      {/* Tourist Movement & Demand Diffusion Matrix */}
      <DemandDiffusionFlow destinations={destinations} />

      {/* Corridor Destination Threshold Table */}
      <CorridorThresholdTable
        destinations={destinations}
        selectedId={selectedDestinationId}
        onSelectDestination={setSelectedDestinationId}
      />

      {/* Digital Advisory Dispatcher */}
      <DigitalAdvisoryDispatcher
        destinations={destinations}
        advisories={advisories}
      />
    </div>
  );
};
