import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  Car 
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics, calculateCosineSimilarity } from '../lib/engine';
import type { DestinationCategory } from '../types';

export const DiscoverPage: React.FC = () => {

  const {
    destinations,
    userPreferences,
    togglePreferenceTag,
    currentUser
  } = useCorridorStore();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | DestinationCategory>('ALL');
  const [distanceFilter, setDistanceFilter] = useState<'ALL' | 'DAY_TRIP' | 'WEEKEND'>('ALL');
  const [boostUnderVisitedOnly, setBoostUnderVisitedOnly] = useState(false);

  // Style tags corresponding to vector indices [scenic, budget, adventure, family]
  const styleTags: Array<{ key: 'scenic' | 'budget' | 'adventure' | 'family'; label: string; icon: string; index: number }> = [
    { key: 'scenic', label: 'Scenic Vistas', icon: '🏔️', index: 0 },
    { key: 'budget', label: 'Budget-Friendly', icon: '💰', index: 1 },
    { key: 'adventure', label: 'Adventure & Treks', icon: '🥾', index: 2 },
    { key: 'family', label: 'Family Comfort', icon: '👨‍👩‍👧‍👦', index: 3 }
  ];

  // Algorithmic Feed Ranking (§4.5)
  // Blends: user travel style vector (45%) + crowd inverse (30%) + under-visited promotion boost (25%)
  const rankedDestinations = useMemo(() => {
    let pool = [...destinations];

    if (categoryFilter !== 'ALL') {
      pool = pool.filter(d => d.category === categoryFilter);
    }

    if (distanceFilter === 'DAY_TRIP') {
      pool = pool.filter(d => d.distanceKmFromHub <= 110);
    } else if (distanceFilter === 'WEEKEND') {
      pool = pool.filter(d => d.distanceKmFromHub > 110);
    }

    if (boostUnderVisitedOnly) {
      pool = pool.filter(d => d.isUnderVisited);
    }

    const scored = pool.map(spot => {
      const metrics = calculateDCCMetrics(spot);
      const sim = calculateCosineSimilarity(userPreferences, spot.features);
      const crowdScoreInverse = Math.max(0, 1.0 - metrics.dccScore);
      
      // Deliberate algorithmic promotion weight for under-visited destinations (§4.5)
      const underVisitedBoost = spot.isUnderVisited ? 0.28 : 0.0;

      // Final Rank Score (0.0 to 1.0+)
      const finalScore = (0.45 * sim) + (0.30 * crowdScoreInverse) + (0.25 * (spot.isUnderVisited ? 1.0 : 0.3));

      return {
        spot,
        metrics,
        sim,
        finalScore: Number(finalScore.toFixed(3)),
        underVisitedBoost
      };
    });

    // Sort by highest algorithmic rank descending
    scored.sort((a, b) => b.finalScore - a.finalScore);
    return scored;
  }, [destinations, userPreferences, categoryFilter, distanceFilter, boostUnderVisitedOnly]);

  const categories: Array<'ALL' | DestinationCategory> = ['ALL', 'Hill Station', 'Coastal', 'Heritage', 'Pilgrimage'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-gov-navy uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated Just For You</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Personalized & Hidden Gem Escapes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Discover breathtaking, peaceful getaways matched to your travel vibe. Skip the highway gridlock and enjoy queue-free holidays across Maharashtra.
          </p>
        </div>

        {/* User Identity Context */}
        <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl flex items-center gap-3 text-xs self-start md:self-auto">
          <div className="w-8 h-8 rounded-full bg-gov-navy text-amber-300 font-bold flex items-center justify-center">
            🧭
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Personalizing From</span>
            <strong className="text-slate-900">{currentUser.homeCity || 'Mumbai/Pune Hub'}, {currentUser.homeState || 'MH'}</strong>
          </div>
        </div>
      </div>

      {/* ── FILTER TOOLBAR ── */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 space-y-4 shadow-sm">
        {/* Style Vector Tap-Cards (§4.3, §4.5) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            What kind of holiday are you looking for? (Tap to select):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {styleTags.map(tag => {
              const active = userPreferences[tag.index] >= 0.70;
              return (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => togglePreferenceTag(tag.key)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    active
                      ? 'bg-gov-navy text-white border-gov-navy shadow-sm ring-2 ring-gov-navy/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tag.icon}</span>
                    <div>
                      <span className="font-bold text-xs block">{tag.label}</span>
                      <span className={`text-[10px] ${active ? 'text-amber-300' : 'text-slate-400'}`}>
                        {active ? 'Priority (High)' : 'Standard'}
                      </span>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-amber-300' : 'bg-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Category & Distance Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-bold">
            <span className="text-slate-400 text-[11px] mr-1 shrink-0">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl shrink-0 transition ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          {/* Distance & Under-visited toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setDistanceFilter(distanceFilter === 'ALL' ? 'DAY_TRIP' : distanceFilter === 'DAY_TRIP' ? 'WEEKEND' : 'ALL')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Distance: <strong>{distanceFilter === 'ALL' ? 'Any' : distanceFilter === 'DAY_TRIP' ? 'Day-Trip (<110km)' : 'Weekend (>110km)'}</strong>
            </button>

            <button
              type="button"
              onClick={() => setBoostUnderVisitedOnly(!boostUnderVisitedOnly)}
              className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1 ${
                boostUnderVisitedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>🌿 Under-Visited Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── RANKED FEED GRID ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
          <span>Found {rankedDestinations.length} destinations matching your travel vibe</span>
          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            ✨ Ranked by calmest crowds & best experience
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedDestinations.map(({ spot, metrics, sim }) => {
            const statusConfig = {
              OPTIMAL: {
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                icon: <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />,
                text: 'Optimal Headroom'
              },
              MODERATE: {
                badge: 'bg-amber-100 text-amber-900 border-amber-300',
                icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
                text: 'Moderate Crowd'
              },
              CRITICAL: {
                badge: 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse',
                icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
                text: 'Heavily Crowded'
              }
            }[metrics.status];

            const matchPct = Math.round(sim * 100);

            return (
              <div
                key={spot.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-gov-navy transition overflow-hidden shadow-sm flex flex-col justify-between group"
              >
                <div>
                  {/* Hero card image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Hidden Gem Badge */}
                    {spot.isUnderVisited ? (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow flex items-center gap-1">
                        🌿 Hidden Gem • Peaceful
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-xl shadow">
                        {spot.category}
                      </span>
                    )}

                    <span className="absolute top-3 right-3 bg-gov-navy/90 backdrop-blur-sm text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-xl border border-amber-300/30">
                      {matchPct}% Match
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h2 className="font-black text-lg leading-tight drop-shadow">{spot.name}</h2>
                      <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-300" />
                        {spot.district}, {spot.state}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 text-xs">
                    {/* Status Pill */}
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold ${statusConfig.badge}`}>
                      <div className="flex items-center gap-1.5">
                        {statusConfig.icon}
                        <span>{statusConfig.text}</span>
                      </div>
                      <span className="font-mono text-[11px]">
                        {metrics.waitTimeMinutes}m wait
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {spot.tagline}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        {spot.travelTimeFromHub}
                      </span>
                      <span>{spot.distanceKmFromHub} km from hub</span>
                    </div>

                    {/* Best for tags */}
                    <div className="flex flex-wrap gap-1">
                      {spot.bestFor.map((bf, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
                          {bf}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{metrics.status === 'OPTIMAL' ? 'Queue-Free Entry' : metrics.status === 'MODERATE' ? 'Moderate Inflow' : 'Peak Waiting Times'}</span>
                  </span>
                  <Link
                    to={`/spot/${spot.id}`}
                    className="inline-flex items-center gap-1 bg-gov-navy hover:bg-gov-navy-light text-amber-300 font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
                  >
                    <span>View Spot Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
