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
import { TRANSLATIONS } from '../../lib/i18n';

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
    togglePreferenceTag,
    language
  } = useCorridorStore();

  const t = TRANSLATIONS[language];

  const categories: { key: 'ALL' | DestinationCategory; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    { key: 'ALL', labelEn: 'All Corridors', labelHi: 'सभी गंतव्य', icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: 'Hill Station', labelEn: 'Hill Stations', labelHi: 'पर्वतीय स्थल', icon: <Mountain className="w-3.5 h-3.5" /> },
    { key: 'Coastal', labelEn: 'Coastal / Beaches', labelHi: 'तटीय व समुद्र तट', icon: <Palmtree className="w-3.5 h-3.5" /> },
    { key: 'Heritage', labelEn: 'Heritage Forts', labelHi: 'ऐतिहासिक किले', icon: <Landmark className="w-3.5 h-3.5" /> },
    { key: 'Pilgrimage', labelEn: 'Pilgrimage Sites', labelHi: 'तीर्थ स्थल', icon: <Church className="w-3.5 h-3.5" /> },
  ];

  const preferenceTags: { 
    key: 'scenic' | 'budget' | 'adventure' | 'family'; 
    labelEn: string;
    labelHi: string;
    icon: React.ReactNode; 
    idx: number;
  }[] = [
    { key: 'scenic', labelEn: 'Scenic Views', labelHi: 'प्राकृतिक दृश्य', icon: <Compass className="w-3.5 h-3.5" />, idx: 0 },
    { key: 'budget', labelEn: 'Budget-Friendly', labelHi: 'किफायती यात्रा', icon: <Wallet className="w-3.5 h-3.5" />, idx: 1 },
    { key: 'adventure', labelEn: 'Trekking & Adventure', labelHi: 'रोमांच व ट्रेकिंग', icon: <Footprints className="w-3.5 h-3.5" />, idx: 2 },
    { key: 'family', labelEn: 'Family Suitable', labelHi: 'पारिवारिक अनुकूल', icon: <Users2 className="w-3.5 h-3.5" />, idx: 3 },
  ];

  const filteredDestinations = categoryFilter === 'ALL'
    ? destinations
    : destinations.filter(d => d.category === categoryFilter);

  return (
    <div className="bg-white rounded-xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Search & Destination Picker */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Destination Dropdown */}
        <div className="md:col-span-6">
          <label className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gov-navy" />
            <span>{t.selectTargetDestination} (गंतव्य का चयन करें)</span>
          </label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => onSelectDestination(e.target.value)}
              aria-label={t.selectTargetDestination}
              className="w-full bg-slate-50 border-2 border-slate-300 hover:border-gov-navy focus:border-gov-navy rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none transition cursor-pointer shadow-inner"
            >
              {filteredDestinations.map(d => {
                const { status, dccScore } = calculateDCCMetrics(d);
                const statusBadge = status === 'CRITICAL' ? '🔴 अतिभारित' : status === 'MODERATE' ? '🟡 मध्यम' : '🟢 अनुकूल';
                return (
                  <option key={d.id} value={d.id}>
                    {statusBadge} • {d.name} ({d.district.split(',')[0]} - DCC {dccScore.toFixed(2)})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="md:col-span-6">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
            {t.corridorFilter} (श्रेणी चयन)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isActive = categoryFilter === cat.key;
              const title = language === 'hi' ? cat.labelHi : cat.labelEn;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategoryFilter(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.icon}
                  <span>{title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vibe Preference Toggles */}
      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold uppercase">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gov-navy" />
          <span>{t.vibePreferences} (प्राथमिकताएँ):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {preferenceTags.map((tag) => {
            const isHigh = userPreferences[tag.idx] >= 0.7;
            const title = language === 'hi' ? tag.labelHi : tag.labelEn;
            return (
              <button
                key={tag.key}
                onClick={() => togglePreferenceTag(tag.key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isHigh
                    ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-600 font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                {tag.icon}
                <span>{title}</span>
                {isHigh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
