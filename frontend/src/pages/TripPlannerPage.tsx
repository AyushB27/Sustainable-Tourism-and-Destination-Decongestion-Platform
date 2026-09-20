import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Leaf,
  Printer,
  Copy,
  Share2,
  ChevronDown,
  X,
  Search,
  Navigation,
  Route as RouteIcon,
  Trees,
  Pencil,
  Clock
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { apiPost } from '../lib/api';
import {
  orderRoundTrip,
  buildTripTimeline,
  rankTwinCandidates,
  estimateRouteCarbonKg,
  calculateDCCMetrics
} from '../lib/engine';
import { TRANSLATIONS } from '../lib/i18n';
import type { Destination, DCCStatus } from '../types';

type StyleKey = 'scenic' | 'budget' | 'adventure' | 'family';

const statusDotColor = (status: DCCStatus) =>
  status === 'CRITICAL' ? 'bg-rose-500' : status === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500';

const localeMap: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillSpotId = searchParams.get('spotId') || searchParams.get('spot');

  const { destinations, promotions, language } = useCorridorStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(localeMap[language] || 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // ── Input state ──
  const [selectedSpotIds, setSelectedSpotIds] = useState<string[]>(
    prefillSpotId && destinations.some(d => d.id === prefillSpotId) ? [prefillSpotId] : []
  );
  const [spotsDropdownOpen, setSpotsDropdownOpen] = useState(false);
  const [spotsSearch, setSpotsSearch] = useState('');
  const [activeStyles, setActiveStyles] = useState<Set<StyleKey>>(new Set());

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 2);
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndDate.toISOString().split('T')[0]);

  // ── Location state ──
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

  // ── Output state ──
  const [generated, setGenerated] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [backendPlanStatus, setBackendPlanStatus] = useState<'idle' | 'loading' | 'connected' | 'offline'>('idle');
  const [backendDays, setBackendDays] = useState<any[]>([]);

  useEffect(() => {
    if (!generated || selectedSpotIds.length === 0) return;
    setBackendPlanStatus('loading');
    
    const activeStyle = Array.from(activeStyles)[0] || 'scenic';
    apiPost('/api/itinerary/plan', {
      travel_date: startDate,
      duration: Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1),
      travel_style: activeStyle,
      destination_id: selectedSpotIds[0],
      destinations: selectedSpotIds
    })
    .then(data => {
      setBackendPlanStatus('connected');
      const planObj = data.plan || data;
      if (planObj && planObj.itinerary_days && Array.isArray(planObj.itinerary_days)) {
        setBackendDays(planObj.itinerary_days);
      }
    })
    .catch(() => {
      setBackendPlanStatus('offline');
    });
  }, [generated, selectedSpotIds, startDate, endDate, activeStyles]);

  const resetGenerated = () => {
    if (generated) setGenerated(false);
  };

  const styleTags: Array<{ key: StyleKey; label: string; icon: string }> = [
    { key: 'scenic', label: t.dpStyleScenic, icon: '🏔️' },
    { key: 'budget', label: t.dpStyleBudget, icon: '💰' },
    { key: 'adventure', label: t.dpStyleAdventure, icon: '🥾' },
    { key: 'family', label: t.dpStyleFamily, icon: '👨‍👩‍👧‍👦' }
  ];

  const toggleStyle = (key: StyleKey) => {
    setActiveStyles(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    resetGenerated();
  };

  const toggleSpot = (id: string) => {
    setSelectedSpotIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    resetGenerated();
  };

  const filteredDestinations = useMemo(() => {
    const q = spotsSearch.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(d => d.name.toLowerCase().includes(q) || d.district.toLowerCase().includes(q));
  }, [destinations, spotsSearch]);

  const selectedSpots = useMemo(
    () => selectedSpotIds.map(id => destinations.find(d => d.id === id)).filter((d): d is Destination => Boolean(d)),
    [selectedSpotIds, destinations]
  );

  const totalDays = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
  }, [startDate, endDate]);

  const handlePlanTrip = () => {
    if (selectedSpots.length === 0) return;

    if (locationStatus === 'granted' || locationStatus === 'denied') {
      setGenerated(true);
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setGenerated(true);
      return;
    }

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords([pos.coords.latitude, pos.coords.longitude]);
        setLocationStatus('granted');
        setGenerated(true);
      },
      () => {
        setLocationStatus('denied');
        setGenerated(true);
      },
      { timeout: 6000, maximumAge: 300000 }
    );
  };

  // ── Core plan generation: round-trip timeline + eco-friendly twin timeline ──
  const plan = useMemo(() => {
    if (!generated || selectedSpots.length === 0) return null;

    const prefsToUse = activeStyles.size > 0
      ? ((() => {
          const map: Record<StyleKey, number> = { scenic: 0, budget: 1, adventure: 2, family: 3 };
          const vec: [number, number, number, number] = [0.4, 0.4, 0.4, 0.4];
          activeStyles.forEach(s => { vec[map[s]] = 0.95; });
          return vec;
        })())
      : undefined;

    // 1. Standard round-trip order of the user's chosen spots
    const original = orderRoundTrip(selectedSpots, userCoords);

    // 2. Replace each stop with its best available (not already used) low-crowd twin
    const originalIds = new Set(selectedSpots.map(s => s.id));
    const usedTwinIds = new Set<string>();
    const twinMap = new Map<string, Destination>();
    const originalByTwinId = new Map<string, Destination>();

    original.orderedSpots.forEach(spot => {
      const ranked = rankTwinCandidates(spot, destinations, prefsToUse, promotions);
      // Guard: only swap to a twin that is within 150 km of the original spot.
      // This prevents picking a semantically similar but geographically distant destination
      // that would make the eco route longer (and more CO2) than the original.
      const pick = ranked.find(c => {
        if (originalIds.has(c.destination.id) || usedTwinIds.has(c.destination.id)) return false;
        const dist = Math.sqrt(
          Math.pow(c.destination.coordinates[0] - spot.coordinates[0], 2) +
          Math.pow(c.destination.coordinates[1] - spot.coordinates[1], 2)
        ) * 111; // rough degree→km conversion
        return dist <= 150;
      });
      if (pick) {
        usedTwinIds.add(pick.destination.id);
        twinMap.set(spot.id, pick.destination);
        originalByTwinId.set(pick.destination.id, spot);
      } else {
        twinMap.set(spot.id, spot); // No suitable nearby twin — keep original
      }
    });

    const ecoSpots = original.orderedSpots.map(spot => twinMap.get(spot.id)!);

    // 3. Re-optimize round-trip order for the eco (twin) spot set
    const eco = orderRoundTrip(ecoSpots, userCoords);

    const originalCo2 = estimateRouteCarbonKg(original.totalDistanceKm);
    const ecoCo2 = estimateRouteCarbonKg(eco.totalDistanceKm);
    const co2Saved = Number((originalCo2 - ecoCo2).toFixed(1));

    const tripTimeline = buildTripTimeline(original.orderedSpots, startDate, totalDays);
    const ecoTimeline = buildTripTimeline(eco.orderedSpots, startDate, totalDays);

    const crowdReductions = original.orderedSpots.map(spot => {
      const twin = twinMap.get(spot.id)!;
      if (twin.id === spot.id) return 0;
      const origDcc = calculateDCCMetrics(spot).dccScore;
      const twinDcc = calculateDCCMetrics(twin).dccScore;
      return Math.max(0, Math.round((1 - twinDcc / Math.max(0.01, origDcc)) * 100));
    });
    const avgCrowdReduction = crowdReductions.length
      ? Math.round(crowdReductions.reduce((a, b) => a + b, 0) / crowdReductions.length)
      : 0;

    return { original, eco, originalByTwinId, tripTimeline, ecoTimeline, originalCo2, ecoCo2, co2Saved, avgCrowdReduction };
  }, [generated, selectedSpots, userCoords, activeStyles, destinations, promotions, startDate, totalDays]);

  const buildSummaryText = (): string => {
    if (!plan) return '';
    return [
      `🌿 EcoRoute Bharat — ${t.ppTitle}`,
      `${t.ppSummaryDates}: ${startDate} → ${endDate}`,
      '',
      `${t.ppSummaryOriginalRoute}: ${plan.original.orderedSpots.map(s => s.name).join(' → ')}`,
      `${t.ppSummaryDistance}: ${plan.original.totalDistanceKm} ${t.ppKmSuffix} · ${t.ppSummaryCo2}: ${plan.originalCo2} kg`,
      '',
      `${t.ppSummaryEcoRoute}: ${plan.eco.orderedSpots.map(s => s.name).join(' → ')}`,
      `${t.ppSummaryDistance}: ${plan.eco.totalDistanceKm} ${t.ppKmSuffix} · ${t.ppSummaryCo2}: ${plan.ecoCo2} kg`,
      '',
      `${t.ppSummaryCo2Saved}: ${plan.co2Saved} kg CO2e`
    ].join('\n');
  };

  const handleCopy = () => {
    const text = buildSummaryText();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(t.ppCopiedBtn);
      setTimeout(() => setCopyStatus(null), 2500);
    }).catch(() => {});
  };

  const handleWhatsApp = () => {
    const text = buildSummaryText();
    if (!text) return;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renderSpotPill = (spot: Destination) => {
    const status = calculateDCCMetrics(spot).status;
    return (
      <div key={spot.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        <img src={spot.imageUrl} alt={spot.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotColor(status)}`} />
            <span className="text-xs font-bold text-slate-900 truncate">{spot.name}</span>
          </div>
          <span className="text-[10px] text-slate-500">{spot.district}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ── HEADER ── */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-extrabold text-gov-navy uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.ppEyebrow}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Calendar className="w-7 h-7 text-gov-navy shrink-0" />
          <span>{t.ppTitle}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          {t.ppSubtitle}
        </p>
      </div>

      {/* ── PLAN TRIP INPUT CARD ── */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preferences */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">{t.ppPreferencesLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {styleTags.map(tag => {
                const active = activeStyles.has(tag.key);
                return (
                  <button
                    key={tag.key}
                    type="button"
                    onClick={() => toggleStyle(tag.key)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-1.5 ${
                      active
                        ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span className="text-[11px] font-bold leading-tight">{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection of spots */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">{t.ppSpotsLabel}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSpotsDropdownOpen(o => !o)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              >
                <span className={selectedSpots.length === 0 ? 'text-slate-400 font-medium' : ''}>
                  {selectedSpots.length === 0 ? t.ppSpotsPlaceholder : `${selectedSpots.length} ${t.ppSelectedSuffix}`}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${spotsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {spotsDropdownOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white border-2 border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto">
                  <div className="p-2 sticky top-0 bg-white border-b border-slate-100 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      value={spotsSearch}
                      onChange={e => setSpotsSearch(e.target.value)}
                      placeholder={t.ppSpotsSearchPlaceholder}
                      className="w-full text-xs focus:outline-none"
                    />
                  </div>
                  {filteredDestinations.map(d => (
                    <label
                      key={d.id}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpotIds.includes(d.id)}
                        onChange={() => toggleSpot(d.id)}
                        className="accent-gov-navy"
                      />
                      <span className="font-semibold text-slate-800 flex-1 truncate">{d.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{d.district}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {selectedSpots.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedSpots.map(s => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-1 rounded-lg"
                  >
                    {s.name}
                    <button type="button" onClick={() => toggleSpot(s.id)} className="hover:text-emerald-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">{t.ppScheduleLabel}</label>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">{t.ppStartDateLabel}</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); resetGenerated(); }}
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">{t.ppEndDateLabel}</span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={e => { setEndDate(e.target.value); resetGenerated(); }}
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Generate action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {locationStatus === 'requesting' && <span>{t.ppLocationRequesting}</span>}
            {locationStatus === 'granted' && <span>{t.ppLocationGranted}</span>}
            {locationStatus === 'denied' && <span>{t.ppLocationFallback}</span>}
            {locationStatus === 'idle' && selectedSpots.length === 0 && <span>{t.ppSelectSpotsHint}</span>}
          </div>
          <button
            type="button"
            onClick={handlePlanTrip}
            disabled={selectedSpots.length === 0 || locationStatus === 'requesting'}
            className="bg-gov-gold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-gov-navy font-black text-sm px-8 py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{locationStatus === 'requesting' ? t.ppLocationRequesting : t.ppGenerateBtn}</span>
          </button>
        </div>
      </div>

      {/* ── OUTPUT ── */}
      {plan && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">{t.ppOutputEyebrow}</span>
            <button
              type="button"
              onClick={() => setGenerated(false)}
              className="text-xs font-bold text-slate-500 hover:text-gov-navy flex items-center gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              {t.ppEditPlanBtn}
            </button>
          </div>

          {/* Trip Timeline */}
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <RouteIcon className="w-5 h-5 text-gov-navy" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">{t.ppTripTimelineTitle}</h2>
            </div>
            <p className="text-xs text-slate-500">{t.ppTripTimelineDesc}</p>

            {/* Round-trip route banner */}
            <div className="bg-gov-navy/5 border border-gov-navy/20 rounded-2xl px-4 py-3 space-y-2">
              <div className="text-[11px] font-extrabold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                <RouteIcon className="w-3.5 h-3.5" />
                Round-Trip Route
              </div>
              <div className="flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-800">
                <span className="text-[10px] bg-gov-navy text-white px-2 py-0.5 rounded font-bold">START</span>
                <span className="text-slate-400">→</span>
                {plan.original.orderedSpots.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <span className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-[11px]">{s.name}</span>
                    {i < plan.original.orderedSpots.length - 1 && <span className="text-slate-400">→</span>}
                  </React.Fragment>
                ))}
                <span className="text-slate-400">→</span>
                <span className="text-[10px] bg-gov-navy text-white px-2 py-0.5 rounded font-bold">RETURN</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                <span>📍 <strong className="text-slate-700">{plan.original.totalDistanceKm} km</strong> total distance</span>
                <span>🗓️ <strong className="text-slate-700">{totalDays}</strong> day{totalDays > 1 ? 's' : ''}</span>
                <span>📍 <strong className="text-slate-700">{plan.original.orderedSpots.length}</strong> stop{plan.original.orderedSpots.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="space-y-3">
              {plan.tripTimeline.map((day, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === plan.tripTimeline.length - 1;
                let emptyLabel = '';
                let emptyIcon = '';
                if (day.spots.length === 0) {
                  if (isLast && totalDays > 1) {
                    emptyLabel = 'Return journey & departure day';
                    emptyIcon = '🚌';
                  } else if (isFirst) {
                    emptyLabel = 'Arrival & check-in day';
                    emptyIcon = '🏨';
                  } else {
                    emptyLabel = 'Exploration & leisure day';
                    emptyIcon = '🌄';
                  }
                }
                return (
                  <div key={day.dayNumber} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-[11px] font-bold text-gov-navy mb-2">
                      {t.ppDayLabel} {day.dayNumber} · {formatDate(day.date)}
                    </div>
                    {day.spots.length === 0 ? (
                      <span className="text-[11px] text-slate-500 italic flex items-center gap-1.5">
                        <span>{emptyIcon}</span>
                        {emptyLabel}
                      </span>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {day.spots.map(renderSpotPill)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eco-Friendly Timeline */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900">{t.ppEcoTimelineTitle}</h2>
            </div>
            <p className="text-xs text-slate-600">{t.ppEcoTimelineDesc}</p>
            <div className="space-y-3">
              {backendPlanStatus === 'loading' ? (
                <div className="text-center p-8 text-slate-500 text-sm flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating AI off-peak itinerary...</span>
                </div>
              ) : backendDays.length > 0 ? (
                backendDays.map((dayPlan: any, dIdx: number) => (
                  <div key={dIdx} className="border border-emerald-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-emerald-700 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between flex-wrap gap-2">
                      <span>{dayPlan.day_label || dayPlan.day || `Day ${dIdx + 1}`}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-100 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                          - {dayPlan.carbon_saved_today_kg || 17.1} kg CO₂e Saved
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white/80 space-y-3">
                      {dayPlan.slots && dayPlan.slots.map((slot: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className={`flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 rounded-xl border text-xs ${
                            sIdx === 0 ? 'bg-slate-50 border-slate-200' : sIdx === 1 ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-gov-navy flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {slot.time}
                              {slot.location && <span className="text-slate-400 font-normal">| {slot.location}</span>}
                            </span>
                            <strong className="text-slate-900 text-sm block">{slot.title}</strong>
                            <p className="text-slate-600 text-xs leading-relaxed">{slot.desc}</p>
                          </div>
                          {slot.badge && (
                            <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] self-start sm:self-auto shrink-0 border ${
                              sIdx === 0 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : sIdx === 1 ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-slate-200 text-slate-800 border-slate-300'
                            }`}>
                              {slot.badge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                plan.ecoTimeline.map(day => (
                  <div key={day.dayNumber} className="p-3.5 bg-white/80 rounded-2xl border border-emerald-200">
                    <div className="text-[11px] font-bold text-emerald-800 mb-2">
                      {t.ppDayLabel} {day.dayNumber} - {formatDate(day.date)}
                    </div>
                    {day.spots.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">{t.ppFreeDayLabel}</span>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {day.spots.map(spot => {
                          const original = plan.originalByTwinId.get(spot.id);
                          return (
                            <div key={spot.id} className="space-y-1">
                              {renderSpotPill(spot)}
                              {original ? (
                                <span className="text-[10px] text-emerald-700 font-semibold pl-1">
                                  {t.ppReplacesLabel} {original.name}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 pl-1">{t.ppNoTwinFound}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary of CO2 & Details */}
          <div className="bg-slate-950 text-white rounded-3xl border-2 border-slate-800 p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-black">{t.ppSummaryTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{t.ppSummaryOriginalRoute}</span>
                <div className="text-xs text-slate-200">{t.ppSummaryDistance}: <strong className="text-white">{plan.original.totalDistanceKm} {t.ppKmSuffix}</strong></div>
                <div className="text-xs text-slate-200">{t.ppSummaryCo2}: <strong className="text-white">{plan.originalCo2} kg</strong></div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">{t.ppSummaryEcoRoute}</span>
                <div className="text-xs text-slate-200">{t.ppSummaryDistance}: <strong className="text-white">{plan.eco.totalDistanceKm} {t.ppKmSuffix}</strong></div>
                <div className="text-xs text-slate-200">{t.ppSummaryCo2}: <strong className="text-white">{plan.ecoCo2} kg</strong></div>
                <div className="text-xs text-slate-200">{t.ppSummaryCrowdReduction}: <strong className="text-emerald-300">{plan.avgCrowdReduction}%</strong></div>
              </div>
            </div>

            <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-200">{t.ppSummaryCo2Saved}</span>
              <span className="text-xl font-black text-emerald-300">
                {plan.co2Saved >= 0 ? '-' : '+'}{Math.abs(plan.co2Saved)} kg CO₂e
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/10">
              <span>{t.ppSummaryDates}: <strong className="text-slate-200">{formatDate(startDate)} → {formatDate(endDate)}</strong></span>
              <span>
                {t.ppSummaryPreferences}: <strong className="text-slate-200">
                  {activeStyles.size > 0 ? styleTags.filter(s => activeStyles.has(s.key)).map(s => s.label).join(', ') : '—'}
                </strong>
              </span>
            </div>
          </div>

          {/* Sharable Print */}
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gov-navy" />
              {t.ppSharePrintTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white rounded-xl text-xs font-bold transition"
              >
                <Printer className="w-3.5 h-3.5" />
                {t.ppPrintBtn}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                <Copy className="w-3.5 h-3.5" />
                {copyStatus || t.ppCopyBtn}
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                {t.ppWhatsAppBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
