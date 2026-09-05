import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, MapPin, Building2, Landmark, Compass, ArrowRight, X } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateDCCMetrics } from '../../lib/engine';
import type { SearchMatch, DCCStatus } from '../../types';

interface GlobalSearchBoxProps {
  variant?: 'hero' | 'nav' | 'compact';
  autoFocus?: boolean;
  placeholder?: string;
  onSelect?: () => void;
  className?: string;
}

export const GlobalSearchBox: React.FC<GlobalSearchBoxProps> = ({
  variant = 'nav',
  autoFocus = false,
  placeholder = 'Search spots, districts (e.g. Raigad), or state…',
  onSelect,
  className = ''
}) => {
  const navigate = useNavigate();
  const { destinations } = useCorridorStore();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build searchable index from destinations across 3 tiers (§2.1)
  const searchableItems = useMemo(() => {
    const items: SearchMatch[] = [];

    // Tier 1: Spots
    destinations.forEach(d => {
      const { status } = calculateDCCMetrics(d);
      items.push({
        id: `spot-${d.id}`,
        title: d.name,
        subtitle: `${d.category} • ${d.district}, ${d.state}`,
        type: 'spot',
        route: `/spot/${d.id}`,
        category: d.category,
        badge: status,
        status: status as DCCStatus
      });
    });

    // Tier 2: Districts (Unique)
    const districts = Array.from(new Set(destinations.map(d => d.district)));
    districts.forEach(dist => {
      const count = destinations.filter(d => d.district === dist).length;
      items.push({
        id: `district-${dist}`,
        title: `${dist} District`,
        subtitle: `Exhaustive list of all ${count} monitored spots in ${dist}`,
        type: 'district',
        route: `/region/district/${encodeURIComponent(dist)}`,
        badge: `${count} spots`
      });
    });

    // Tier 3: States (Unique)
    const states = Array.from(new Set(destinations.map(d => d.state)));
    states.forEach(st => {
      const count = destinations.filter(d => d.state === st).length;
      items.push({
        id: `state-${st}`,
        title: `${st} State`,
        subtitle: `All ${count} monitored corridor destinations across ${st}`,
        type: 'state',
        route: `/region/state/${encodeURIComponent(st)}`,
        badge: `${count} spots`
      });
    });

    return items;
  }, [destinations]);

  // Configure Fuse.js with fuzzy typo-tolerance
  const fuse = useMemo(() => {
    return new Fuse(searchableItems, {
      keys: ['title', 'subtitle', 'category', 'type'],
      threshold: 0.38,
      ignoreLocation: true,
      minMatchCharLength: 1
    });
  }, [searchableItems]);

  // Results grouped across 3 tiers
  const groupedResults = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Default top suggestions
      return {
        spots: searchableItems.filter(i => i.type === 'spot').slice(0, 4),
        districts: searchableItems.filter(i => i.type === 'district').slice(0, 3),
        states: searchableItems.filter(i => i.type === 'state').slice(0, 1)
      };
    }

    const matches = fuse.search(trimmed).map(r => r.item);
    return {
      spots: matches.filter(i => i.type === 'spot').slice(0, 4),
      districts: matches.filter(i => i.type === 'district').slice(0, 3),
      states: matches.filter(i => i.type === 'state').slice(0, 2)
    };
  }, [query, fuse, searchableItems]);

  const flatResults = useMemo(() => {
    return [
      ...groupedResults.spots,
      ...groupedResults.districts,
      ...groupedResults.states
    ];
  }, [groupedResults]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchMatch) => {
    // Record planning destination in session (§4.2)
    if (item.type === 'spot') {
      try {
        sessionStorage.setItem('ecoroute_planning_destination', item.title);
      } catch {
        // ignore
      }
    }
    setIsOpen(false);
    setQuery('');
    navigate(item.route);
    if (onSelect) onSelect();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < flatResults.length) {
      handleSelect(flatResults[activeIndex]);
      return;
    }
    const trimmed = query.trim();
    if (trimmed) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      if (onSelect) onSelect();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Variant styles
  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={`flex items-center transition-all ${
            isHero
              ? 'bg-white rounded-2xl border-2 border-slate-300 shadow-xl focus-within:border-gov-navy focus-within:ring-4 focus-within:ring-gov-navy/10 px-4 py-3'
              : 'bg-slate-50 hover:bg-white rounded-xl border border-slate-300 focus-within:border-gov-navy focus-within:bg-white focus-within:ring-2 focus-within:ring-gov-navy/20 px-3 py-1.5'
          }`}
        >
          <Search className={`shrink-0 text-slate-400 ${isHero ? 'w-6 h-6 mr-3 text-gov-navy' : 'w-4 h-4 mr-2'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            autoFocus={autoFocus}
            onChange={e => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search destinations, districts, or state"
            className={`w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-semibold focus:outline-none ${
              isHero ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 shrink-0"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isHero && (
            <button
              type="submit"
              className="ml-2 bg-gov-navy hover:bg-gov-navy-light text-amber-300 font-bold px-5 py-2 rounded-xl text-sm transition shrink-0 flex items-center gap-1.5 shadow"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* 3-Tier Grouped Autocomplete Dropdown (§2.1) */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 ${
            isHero ? 'p-3' : 'p-2'
          }`}
        >
          {flatResults.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              <Compass className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No matching destinations found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching &ldquo;Pune&rdquo;, &ldquo;Matheran&rdquo;, &ldquo;Raigad&rdquo;, or &ldquo;Maharashtra&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/discover');
                }}
                className="mt-3 inline-flex items-center gap-1 text-xs text-gov-navy font-bold hover:underline"
              >
                Or browse all in Discover Feed →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* TIER 1: SPOTS */}
              {groupedResults.spots.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Landmark className="w-3 h-3 text-emerald-600" />
                      Spots (Direct Destination Pages)
                    </span>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">Tier 1</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {groupedResults.spots.map(item => {
                      const isItemActive = flatResults.indexOf(item) === activeIndex;
                      const statusColor =
                        item.status === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : item.status === 'MODERATE'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300';
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-2 transition ${
                            isItemActive ? 'bg-slate-100 ring-1 ring-slate-300' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                              <span>{item.title}</span>
                              <span className="text-[10px] text-slate-500 font-normal bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                          </div>
                          {item.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TIER 2: DISTRICTS */}
              {groupedResults.districts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3 h-3 text-sky-600" />
                      Districts (Exhaustive Regional Lists)
                    </span>
                    <span className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded">Tier 2</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {groupedResults.districts.map(item => {
                      const isItemActive = flatResults.indexOf(item) === activeIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-2 transition ${
                            isItemActive ? 'bg-slate-100 ring-1 ring-slate-300' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{item.title}</span>
                              <span className="text-[10px] font-normal text-sky-700">regional view</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                            {item.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TIER 3: STATES */}
              {groupedResults.states.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="w-3 h-3 text-indigo-600" />
                      States (All Monitored Corridors)
                    </span>
                    <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">Tier 3</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {groupedResults.states.map(item => {
                      const isItemActive = flatResults.indexOf(item) === activeIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between gap-2 transition ${
                            isItemActive ? 'bg-slate-100 ring-1 ring-slate-300' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {item.title}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                            {item.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer hint */}
              <div className="pt-2 border-t border-slate-100 px-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Press <strong>Enter</strong> for full search results</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="text-gov-navy font-bold hover:underline"
                >
                  View full results →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
