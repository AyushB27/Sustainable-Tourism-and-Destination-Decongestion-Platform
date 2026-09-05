import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Layers } from 'lucide-react';
import type { Destination } from '../../types';
import { calculateDCCMetrics } from '../../lib/engine';

interface CorridorMapProps {
  destinations: Destination[];
  selectedId: string;
  onSelectDestination: (id: string) => void;
}

const MapRecenter: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 9, { duration: 1.2 });
  }, [coords, map]);
  return null;
};

export const CorridorMap: React.FC<CorridorMapProps> = ({
  destinations,
  selectedId,
  onSelectDestination
}) => {
  const selectedDest = destinations.find(d => d.id === selectedId) || destinations[0];
  const centerCoords: [number, number] = [18.75, 73.40];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-900 text-white">
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              Corridor GIS Carrying Capacity Map
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                OpenStreetMap GIS Live
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Marker radius scales with active inflow volume; Color codes indicate DCC stress levels
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
            Optimal (&lt; 0.70)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-amber-700">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600" />
            Moderate (0.70-0.84)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-rose-700">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600 animate-ping-slow" />
            Critical (&ge; 0.85)
          </span>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
        <MapContainer
          center={centerCoords}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter coords={selectedDest.coordinates} />

          {destinations.map((dest) => {
            const metrics = calculateDCCMetrics(dest);
            const isSelected = dest.id === selectedId;
            const isCritical = metrics.status === 'CRITICAL';
            const isModerate = metrics.status === 'MODERATE';

            const color = isCritical ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';
            const fillColor = isCritical ? '#f87171' : isModerate ? '#fbbf24' : '#34d399';
            
            const baseRadius = 14;
            const dynamicRadius = Math.min(32, Math.max(12, Math.round(baseRadius + (dest.currentInflow / dest.physicalCapacity) * 12)));

            return (
              <CircleMarker
                key={dest.id}
                center={dest.coordinates}
                radius={dynamicRadius}
                pathOptions={{
                  color: isSelected ? '#0f172a' : color,
                  fillColor: fillColor,
                  fillOpacity: isSelected ? 0.9 : 0.7,
                  weight: isSelected ? 3.5 : 2,
                }}
                eventHandlers={{
                  click: () => onSelectDestination(dest.id)
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95} permanent={false}>
                  <div className="text-xs font-semibold">
                    <p className="font-bold text-slate-900">{dest.name}</p>
                    <p className="text-slate-600">DCC: <span style={{ color }}>{metrics.dccScore.toFixed(2)}</span> ({metrics.status})</p>
                    <p className="text-slate-500">Inflow: {dest.currentInflow.toLocaleString()} / {dest.physicalCapacity.toLocaleString()}</p>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-1 space-y-2 text-xs min-w-[200px]">
                    <div className="border-b border-slate-200 pb-1.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{dest.category}</span>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">{dest.name}</h4>
                      <p className="text-[11px] text-slate-500">{dest.district}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">DCC Index:</span>
                        <strong style={{ color }} className="font-bold">{metrics.dccScore.toFixed(2)} ({metrics.status})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Inflow:</span>
                        <strong className="text-slate-800">{dest.currentInflow.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Physical Cap:</span>
                        <span className="text-slate-700">{dest.physicalCapacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Wait Delay:</span>
                        <strong className={metrics.waitTimeMinutes > 30 ? 'text-rose-600' : 'text-emerald-600'}>
                          {metrics.waitTimeMinutes} mins
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Parking Saturation:</span>
                        <span className="font-semibold text-slate-700">{dest.localPressure.parkingSaturationPct}%</span>
                      </div>
                    </div>

                    {dest.activeAdvisory && (
                      <div className="bg-rose-50 border border-rose-200 p-1.5 rounded text-[10px] text-rose-800">
                        <strong>Advisory:</strong> {dest.activeAdvisory}
                      </div>
                    )}

                    <button
                      onClick={() => onSelectDestination(dest.id)}
                      className="w-full mt-2 bg-slate-900 text-white font-medium py-1 px-2 rounded hover:bg-slate-800 text-xs text-center"
                    >
                      Inspect in Command Panel
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Selected Hub Overlay Card in Map */}
        {selectedDest && (
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-slate-700 text-xs shadow-lg pointer-events-none z-[1000]">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Focused Destination
            </span>
            <span className="font-bold text-sm text-white">{selectedDest.name}</span>
            <span className="text-slate-300 ml-2">({(selectedDest.currentInflow || 0).toLocaleString()} visitors)</span>
          </div>
        )}
      </div>
    </div>
  );
};
