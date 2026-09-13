import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Layers, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { Destination } from '../../types';

interface TouristCorridorMapProps {
  destinations?: Destination[];
  selectedId?: string;
  onSelectDestination?: (id: string) => void;
}

const MapRecenter: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.flyTo(coords, 8, { duration: 1.0 });
    }
  }, [coords, map]);
  return null;
};

export const TouristCorridorMap: React.FC<TouristCorridorMapProps> = ({
  destinations: propDestinations,
  selectedId,
  onSelectDestination
}) => {
  const navigate = useNavigate();
  const { destinations: storeDestinations } = useCorridorStore();
  const destinations = propDestinations && propDestinations.length > 0 ? propDestinations : storeDestinations;
  const activeDest = destinations.find(d => d.id === selectedId) || destinations[0];
  const centerCoords: [number, number] = activeDest ? [activeDest.coordinates[0], activeDest.coordinates[1]] : [18.75, 73.40];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gov-navy text-emerald-400 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              Maharashtra Eco-Corridor GIS Map
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                21 Monitored Corridors
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive carrying capacity pins. Click any spot to see crowd load & twin alternatives.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600" />
            Optimal
          </span>
          <span className="flex items-center gap-1.5 font-bold text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-600" />
            Moderate
          </span>
          <span className="flex items-center gap-1.5 font-bold text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-600" />
            Critical
          </span>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
        <MapContainer
          center={centerCoords}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter coords={centerCoords} />

          {destinations.map((dest) => {
            const capRatio = dest.currentInflow / Math.max(1, dest.physicalCapacity);
            const isSelected = dest.id === selectedId;
            const isCritical = capRatio >= 0.85;
            const isModerate = capRatio >= 0.65 && capRatio < 0.85;

            const strokeColor = isSelected ? '#0f172a' : isCritical ? '#dc2626' : isModerate ? '#d97706' : '#059669';
            const fillColor = isCritical ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';
            const radius = Math.min(26, Math.max(12, Math.round(14 + capRatio * 10)));

            return (
              <CircleMarker
                key={dest.id}
                center={dest.coordinates}
                radius={radius}
                pathOptions={{
                  color: strokeColor,
                  fillColor: fillColor,
                  fillOpacity: 0.85,
                  weight: isSelected ? 3 : 2
                }}
                eventHandlers={{
                  click: () => {
                    if (onSelectDestination) onSelectDestination(dest.id);
                  }
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-center font-sans">
                    <span className="font-extrabold text-xs block text-slate-900">{dest.name}</span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {(capRatio * 100).toFixed(0)}% Capacity • {dest.category}
                    </span>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-1 space-y-2.5 font-sans min-w-[220px]">
                    <div className="border-b border-slate-100 pb-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{dest.category}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isCritical ? 'bg-rose-100 text-rose-800' : isModerate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isCritical ? 'CRITICAL' : isModerate ? 'MODERATE' : 'OPTIMAL'}
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900 mt-0.5">{dest.name}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{dest.tagline}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Active Inflow</span>
                        <strong className="text-slate-800 font-mono">{dest.currentInflow.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Capacity Cap</span>
                        <strong className="text-slate-800 font-mono">{dest.physicalCapacity.toLocaleString()}</strong>
                      </div>
                    </div>

                    {isCritical && (
                      <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>High crowd detected! Consider choosing a less-crowded twin alternative.</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => navigate(`/plan/new?spotId=${dest.id}`)}
                        className="flex-1 bg-gov-navy hover:bg-slate-800 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Navigation className="w-3 h-3 text-emerald-400" />
                        <span>Plan Trip</span>
                      </button>
                      <button
                        onClick={() => navigate(`/spot/${dest.id}`)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
