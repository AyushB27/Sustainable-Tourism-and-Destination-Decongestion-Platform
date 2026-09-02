import React from 'react';
import { 
  HeartHandshake, 
  Car, 
  Droplets, 
  Trash2, 
  CloudRain, 
  Sliders
} from 'lucide-react';
import type { Destination } from '../../types';
import { calculateDCCMetrics } from '../../lib/engine';
import { useCorridorStore } from '../../store/useCorridorStore';

interface EcoHealthCommunityWidgetProps {
  destination: Destination;
}

export const EcoHealthCommunityWidget: React.FC<EcoHealthCommunityWidgetProps> = ({ destination }) => {
  const { 
    updateDestinationCapacity, 
    updateDestinationWeather, 
    updateDestinationInflow
  } = useCorridorStore();

  const { status } = calculateDCCMetrics(destination);
  const pressure = destination.localPressure;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Local Community Impact & Eco-Health Gauges
            </h3>
            <p className="text-xs text-slate-500">
              Monitoring ecological indicators & administrative emergency throttles for <strong>{destination.name}</strong>
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          status === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          {status} Health Rating
        </span>
      </div>

      {/* 4 Community Impact Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Gauge 1: Parking Saturation */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase">Parking Load</span>
            <Car className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${pressure.parkingSaturationPct >= 85 ? 'text-rose-600' : 'text-slate-800'}`}>
              {pressure.parkingSaturationPct}%
            </span>
            <span className="text-[10px] text-slate-400">occupied</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${pressure.parkingSaturationPct >= 85 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${pressure.parkingSaturationPct}%` }}
            />
          </div>
        </div>

        {/* Gauge 2: Water Stress Index */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase">Water Stress</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${pressure.waterStressIndex >= 0.75 ? 'text-rose-600' : 'text-sky-700'}`}>
              {(pressure.waterStressIndex * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-slate-400">demand ratio</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${pressure.waterStressIndex >= 0.75 ? 'bg-rose-500' : 'bg-sky-500'}`}
              style={{ width: `${pressure.waterStressIndex * 100}%` }}
            />
          </div>
        </div>

        {/* Gauge 3: Weather / Landslide Hazard */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase">Hazard Risk</span>
            <CloudRain className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${destination.weatherHazardScore >= 0.4 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {(destination.weatherHazardScore * 100).toFixed(0)}%
            </span>
            <span className="text-[10px] text-slate-400">risk index</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${destination.weatherHazardScore >= 0.4 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${destination.weatherHazardScore * 100}%` }}
            />
          </div>
        </div>

        {/* Gauge 4: Municipal Waste Alert */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase">Waste Overload</span>
            <Trash2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-base font-bold ${pressure.municipalWasteAlert ? 'text-rose-600' : 'text-emerald-600'}`}>
              {pressure.municipalWasteAlert ? 'CRITICAL SPILL' : 'NORMAL CLEAR'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            {pressure.municipalWasteAlert ? 'Clean-up squads dispatched' : 'Under municipal capacity'}
          </p>
        </div>
      </div>

      {/* Administrative Dynamic Controls & Emergency Throttle */}
      <div className="bg-slate-900 text-white rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm text-emerald-300">
              Authority Live Control Sliders ({destination.name})
            </h4>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            Synchronizes instantly to Mobile Tourist view
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Slider 1: Physical Capacity Throttle */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Physical Entry Cap:</span>
              <strong className="text-emerald-400">{destination.physicalCapacity.toLocaleString()} visitors</strong>
            </div>
            <input
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={destination.physicalCapacity}
              onChange={(e) => updateDestinationCapacity(destination.id, Number(e.target.value))}
              aria-label={`Physical Entry Cap for ${destination.name}`}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] text-slate-400 block">Lower limit to throttle access during emergencies</span>
          </div>

          {/* Slider 2: Inflow Volume Simulator */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Live Inflow Count:</span>
              <strong className="text-amber-400">{destination.currentInflow.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min={500}
              max={25000}
              step={200}
              value={destination.currentInflow}
              onChange={(e) => updateDestinationInflow(destination.id, Number(e.target.value))}
              aria-label={`Live Inflow Count for ${destination.name}`}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] text-slate-400 block">Simulate toll plaza traffic surges</span>
          </div>

          {/* Slider 3: Weather Hazard Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Weather / Landslide Risk:</span>
              <strong className="text-rose-400">{(destination.weatherHazardScore * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={destination.weatherHazardScore}
              onChange={(e) => updateDestinationWeather(destination.id, Number(e.target.value))}
              aria-label={`Weather and Landslide Risk for ${destination.name}`}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[10px] text-slate-400 block">Simulate fog, heavy rain, or rockfall risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};
