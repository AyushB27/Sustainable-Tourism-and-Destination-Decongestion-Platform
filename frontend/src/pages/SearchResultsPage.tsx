import React, { useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, Landmark, MapPin, Building2, ArrowRight, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics } from '../lib/engine';
import { GlobalSearchBox } from '../components/common/GlobalSearchBox';
import type { SearchMatch, DCCStatus } from '../types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { destinations } = useCorridorStore();
  const query = searchParams.get('q') || '';

  // Build 3-tier searchable entities
  const searchableItems = useMemo(() => {
    const items: SearchMatch[] = [];

    // Tier 1: Spots
    destinations.forEach(d => {
      const { status } = calculateDCCMetrics(d);
      items.push({
        id: `spot-${d.id}`,
        title: d.name,
        subtitle: `${d.category} • ${d.district}, ${d.state} • ${d.tagline}`,
        type: 'spot',
        route: `/spot/${d.id}`,
        category: d.category,
        badge: status,
        status: status as DCCStatus
      });
    });

    // Tier 2: Districts
    const districts = Array.from(new Set(destinations.map(d => d.district)));
    districts.forEach(dist => {
      const count = destinations.filter(d => d.district === dist).length;
      items.push({
        id: `district-${dist}`,
        title: `${dist} District`,
        subtitle: `Exhaustive inventory of all ${count} monitored spots in ${dist} District`,
        type: 'district',
        route: `/region/district/${encodeURIComponent(dist)}`,
        badge: `${count} destinations`
      });
    });

    // Tier 3: States
    const states = Array.from(new Set(destinations.map(d => d.state)));
    states.forEach(st => {
      const count = destinations.filter(d => d.state === st).length;
      items.push({
        id: `state-${st}`,
        title: `${st} State`,
        subtitle: `All ${count} monitored eco-tourism hotspots across ${st}`,
        type: 'state',
        route: `/region/state/${encodeURIComponent(st)}`,
        badge: `${count} destinations`
      });
    });

    return items;
  }, [destinations]);

  const fuse = useMemo(() => {
    return new Fuse(searchableItems, {
      keys: ['title', 'subtitle', 'category', 'type'],
      threshold: 0.40,
      ignoreLocation: true
    });
  }, [searchableItems]);

  const matches = useMemo(() => {
    if (!query.trim()) return searchableItems;
    return fuse.search(query.trim()).map(r => r.item);
  }, [query, fuse, searchableItems]);

  const spotMatches = matches.filter(m => m.type === 'spot');
  const districtMatches = matches.filter(m => m.type === 'district');
  const stateMatches = matches.filter(m => m.type === 'state');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Search Results
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              {query ? `Results for “${query}”` : 'All Searchable Destinations & Regions'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Found {matches.length} matching destinations, districts, and states across Maharashtra
            </p>
          </div>
          <button
            onClick={() => navigate('/discover')}
            className="text-xs font-bold text-gov-navy bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl self-start sm:self-auto transition shadow-sm"
          >
            Switch to Personalized Discover Feed →
          </button>
        </div>

        <div className="max-w-2xl">
          <GlobalSearchBox variant="hero" placeholder="Search another destination or district…" />
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No destinations matched &ldquo;{query}&rdquo;</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for hill stations like &ldquo;Matheran&rdquo;, coastal hubs like &ldquo;Alibaug&rdquo;, or regional districts like &ldquo;Raigad&rdquo; and &ldquo;Pune&rdquo;.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/region/state/Maharashtra')}
              className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl hover:bg-gov-navy-light transition"
            >
              Browse All Maharashtra Spots
            </button>
            <button
              onClick={() => navigate('/discover')}
              className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Go to Discover Feed
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Spot Matches */}
          {spotMatches.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  <span>Destinations ({spotMatches.length})</span>
                </h2>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Tier 1 Direct Spots
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotMatches.map(m => {
                  const rawId = m.id.replace('spot-', '');
                  const dest = destinations.find(d => d.id === rawId);
                  if (!dest) return null;
                  const metrics = calculateDCCMetrics(dest);
                  const statusConfig = {
                    OPTIMAL: {
                      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
                      label: 'Low Crowds • Comfortable'
                    },
                    MODERATE: {
                      badge: 'bg-amber-100 text-amber-800 border-amber-300',
                      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
                      label: 'Moderate Traffic'
                    },
                    CRITICAL: {
                      badge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
                      icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
                      label: 'Critical Overcrowding'
                    }
                  }[metrics.status];

                  return (
                    <Link
                      key={m.id}
                      to={m.route}
                      className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-gov-navy transition overflow-hidden shadow-sm hover:shadow-md flex flex-col"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-slate-200">
                          {dest.category}
                        </span>
                        <div className="absolute bottom-2 left-3 right-3 text-white">
                          <h3 className="font-extrabold text-base leading-snug drop-shadow">{dest.name}</h3>
                          <p className="text-[11px] text-slate-200 drop-shadow flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {dest.district}, {dest.state}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <p className="text-xs text-slate-600 line-clamp-2">{dest.tagline}</p>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${statusConfig.badge}`}>
                            {statusConfig.icon}
                            <span>{statusConfig.label}</span>
                          </div>
                          <span className="text-xs font-bold text-gov-navy flex items-center gap-1 group-hover:translate-x-0.5 transition">
                            View Spot <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section 2: District Matches */}
          {districtMatches.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>Districts ({districtMatches.length})</span>
                </h2>
                <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">
                  Tier 2 Exhaustive Listings
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {districtMatches.map(m => (
                  <Link
                    key={m.id}
                    to={m.route}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-500 transition shadow-sm hover:shadow flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition">
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{m.subtitle}</p>
                    </div>
                    <span className="shrink-0 ml-3 bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-sky-200 flex items-center gap-1">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: State Matches */}
          {stateMatches.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>States ({stateMatches.length})</span>
                </h2>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                  Tier 3 Full State View
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stateMatches.map(m => (
                  <Link
                    key={m.id}
                    to={m.route}
                    className="p-5 bg-gradient-to-r from-gov-navy to-slate-900 text-white rounded-2xl shadow flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                        State Corridor Coverage
                      </span>
                      <h3 className="font-extrabold text-lg mt-0.5">{m.title}</h3>
                      <p className="text-xs text-slate-300 mt-0.5">{m.subtitle}</p>
                    </div>
                    <span className="bg-white/10 group-hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5">
                      <span>View All Spots</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
