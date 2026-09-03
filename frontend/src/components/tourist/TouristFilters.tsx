import React from 'react';
import { 
  MapPin, 
  Mountain, 
  Palmtree, 
  Landmark, 
  Church, 
  SlidersHorizontal,
  Compass,
  Wallet,
  Footprints,
  Users2
} from 'lucide-react';
import type { Destination, DestinationCategory } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateDCCMetrics } from '../../lib/engine';

interface TouristFiltersProps {
  destinations: Destination[];
  selectedId: string;
  onSelectDestination: (id: string) => void;
}

export const TouristFilters: React.FC<TouristFiltersProps> = ({
  destinations,
  selectedId,
  onSelectDestination
}) => {
  const { 
    categoryFilter, 
    setCategoryFilter, 
    userPreferences, 
    togglePreferenceTag
  } = useCorridorStore();

  const categories: { key: 'ALL' | DestinationCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: 'All Destinations', icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: 'Hill Station', label: 'Hill Stations', icon: <Mountain className="w-3.5 h-3.5" /> },
    { key: 'Coastal', label: 'Beaches & Coastal', icon: <Palmtree className="w-3.5 h-3.5" /> },
    { key: 'Heritage', label: 'Heritage Forts', icon: <Landmark className="w-3.5 h-3.5" /> },
    { key: 'Pilgrimage', label: 'Pilgrimage', icon: <Church className="w-3.5 h-3.5" /> },
  ];

  const preferenceTags: { 
    key: 'scenic' | 'budget' | 'adventure' | 'family'; 
    label: string; 
    icon: React.ReactNode; 
    idx: number;
  }[] = [
    { key: 'scenic', label: 'Scenic Views', icon: <Compass className="w-3.5 h-3.5" />, idx: 0 },
    { key: 'budget', label: 'Budget-Friendly', icon: <Wallet className="w-3.5 h-3.5" />, idx: 1 },
    { key: 'adventure', label: 'Trekking & Adventure', icon: <Footprints className="w-3.5 h-3.5" />, idx: 2 },
    { key: 'family', label: 'Family Suitable', icon: <Users2 className="w-3.5 h-3.5" />, idx: 3 },
  ];

  const filteredDestinations = categoryFilter === 'ALL'
    ? destinations
    : destinations.filter(d => d.category === categoryFilter);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Search & Destination Picker */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Destination Dropdown */}
        <div className="md:col-span-6">
          <label className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gov-navy" />
            <span>Select Your Target Destination:</span>
          </label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => onSelectDestination(e.target.value)}
              aria-label="Select Destination"
              className="w-full bg-slate-50 border-2 border-slate-300 hover:border-gov-navy focus:border-gov-navy rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none transition cursor-pointer shadow-inner"
            >
              {filteredDestinations.map(d => {
                const { status } = calculateDCCMetrics(d);
                const statusBadge = status === 'CRITICAL' ? '🔴 Heavily Crowded' : status === 'MODERATE' ? '🟡 Moderate' : '🟢 Low Crowds';
                return (
                  <option key={d.id} value={d.id}>
                    {statusBadge} • {d.name} ({d.district.split(',')[0]})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="md:col-span-6">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
            Filter by Destination Type:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isActive = categoryFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategoryFilter(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Travel Vibe Preferences */}
      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold uppercase">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gov-navy" />
          <span>Travel Preferences:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {preferenceTags.map((tag) => {
            const isHigh = userPreferences[tag.idx] >= 0.7;
            return (
              <button
                key={tag.key}
                onClick={() => togglePreferenceTag(tag.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isHigh
                    ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-600 font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                {tag.icon}
                <span>{tag.label}</span>
                {isHigh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 inline-block" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
