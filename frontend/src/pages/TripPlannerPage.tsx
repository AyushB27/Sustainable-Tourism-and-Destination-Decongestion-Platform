import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics } from '../lib/engine';
import type { TripPlan, TripDayPlan, GreenPass } from '../types';

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefillSpotId = searchParams.get('spotId');

  const {
    destinations,
    addTripPlan,
    addGreenPass,
    currentUser,
    updateUserProfile
  } = useCorridorStore();

  // Wizard Steps (§4.4)
  // Step 1: Destination Mode & Selection (Single vs Multi-Destination)
  // Step 2: Dates & Duration (1 to 7 Days)
  // Step 3: Budget Band
  // Step 4: Group Type
  const [destinationMode, setDestinationMode] = useState<'single' | 'multi'>('single');
  const [selectedSpotId, setSelectedSpotId] = useState<string>(
    prefillSpotId || destinations[0].id
  );
  const [secondarySpotId, setSecondarySpotId] = useState<string>('MAT');
  const [tripDuration, setTripDuration] = useState<number>(3); // Default to 3-day long weekend
  const [startDate, setStartDate] = useState<string>('2026-09-12');
  const [endDate, setEndDate] = useState<string>('2026-09-14');
  const [budgetBand, setBudgetBand] = useState<'₹' | '₹₹' | '₹₹₹'>('₹₹');
  const [groupType, setGroupType] = useState<'solo' | 'couple' | 'family' | 'friends'>('family');

  // Progressive profiling modal trigger if anonymous
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [homeCityInput, setHomeCityInput] = useState(currentUser.homeCity || 'Mumbai');
  const [homeStateInput, setHomeStateInput] = useState(currentUser.homeState || 'Maharashtra');
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(0);

  const primarySpot = destinations.find(d => d.id === selectedSpotId) || destinations[0];
  const secondarySpot = destinations.find(d => d.id === secondarySpotId) || destinations[1];

  // Sync dates when duration changes
  const handleDurationSelect = (days: number) => {
    setTripDuration(days);
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + (days - 1));
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Sync duration when dates are picked manually
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    const start = new Date(val);
    const end = new Date(start);
    end.setDate(start.getDate() + (tripDuration - 1));
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    const start = new Date(startDate);
    const end = new Date(val);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays >= 1 && diffDays <= 14) {
      setTripDuration(Math.min(7, Math.max(1, diffDays)));
    }
  };

  const addDaysToDate = (baseDateStr: string, daysToAdd: number): string => {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().split('T')[0];
  };

  const handleGeneratePlan = (skipAuthCheck = false) => {
    if (!currentUser.isAuthenticated && !skipAuthCheck) {
      setShowSignupPrompt(true);
      return;
    }

    const tripId = `trip-${Date.now().toString(36)}`;
    const primaryMetrics = calculateDCCMetrics(primarySpot);
    const secondaryMetrics = calculateDCCMetrics(secondarySpot);

    const effectiveDays = Math.max(1, Math.min(7, tripDuration));
    const itinerary: TripDayPlan[] = [];

    for (let dayNum = 1; dayNum <= effectiveDays; dayNum++) {
      const isLaterDaysInMultiMode = destinationMode === 'multi' && dayNum > Math.ceil(effectiveDays / 2);
      const spot = isLaterDaysInMultiMode ? secondarySpot : primarySpot;
      const metrics = isLaterDaysInMultiMode ? secondaryMetrics : primaryMetrics;
      const currentDate = addDaysToDate(startDate, dayNum - 1);

      // Curate activities dynamically based on day index and real spot metadata
      let morning = '';
      let afternoon = '';
      let evening = '';
      let transitTip = '';

      if (dayNum === 1) {
        morning = `Arrival via ${spot.gettingThere?.primaryRoute || 'State Highway'}; enjoy morning fresh air and introductory valley panoramas.`;
        afternoon = `Scenic exploration of ${spot.highlights[0] || 'local viewpoint'} during optimal off-peak hours.`;
        evening = `Sunset walk along ${spot.highlights[1] || 'clifftop trail'}; authentic local Maharashtrian dinner.`;
        transitTip = `Depart early morning (before 8:00 AM) to bypass main toll plaza queues.`;
      } else if (dayNum === 2) {
        morning = `Sunrise trail to ${spot.majorAttractions?.[0]?.name || 'local lake'}; crystal-clear morning photography.`;
        afternoon = `Experience ${spot.highlights[2] || 'nature reserve / agro-tourism farm'} with organic lunch.`;
        evening = `Visit local village market for fresh local produce & handicrafts; cozy dinner.`;
        transitTip = `Local eco-shuttle available; zero-emission transit within town perimeter.`;
      } else if (dayNum === 3) {
        morning = isLaterDaysInMultiMode
          ? `Scenic corridor transit to ${secondarySpot.name}; check in at serene forest lodge.`
          : `Morning hike to ${spot.majorAttractions?.[1]?.name || 'historical vantage point'} away from tour groups.`;
        afternoon = `Relaxing boat ride or leisurely walk around ${spot.highlights[0] || 'scenic lake waters'}.`;
        evening = `Traditional Maharashtrian dinner under starlit Sahyadri skies.`;
        transitTip = `Mid-day transit has minimal traffic load compared to weekend peak hours.`;
      } else if (dayNum === 4) {
        morning = `Early morning birdwatching & meditation walk at ${spot.majorAttractions?.[2]?.name || 'secluded forest trail'}.`;
        afternoon = `Agro-tourism farm tour: organic fruit picking & authentic wood-fired culinary tasting.`;
        evening = `Sunset viewing from quiet cliffside ridge; artisan tea tasting.`;
        transitTip = `Corridor bypass routes recommended by EcoRoute GIS ensure zero slowdowns.`;
      } else if (dayNum === 5) {
        morning = `Heritage cultural exploration: local fort ramparts or ancient rock-cut caves.`;
        afternoon = `Leisurely picnic near natural springs with pristine mountain views.`;
        evening = `Special MTDC partner farewell dinner and cultural bonfire session.`;
        transitTip = `Local forest department permits included; show digital Green Pass.`;
      } else {
        morning = `Quiet morning stroll along secluded trails; crisp Sahyadri mountain breeze.`;
        afternoon = `Souvenir shopping for local artisanal crafts, wild honey, and seasonal specialties.`;
        evening = `Celebratory dinner at accredited heritage lodge.`;
        transitTip = `Smooth return journey planned via alternate state highway to avoid Sunday evening highway gridlock.`;
      }

      itinerary.push({
        dayNumber: dayNum,
        date: currentDate,
        destinationId: spot.id,
        destinationName: spot.name,
        morningActivity: morning,
        afternoonActivity: afternoon,
        eveningActivity: evening,
        recommendedLodging: spot.nearbyHotels?.[0]?.name || 'MTDC Accredited Eco-Lodge',
        estimatedCrowdLevel: metrics.status,
        transitTip
      });
    }

    const selectedDests = destinationMode === 'multi' ? [primarySpot.id, secondarySpot.id] : [primarySpot.id];

    const newTrip: TripPlan = {
      id: tripId,
      user_id: currentUser.id,
      destinations: selectedDests,
      dates: { start: startDate, end: endDate },
      budget_band: budgetBand,
      group_type: groupType,
      itinerary,
      totalCo2SavedKg: Number((10.5 * effectiveDays).toFixed(1)),
      created_at: new Date().toISOString()
    };

    addTripPlan(newTrip);

    // Automatically issue a GreenPass certificate (§7)
    const twinTarget = destinationMode === 'multi' ? secondarySpot : primarySpot;
    const newGreenPass: GreenPass = {
      id: `gp-${Date.now().toString(36)}`,
      user_id: currentUser.id,
      trip_plan_id: tripId,
      original_spot_id: primarySpot.id,
      original_spot_name: primarySpot.name,
      twin_spot_id: twinTarget.id,
      twin_spot_name: twinTarget.name,
      distance_delta_km: destinationMode === 'multi' ? Math.abs(secondarySpot.distanceKmFromHub - primarySpot.distanceKmFromHub) : 0,
      co2_saved_kg: Number((10.5 * effectiveDays).toFixed(1)),
      geofence_verified: true,
      issued_at: new Date().toISOString(),
      code: `GREEN-PASS-${primarySpot.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      discountPct: 25,
      operatorName: primarySpot.nearbyHotels?.[0]?.name || 'MTDC Regional Hoteliers Guild'
    };

    addGreenPass(newGreenPass);
    navigate(`/plan/${tripId}`);
  };

  const handleCompleteProgressiveSignup = () => {
    updateUserProfile({
      homeCity: homeCityInput,
      homeState: homeStateInput,
      isAuthenticated: true,
      name: 'Registered Citizen Tourist'
    });
    setShowSignupPrompt(false);
    handleGeneratePlan(true);
  };

  const budgetOptions = [
    { band: '₹', label: 'Budget Traveler', limit: 'Under ₹2,000 / day', desc: 'Govt forest lodges & home kitchens' },
    { band: '₹₹', label: 'Balanced Explorer', limit: '₹2,000 – ₹5,000 / day', desc: 'MTDC resorts & lakeside villas' },
    { band: '₹₹₹', label: 'Premium Leisure', limit: '₹5,000+ / day', desc: 'Luxury heritage estates & spas' }
  ];

  const groupOptions = [
    { key: 'solo', label: 'Solo Traveler', icon: '🎒' },
    { key: 'couple', label: 'Couple / Duo', icon: '👫' },
    { key: 'family', label: 'Family with Kids', icon: '👨‍👩‍👧‍👦' },
    { key: 'friends', label: 'Group of Friends', icon: '👥' }
  ];

  const durationOptions = [
    { days: 1, label: '1 Day', sub: 'Day Trip' },
    { days: 2, label: '2 Days', sub: 'Weekend' },
    { days: 3, label: '3 Days', sub: 'Long Weekend' },
    { days: 4, label: '4 Days', sub: 'Extended Escape' },
    { days: 5, label: '5 Days', sub: 'Vacation' },
    { days: 7, label: '7 Days', sub: 'Grand Explorer' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── HEADER ── */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-extrabold text-gov-navy uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Intelligent Multi-Day Travel Wizard (§4.4)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Plan an Eco-Balanced Holiday
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Create flexible 1-day to 7-day holidays. Focus deeply on 1 destination or explore a multi-stop scenic corridor without peak highway congestion.
        </p>
      </div>

      {/* ── WIZARD STEPS FORM ── */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Step 1: Destination Selection & Style Mode */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gov-navy text-amber-300 text-xs font-black flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Destination Strategy & Selection
              </h2>
            </div>

            {/* Destination Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setDestinationMode('single')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  destinationMode === 'single'
                    ? 'bg-gov-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1 Destination (In-Depth)
              </button>
              <button
                type="button"
                onClick={() => setDestinationMode('multi')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  destinationMode === 'multi'
                    ? 'bg-gov-navy text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Multi-Stop Corridor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                {destinationMode === 'single' ? 'Your Holiday Destination:' : 'Base Destination (Primary):'}
              </label>
              <select
                value={selectedSpotId}
                onChange={e => setSelectedSpotId(e.target.value)}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy cursor-pointer"
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.district} • {d.category})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {destinationMode === 'single' 
                  ? `All ${tripDuration} days will be planned exploring attractions & trails around ${primarySpot.name}.`
                  : `First half of the trip will be based in ${primarySpot.name}.`}
              </span>
            </div>

            {destinationMode === 'multi' ? (
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Connecting Corridor Gem (Secondary):
                </label>
                <select
                  value={secondarySpotId}
                  onChange={e => setSecondarySpotId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy cursor-pointer"
                >
                  {destinations.filter(d => d.id !== selectedSpotId).map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.district} • {d.category})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Second half of the journey smoothly transitions to {secondarySpot.name}.
                </span>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-center">
                <span className="text-xs font-bold text-gov-navy flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Single Destination In-Depth Mode</span>
                </span>
                <p className="text-[11px] text-slate-600 mt-1">
                  You do not need two destinations! Your {tripDuration}-day journey schedules distinct viewpoints, lakeside walks, cultural heritage, and local dining in <strong>{primarySpot.name}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Trip Duration & Travel Dates */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gov-navy text-amber-300 text-xs font-black flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Trip Duration & Travel Dates
            </h2>
          </div>

          {/* Quick Duration Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">
              Select Trip Length:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {durationOptions.map(opt => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => handleDurationSelect(opt.days)}
                  className={`p-2.5 rounded-xl border-2 text-center transition ${
                    tripDuration === opt.days
                      ? 'bg-gov-navy text-white border-gov-navy shadow-md ring-2 ring-gov-navy/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm font-black block">{opt.label}</span>
                  <span className={`text-[10px] block font-medium ${tripDuration === opt.days ? 'text-amber-300' : 'text-slate-400'}`}>
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={e => handleStartDateChange(e.target.value)}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">End Date ({tripDuration} Days):</label>
              <input
                type="date"
                value={endDate}
                onChange={e => handleEndDateChange(e.target.value)}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Open-Meteo forward model sync active: Saturday arrivals expect +35% weekend surge; Friday departures or weekday trips enjoy clear corridors.
          </p>
        </div>

        {/* Step 3: Budget Band */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gov-navy text-amber-300 text-xs font-black flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Daily Accommodation & Dining Band
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {budgetOptions.map(b => (
              <button
                key={b.band}
                type="button"
                onClick={() => setBudgetBand(b.band as any)}
                className={`p-4 rounded-2xl border-2 text-left transition ${
                  budgetBand === b.band
                    ? 'bg-gov-navy text-white border-gov-navy shadow-md ring-2 ring-gov-navy/20'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-xl font-black block">{b.band}</span>
                <span className="font-bold text-xs block mt-1">{b.label}</span>
                <span className={`text-[11px] block mt-0.5 ${budgetBand === b.band ? 'text-amber-300' : 'text-slate-500'}`}>
                  {b.limit}
                </span>
                <p className={`text-[10px] mt-1 ${budgetBand === b.band ? 'text-slate-300' : 'text-slate-400'}`}>
                  {b.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Group Type */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gov-navy text-amber-300 text-xs font-black flex items-center justify-center">
              4
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Traveling Group Type
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {groupOptions.map(g => (
              <button
                key={g.key}
                type="button"
                onClick={() => setGroupType(g.key as any)}
                className={`p-3.5 rounded-2xl border-2 text-center transition ${
                  groupType === g.key
                    ? 'bg-gov-navy text-white border-gov-navy shadow-md'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl block">{g.icon}</span>
                <span className="text-xs font-bold block mt-1">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Generates personalized {tripDuration}-day itinerary, crowd bypasses, and verified Green Pass certificate.
          </div>
          <button
            type="button"
            onClick={() => handleGeneratePlan(false)}
            className="bg-gov-gold hover:bg-amber-400 text-gov-navy font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate {tripDuration}-Day Itinerary & Green Pass →</span>
          </button>
        </div>
      </div>

      {/* ── PROGRESSIVE PROFILING SIGNUP MODAL (§4.3, §9) ── */}
      {showSignupPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                Save Trip Plan & Green Pass
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Quick 2-Field Traveler Profile
              </h3>
              <p className="text-xs text-slate-500">
                Never a lengthy survey wall. Just 2 fields to personalize your return route and issue your official discount voucher.
              </p>
            </div>

            {/* Field 1: Home City / State */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                1. Where are you traveling from? (Home City / State)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={homeCityInput}
                  onChange={e => setHomeCityInput(e.target.value)}
                  placeholder="City (e.g. Pune, Mumbai)"
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-gov-navy"
                />
                <input
                  type="text"
                  value={homeStateInput}
                  onChange={e => setHomeStateInput(e.target.value)}
                  placeholder="State (e.g. Maharashtra)"
                  className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-gov-navy"
                />
              </div>
            </div>

            {/* Field 2: Primary Travel Style (4 tap cards) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                2. Your Primary Travel Style:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { label: 'Scenic Vistas', icon: '🏔️' },
                  { label: 'Budget Stays', icon: '💰' },
                  { label: 'Adventure Treks', icon: '🥾' },
                  { label: 'Family Comfort', icon: '👨‍👩‍👧‍👦' }
                ].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedStyleIndex(idx)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      selectedStyleIndex === idx
                        ? 'bg-gov-navy text-white border-gov-navy'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleGeneratePlan(true)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Skip & View Plan
              </button>
              <button
                type="button"
                onClick={handleCompleteProgressiveSignup}
                className="flex-1 py-2.5 bg-gov-green hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Save & Claim Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
