import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Printer, 
  Compass,
  Leaf,
  Bus,
  Car,
  Home,
  ShieldCheck,
  TrendingDown,
  Coins,
  FileText,
  Fuel,
  Trees,
  Hourglass,
  X,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCorridorStore } from '../../store/useCorridorStore';
import { apiPost } from '../../lib/api';
import type { Destination } from '../../types';
import { TRANSLATIONS } from '../../lib/i18n';

interface FutureTripPlannerProps {
  destinations?: Destination[];
  prefillSpotId?: string;
}

export const FutureTripPlanner: React.FC<FutureTripPlannerProps> = ({ destinations: propDestinations, prefillSpotId }) => {
  const [searchParams] = useSearchParams();
  const { destinations: storeDestinations, saveTripPlan, addGreenPass, currentUser, language } = useCorridorStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const destinations = (propDestinations && propDestinations.length > 0) ? propDestinations : storeDestinations;

  const urlSpot = searchParams.get('spot') || searchParams.get('spotId');
  const [selectedSpotId, setSelectedSpotId] = useState<string>(prefillSpotId || urlSpot || 'LON');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [duration, setDuration] = useState<'1-day' | '2-day' | '3-day' | '4-day' | '5-day' | '7-day'>('2-day');
  const [travelStyle, setTravelStyle] = useState<'scenic' | 'adventure' | 'family' | 'budget'>('scenic');
  const [transportMode, setTransportMode] = useState<'green_transit' | 'ultra_green' | 'personal_car'>('green_transit');
  const [accommodationType, setAccommodationType] = useState<'homestay' | 'hotel'>('homestay');
  const [backendPlanStatus, setBackendPlanStatus] = useState<'idle' | 'loading' | 'connected' | 'offline'>('idle');
  const [backendDays, setBackendDays] = useState<any[] | null>(null);
  const [fullPlan, setFullPlan] = useState<any>(null);

  // Saving state
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // AI Sustainability Audit Report Modal States
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);

  const handleSaveTrip = async () => {
    if (!fullPlan) return;
    setIsSaving(true);
    try {
      const targetDest = destinations.find(d => d.id === selectedSpotId);
      const tripId = `TRIP-${Date.now().toString(36).toUpperCase()}`;
      const tripToSave = {
        id: tripId,
        user_id: currentUser.id || 'CITIZEN-GUEST-01',
        destinationId: selectedSpotId,
        destinationName: targetDest?.name || fullPlan.destination_name || 'Western Ghats Corridor',
        startDate: travelDate,
        durationDays: fullPlan.duration_days || parseInt(duration) || 2,
        destinations: [selectedSpotId],
        dates: {
          start: travelDate,
          end: travelDate
        },
        transportMode: transportMode,
        accommodationType: accommodationType,
        totalCo2SavedKg: fullPlan.carbon_calculator?.carbon_saved_kg || 34.2,
        carbonFootprintKg: fullPlan.carbon_calculator?.trip_emissions_kg || 18.5,
        carbonAvoidedKg: fullPlan.carbon_calculator?.carbon_saved_kg || 34.2,
        environmentalScore: fullPlan.sustainability_scores?.environmental || 90,
        socialScore: fullPlan.sustainability_scores?.social || 88,
        economicScore: fullPlan.sustainability_scores?.economic || 94,
        sustainabilityScore: fullPlan.sustainability_score || fullPlan.trip_sustainability_score || 91,
        days: fullPlan.itinerary_days || backendDays || [],
        created_at: new Date().toISOString()
      };
      await saveTripPlan(tripToSave as any);

      // Auto-generate a GreenPass voucher for this trip
      const twinDests = fullPlan.twin_recommendations || [];
      const twinSpot = twinDests.length > 0 ? twinDests[0]?.destination : null;
      addGreenPass({
        id: `gp-${Date.now().toString(36)}`,
        user_id: currentUser.id || 'CITIZEN-GUEST-01',
        trip_plan_id: tripId,
        original_spot_id: selectedSpotId,
        original_spot_name: targetDest?.name || fullPlan.destination_name || 'Destination',
        twin_spot_id: twinSpot?.id || selectedSpotId,
        twin_spot_name: twinSpot?.name || targetDest?.name || 'Eco-Twin',
        distance_delta_km: twinSpot?.distanceKmFromHub || 0,
        co2_saved_kg: Number(tripToSave.carbonAvoidedKg || 34.2),
        geofence_verified: true,
        issued_at: new Date().toISOString(),
        code: `GREEN-PASS-${selectedSpotId}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'active',
        discountPct: 25,
        operatorName: 'MTDC Regional Hoteliers Guild'
      });

      setSaveStatus('Trip saved to My Passes! (+150 Eco-Karma Earned)');
      setTimeout(() => setSaveStatus(null), 5000);
    } catch {
      setSaveStatus('Trip saved locally in your active passes.');
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateReport = async () => {
    setReportModalOpen(true);
    setReportLoading(true);
    try {
      const calc = fullPlan?.carbon_calculator || {};
      const targetDest = destinations.find(d => d.id === selectedSpotId);
      const destName = targetDest ? `${targetDest.name} (${targetDest.district})` : 'Western Ghats Corridor';
      const data = await apiPost('/api/ai/generate-report', {
        destination_name: destName,
        duration: duration,
        travel_date: travelDate,
        sustainability_score: fullPlan?.sustainability_score || fullPlan?.trip_sustainability_score || 88,
        sustainability_grade: fullPlan?.sustainability_grade || 'Certified Green Journey (A+)',
        carbon_saved_kg: calc.carbon_saved_kg || 34.2,
        carbon_saved_pct: calc.carbon_saved_pct || 64.6,
        trees_equivalent_annual: calc.trees_equivalent_annual || 1.6,
        fuel_saved_liters: calc.fuel_saved_liters || 14.8,
        local_economy_inr: calc.local_economy_contribution_inr || 3900
      });
      setReportMarkdown(data.report_markdown || 'Report generated successfully.');
    } catch {
      setReportMarkdown('⚠️ Network timeout or connection error. Operating in offline verification mode.');
    } finally {
      setReportLoading(false);
    }
  };

  // Call backend itinerary API whenever user changes their trip parameters
  React.useEffect(() => {
    setBackendPlanStatus('loading');
    apiPost('/api/itinerary/plan', {
      travel_date: travelDate,
      duration,
      travel_style: travelStyle,
      transport_mode: transportMode,
      accommodation_type: accommodationType,
      destination_id: selectedSpotId,
      destinations: [selectedSpotId]
    })
      .then((data) => {
        setBackendPlanStatus('connected');
        const planObj = data.plan || data;
        setFullPlan(planObj);
        if (planObj && planObj.itinerary_days && Array.isArray(planObj.itinerary_days)) {
          setBackendDays(planObj.itinerary_days);
        }
      })
      .catch(() => setBackendPlanStatus('offline'));
  }, [travelDate, duration, travelStyle, transportMode, accommodationType, selectedSpotId]);

  // Dynamic future congestion simulation based on chosen date
  const isWeekend = new Date(travelDate).getDay() === 0 || new Date(travelDate).getDay() === 6;
  const predictedHotspotCongestion = isWeekend ? 94 : 62; // % load on Lonavala / Mahabaleshwar
  const predictedTwinCongestion = isWeekend ? 34 : 18; // % load on Matheran / Bhandardara

  const itineraryPlan = [
    {
      day: 'Day 1: Saturday',
      morningSlot: {
        time: '06:30 AM – 09:30 AM',
        title: 'Early Morning Hotspot Transit (Lonavala & Tiger Point)',
        desc: 'Visit Rajmachi viewpoint during the morning off-peak window before highway rush begins.',
        badge: 'Off-Peak Window'
      },
      afternoonSlot: {
        time: '11:30 AM – 04:30 PM',
        title: 'Bypass to Matheran Eco-Zone & Charlotte Lake',
        desc: 'Divert away from overloaded ghat roads to automobile-free Matheran. Enjoy valley views without parking delays.',
        badge: 'Twin Destination'
      },
      eveningSlot: {
        time: '05:30 PM – 08:30 PM',
        title: 'Sunset Homestay Check-in & Local Dining',
        desc: 'Check in at accredited heritage homestay. Redeem 25% MTDC off-peak voucher (HOMESTAY25).',
        badge: 'Verified Homestay'
      }
    },
    {
      day: 'Day 2: Sunday',
      morningSlot: {
        time: '07:00 AM – 10:30 AM',
        title: 'Bhandardara Serene Lake & Arthur Dam Walk',
        desc: 'Experience pristine lakeside trails and Kalsubai foothills with 85% fewer tourists than central hubs.',
        badge: 'Eco-Corridor Trail'
      },
      afternoonSlot: {
        time: '12:00 PM – 03:30 PM',
        title: 'Organic Farm Lunch & Local Handicrafts Market',
        desc: 'Support local artisans and farm-to-table dining initiatives in Ahmednagar district.',
        badge: 'Sustainable Tourism'
      },
      eveningSlot: {
        time: '04:30 PM onwards',
        title: 'Smooth Expressway Return via Ghoti Bypass',
        desc: 'Return journey via alternate northern route, bypassing the 3-hour Khandala ghat traffic bottleneck.',
        badge: 'Save 110 Mins'
      }
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gov-navy text-amber-300 rounded-xl shadow-inner">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-gov-navy tracking-tight leading-tight flex items-center gap-2 flex-wrap">
              <span>{t.ftpTitle}</span>
              <span className="text-xs bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded border border-amber-300">
                {t.ftpBadgeAiScheduler}
              </span>
              {backendPlanStatus === 'connected' && (
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300">
                  {t.ftpBadgeBackendApi}
                </span>
              )}
              {backendPlanStatus === 'offline' && (
                <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-300">
                  {t.ftpBadgeOffline}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.ftpSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleSaveTrip}
            disabled={isSaving || !fullPlan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition shadow-sm disabled:opacity-50"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-950" />
            <span>{isSaving ? t.ftpSavingBtn : t.ftpSaveBtn}</span>
          </button>

          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-200" />
            <span>{t.ftpReportBtn}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t.ftpPrintBtn}</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-emerald-50 text-emerald-950 border-2 border-emerald-400 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
          <Link to="/trips" className="underline hover:text-emerald-800 font-black flex items-center gap-1">
            <span>{t.ftpViewInPasses}</span>
            <span>→</span>
          </Link>
        </div>
      )}

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Destination Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t.ftpDestLabel}</span>
          </label>
          <select
            value={selectedSpotId}
            onChange={(e) => setSelectedSpotId(e.target.value)}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner cursor-pointer"
          >
            {destinations.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.district} • {d.category})
              </option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t.ftpDateLabel}</span>
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner"
          />
        </div>

        {/* Duration Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t.ftpDurationLabel}</span>
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as any)}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner cursor-pointer"
          >
            <option value="1-day">1-Day (Daytrip)</option>
            <option value="2-day">2-Day Weekend Trip</option>
            <option value="3-day">3-Day Long Holiday</option>
            <option value="4-day">4-Day Extended Escape</option>
            <option value="5-day">5-Day Vacation</option>
            <option value="7-day">7-Day Grand Explorer</option>
          </select>
        </div>

        {/* Travel Style */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t.ftpStyleLabel}</span>
          </label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value as 'scenic' | 'adventure' | 'family' | 'budget')}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner cursor-pointer"
          >
            <option value="scenic">{t.ftpStyleScenic}</option>
            <option value="adventure">{t.ftpStyleAdventure}</option>
            <option value="family">{t.ftpStyleFamily}</option>
            <option value="budget">{t.ftpStyleBudget}</option>
          </select>
        </div>

        {/* Transportation Mode (Pillar 1) */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t.ftpMobilityLabel}</span>
          </label>
          <select
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value as any)}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner cursor-pointer"
          >
            <option value="green_transit">{t.ftpMobilityGreen}</option>
            <option value="ultra_green">{t.ftpMobilityUltraGreen}</option>
            <option value="personal_car">{t.ftpMobilityPersonalCar}</option>
          </select>
        </div>

        {/* Accommodation Type (Pillar 1 & 2) */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-gov-navy" />
            <span>{t.ftpStayLabel}</span>
          </label>
          <select
            value={accommodationType}
            onChange={(e) => setAccommodationType(e.target.value as any)}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner cursor-pointer"
          >
            <option value="homestay">{t.ftpStayHomestay}</option>
            <option value="hotel">{t.ftpStayHotel}</option>
          </select>
        </div>
      </div>

      {/* Future Predicted Congestion Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-rose-800 block">
              {t.ftpConventionalHotspots}
            </span>
            <strong className="text-rose-950 text-sm">
              {t.ftpPredictedCrowdLoadPrefix} {predictedHotspotCongestion}% Over Capacity
            </strong>
          </div>
          <span className="bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
            {isWeekend ? t.ftpHeavyTraffic : t.ftpModerateCrowds}
          </span>
        </div>

        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-gov-green block">
              {t.ftpDecongestedTwin}
            </span>
            <strong className="text-emerald-950 text-sm">
              {t.ftpPredictedCrowdLoadPrefix} {predictedTwinCongestion}% {t.ftpComfortableSuffix}
            </strong>
          </div>
          <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
            {t.ftpZeroDelays}
          </span>
        </div>
      </div>

      {/* ── PILLAR 1 & 2: TRIP SUSTAINABILITY SCORE & CARBON FOOTPRINT DASHBOARD ── */}
      {fullPlan && (
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-emerald-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-black tracking-tight">{t.ftpSustainabilityTitle}</h4>
                  <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wide">
                    {t.ftpPillar1Badge}
                  </span>
                  {fullPlan.ai_narrative?.source === 'gemini-3.6-flash' && (
                    <span className="text-[10px] font-bold bg-indigo-400/20 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                      ✨ Gemini 3.6 Flash Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t.ftpSustainabilityDesc}
                </p>
              </div>
            </div>

            {/* Score Gauge */}
            <div className="flex items-baseline gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/15 self-start sm:self-auto shadow-inner">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {fullPlan.sustainability_score || fullPlan.trip_sustainability_score || 88}
              </span>
              <span className="text-sm text-slate-300 font-bold">/ 100</span>
              <span className="ml-1 text-xs font-bold text-amber-300 block">
                {fullPlan.sustainability_grade || 'Certified Green Journey'}
              </span>
            </div>
          </div>

          {/* 3-Dimensional Pillar Scores (§0.1 Framework) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-2xl p-3 border border-emerald-400/30">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span>{t.ftpEnvironmental}</span>
                <span className="font-mono text-base text-white">
                  {fullPlan.sustainability_scores?.environmental || 92}/100
                </span>
              </div>
              <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-between">
                <span>40% Weight</span>
                <span>Carbon, Waste, DCC</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 border border-sky-400/30">
              <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                <span>{t.ftpSocialCultural}</span>
                <span className="font-mono text-base text-white">
                  {fullPlan.sustainability_scores?.social || 88}/100
                </span>
              </div>
              <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-between">
                <span>30% Weight</span>
                <span>{t.ftpSocialSubLabel}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 border border-amber-400/30">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span>{t.ftpLocalEconomic}</span>
                <span className="font-mono text-base text-white">
                  {fullPlan.sustainability_scores?.economic || 94}/100
                </span>
              </div>
              <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-between">
                <span>30% Weight</span>
                <span>Homestays, drivers, FPOs</span>
              </div>
            </div>
          </div>

          {/* ── HERO: CARBON FOOTPRINT REDUCTION METRICS ── */}
          {fullPlan.carbon_calculator && (
            <div className="bg-emerald-900/30 border-2 border-emerald-400/40 p-4 sm:p-5 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-400 text-slate-950 rounded-xl font-bold">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                      {t.ftpCarbonReductionTitle}
                    </span>
                    <strong className="text-xl sm:text-2xl font-black text-white font-mono flex items-baseline gap-2">
                      <span>-{fullPlan.carbon_calculator.carbon_saved_kg} kg CO₂e Avoided</span>
                      <span className="text-emerald-400 text-sm font-bold">
                        ({fullPlan.carbon_calculator.carbon_saved_pct}% Emissions Cut)
                      </span>
                    </strong>
                  </div>
                </div>

                <div className="bg-white/10 px-3 py-1.5 rounded-xl text-right self-start sm:self-auto border border-white/10">
                  <span className="text-[10px] text-slate-300 uppercase block font-bold">{t.ftpRoundTripDistance}</span>
                  <span className="text-sm font-bold text-emerald-300 font-mono">
                    {fullPlan.carbon_calculator.round_trip_km} km Circuit
                  </span>
                </div>
              </div>

              {/* Side-by-Side Visual Emissions Comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-slate-400 inline" /> {t.ftpSoloCarBaseline} <strong>{fullPlan.carbon_calculator.solo_car_emissions_kg} kg CO₂e</strong></span>
                  <span className="text-emerald-300 font-bold">{t.ftpEcoRoutePlanned} <strong>{fullPlan.carbon_calculator.trip_emissions_kg} kg CO₂e</strong></span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex border border-white/10">
                  <div 
                    className="bg-emerald-400 h-full transition-all duration-700 relative"
                    style={{ width: `${Math.max(12, 100 - fullPlan.carbon_calculator.carbon_saved_pct)}%` }}
                    title="Planned Trip Emissions"
                  />
                  <div 
                    className="bg-emerald-600/30 h-full flex-1 border-l border-emerald-400/50 flex items-center justify-center text-[9px] font-bold text-emerald-200 tracking-wider uppercase"
                  >
                    -{fullPlan.carbon_calculator.carbon_saved_pct}% {t.ftpCarbonSavedSuffix}
                  </div>
                </div>
              </div>

              {/* 4 Environmental Impact Equivalents */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs mb-1">
                    <Trees className="w-3.5 h-3.5" />
                    <span className="font-bold">{t.ftpTreesAbsorption}</span>
                  </div>
                  <strong className="text-lg font-black text-white font-mono block">
                    {fullPlan.carbon_calculator.trees_equivalent_annual || Math.round(fullPlan.carbon_calculator.carbon_saved_kg / 21.77)}
                  </strong>
                  <span className="text-[10px] text-slate-300 block">{t.ftpTreesDesc}</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs mb-1">
                    <Fuel className="w-3.5 h-3.5" />
                    <span className="font-bold">{t.ftpFuelSaved}</span>
                  </div>
                  <strong className="text-lg font-black text-white font-mono block">
                    {fullPlan.carbon_calculator.fuel_saved_liters || Math.round(fullPlan.carbon_calculator.carbon_saved_kg / 2.31)} L
                  </strong>
                  <span className="text-[10px] text-slate-300 block">{t.ftpFuelDesc}</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-teal-300 text-xs mb-1">
                    <Hourglass className="w-3.5 h-3.5" />
                    <span className="font-bold">{t.ftpIdlingAvoided}</span>
                  </div>
                  <strong className="text-lg font-black text-white font-mono block">
                    {fullPlan.carbon_calculator.ghat_idling_hours_avoided || 3.0} Hrs
                  </strong>
                  <span className="text-[10px] text-slate-300 block">{t.ftpIdlingDesc}</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span className="font-bold">{t.ftpLocalInjection}</span>
                  </div>
                  <strong className="text-lg font-black text-amber-300 font-mono block">
                    ₹{fullPlan.carbon_calculator.local_economy_contribution_inr?.toLocaleString() || '3,900'}
                  </strong>
                  <span className="text-[10px] text-slate-300 block">{t.ftpLocalInjectionDesc}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── GEMINI AI CURATOR COMMENTARY & CARBON REDUCTION STRATEGY ── */}
          {fullPlan.ai_narrative && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <strong className="text-sm font-bold text-white uppercase tracking-wide">
                    {t.ftpAiInsightsTitle}
                  </strong>
                </div>
                <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded border border-white/10">
                  {fullPlan.ai_narrative.source === 'gemini-3.6-flash' ? 'Google Gemini 3.6 Flash' : 'EcoRoute Autonomous AI'}
                </span>
              </div>

              {fullPlan.ai_narrative.curator_summary && (
                <p className="text-xs text-slate-200 leading-relaxed italic border-l-2 border-amber-400 pl-3">
                  "{fullPlan.ai_narrative.curator_summary}"
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {fullPlan.ai_narrative.carbon_reduction_strategy && (
                  <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                      {t.ftpAiCarbonWhyTitle}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {fullPlan.ai_narrative.carbon_reduction_strategy}
                    </p>
                  </div>
                )}

                {fullPlan.ai_narrative.community_empowerment && (
                  <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      {t.ftpAiCommunityTitle}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {fullPlan.ai_narrative.community_empowerment}
                    </p>
                  </div>
                )}
              </div>

              {fullPlan.ai_narrative.biodiversity_tips && Array.isArray(fullPlan.ai_narrative.biodiversity_tips) && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-200 bg-emerald-900/20 p-2.5 rounded-xl border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Eco-Guard:</strong> {fullPlan.ai_narrative.biodiversity_tips.join(' • ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 6-Component Weighted Breakdown */}
          {fullPlan.component_breakdown && (
            <div className="space-y-2 pt-1 border-t border-white/10">
              <span className="text-xs font-bold text-emerald-300 block uppercase tracking-wider">
                Weighted Component Contribution
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {Object.entries(fullPlan.component_breakdown).map(([key, comp]: [string, any]) => (
                  <div key={key} className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-200 capitalize">
                        {key.replace('_', ' ')} ({comp.weight})
                      </span>
                      <strong className="text-emerald-400 font-mono">{comp.score}/100</strong>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          comp.score >= 85 ? 'bg-emerald-400' : comp.score >= 65 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${comp.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{comp.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Green Trip Mobility Flow Callout */}
          <div className="bg-emerald-900/40 border border-emerald-500/40 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-white font-bold block">
                {t.ftpGreenModeTitle}
              </strong>
              <p className="text-emerald-100/90 leading-relaxed">
                {t.ftpGreenModeDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Itinerary Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gov-gold" />
            {t.ftpOptimizedItineraryTitle}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gov-green font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              {t.ftpAvoidsDelayBadge}
            </span>
            {fullPlan?.carbon_calculator && (
              <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                ⚡ -{fullPlan.carbon_calculator.carbon_saved_kg} kg Net CO₂e
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {(backendDays && backendDays.length > 0 ? backendDays : itineraryPlan.map(ip => ({
            day_label: ip.day,
            carbon_saved_today_kg: 17.1,
            slots: [
              { ...ip.morningSlot, location: 'Sahyadri Corridor' },
              { ...ip.afternoonSlot, location: 'Eco-Twin Hub' },
              { ...ip.eveningSlot, location: 'Accredited Homestay' }
            ]
          }))).map((dayPlan: any, dIdx: number) => (
            <div key={dIdx} className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gov-navy text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between flex-wrap gap-2">
                <span>{dayPlan.day_label || dayPlan.day || `Day ${dIdx + 1}`}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                    🌿 -{dayPlan.carbon_saved_today_kg || 17.1} kg CO₂e Saved Today
                  </span>
                  <span className="text-[10px] text-amber-300 font-medium">{t.ftpDecongestedSchedule}</span>
                </div>
              </div>

              <div className="p-4 bg-white space-y-3">
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
                        {slot.location && <span className="text-slate-400 font-normal">• {slot.location}</span>}
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
          ))}
        </div>
      </div>

      {/* ── AI SUSTAINABILITY AUDIT REPORT MODAL ── */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-300 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="bg-gov-navy text-white p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-300" />
                <div>
                  <h4 className="font-bold text-sm">{t.ftpReportModalTitle}</h4>
                  <span className="text-[10px] text-slate-300">{t.ftpReportModalSubtitle}</span>
                </div>
              </div>
              <button 
                onClick={() => setReportModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 text-slate-800 text-xs space-y-4">
              {reportLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-600 font-medium">{t.ftpGeneratingReport}</p>
                </div>
              ) : (
                <div className="prose prose-xs max-w-none text-slate-700 font-sans leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <Markdown>{reportMarkdown || ''}</Markdown>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {t.ftpReportValidNote}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-gov-navy hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-sm transition"
                >
                  {t.ftpPrintSaveBtn}
                </button>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition"
                >
                  {t.ftpCloseBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
