import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  Users, 
  Calendar, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Sparkles, 
  Building2, 
  Utensils, 
  Droplet, 
  Navigation, 
  CheckCircle2, 
  Compass, 
  ArrowRight, 
  X, 
  Layers, 
  ExternalLink,
  MessageSquare,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useSpotData } from '../hooks/useSpotData';
import { useCorridorStore } from '../store/useCorridorStore';

export const SpotPage: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();

  const {
    currentUser,
    updateDestinationHotelOccupancy,
    addPromotion
  } = useCorridorStore();

  const {
    spot,
    metrics,
    telemetry,
    forecast,
    twins,
    advisories,
    checkIns,
    addCheckIn,
    notFound
  } = useSpotData(spotId);

  // UI state
  const [provenanceExpanded, setProvenanceExpanded] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInRating, setCheckInRating] = useState(3);
  const [checkInComment, setCheckInComment] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedForecastHour, setSelectedForecastHour] = useState<number | null>(null);
  const [selectedWeeklyDay, setSelectedWeeklyDay] = useState<number | null>(null);

  // Rolling 7-day historical window ending strictly on today (current date)
  const rollingWeeklyDays = useMemo(() => {
    const today = new Date();
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayOfWeekStr = dayNames[d.getDay()];
      const isToday = (i === 0);
      const isYesterday = (i === 1);
      const patternMatch = spot?.historicalWeeklyPattern?.find(p => p.day === dayOfWeekStr);
      const ratio = patternMatch?.typicalFootfallRatio ?? (d.getDay() === 0 || d.getDay() === 6 ? 1.15 : 0.45);
      const level = patternMatch?.level ?? (ratio >= 0.85 ? 'CRITICAL' : ratio >= 0.65 ? 'MODERATE' : 'OPTIMAL');
      const dateFormatted = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      days.push({
        dateStr: dateFormatted,
        dayOfWeek: dayOfWeekStr,
        dayLabel: isToday ? 'Today' : isYesterday ? 'Yesterday' : dayOfWeekStr,
        dayFull: isToday ? `Today (${dateFormatted})` : isYesterday ? `Yesterday (${dateFormatted})` : `${dayOfWeekStr}, ${dateFormatted}`,
        isToday,
        typicalFootfallRatio: ratio,
        level,
        note: patternMatch?.note || (isToday ? 'Live current date sensor readings' : 'Recorded arrival logs')
      });
    }
    return days;
  }, [spot]);

  // Provider panel state
  const [tempOccupancy, setTempOccupancy] = useState<number>(spot ? spot.hotelOccupancyPct : 50);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(25);
  const [promoCode, setPromoCode] = useState('');

  if (notFound || !spot || !metrics || !telemetry) {
    return (
      <div className="min-h-[70vh] max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Compass className="w-12 h-12 mx-auto text-slate-400 animate-spin" />
        <h1 className="text-2xl font-bold text-slate-800">Destination Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested destination &ldquo;{spotId}&rdquo; is not part of the active Western Ghats & Maharashtra Corridor registry.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => navigate('/discover')}
            className="px-5 py-2.5 bg-gov-navy text-amber-300 font-bold text-xs rounded-xl shadow"
          >
            Explore Discover Feed
          </button>
          <button
            onClick={() => navigate('/region/state/Maharashtra')}
            className="px-5 py-2.5 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300"
          >
            View All Maharashtra Destinations
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    OPTIMAL: {
      headline: 'Low Crowds • Prime Time to Visit',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-400',
      badgeText: 'text-emerald-800',
      barColor: 'bg-emerald-500',
      icon: <ShieldCheck className="w-5 h-5 text-gov-green shrink-0" />,
      subtext: 'Carrying capacity is completely unhurried. Ample parking & zero highway bottleneck.'
    },
    MODERATE: {
      headline: 'Moderate Influx • Steady Movement',
      badge: 'bg-amber-100 text-amber-950 border-amber-400',
      badgeText: 'text-amber-800',
      barColor: 'bg-amber-500',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      subtext: 'Approaching peak weekend limits. Visit before 10 AM or after 4 PM for ideal comfort.'
    },
    CRITICAL: {
      headline: 'Heavily Overcrowded • Severe Chokepoints',
      badge: 'bg-rose-100 text-rose-950 border-rose-500 animate-pulse',
      badgeText: 'text-rose-800',
      barColor: 'bg-rose-500',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
      subtext: 'Checkpoints saturated. Long parking queues. We strongly suggest taking a twin destination below.'
    }
  }[metrics.status];

  const crowdPercentage = Math.round((spot.currentInflow / spot.physicalCapacity) * 100);

  const handleShareCopy = () => {
    const shareUrl = window.location.href;
    const shareText = `🌿 Live EcoRoute Bharat Crowd Update for ${spot.name}: Currently ${metrics.status} (${crowdPercentage}% capacity). Plan smarter or check twin alternatives: ${shareUrl}`;
    navigator.clipboard.writeText(shareText);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.href;
    const shareText = `🌿 *EcoRoute Bharat Live Telemetry*\n📍 *${spot.name}* (${spot.district}, ${spot.state})\n🚦 Crowd Status: *${metrics.status}* (${crowdPercentage}% Capacity)\n⏱️ Est. Wait: *${metrics.waitTimeMinutes} mins*\n🔗 Check real-time crowd forecast: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handlePublishPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoCode) return;
    addPromotion({
      destinationId: spot.id,
      destinationName: spot.name,
      discountPct: promoDiscount,
      title: promoTitle,
      badge: `Flat ${promoDiscount}% Off`,
      description: `Exclusive off-peak rate published direct by verified operator to balance corridor footfall.`,
      code: promoCode.toUpperCase(),
      validUntil: 'Valid this week',
      businessName: currentUser.name || 'Verified Local Partner',
      businessType: 'Homestay'
    });
    setPromoTitle('');
    setPromoCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* ── 6. ACTIVE ADVISORIES (Displayed prominently above the fold) ── */}
      {advisories.length > 0 && (
        <div className="space-y-2">
          {advisories.map(adv => (
            <div
              key={adv.id}
              className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-3 shadow-sm ${
                adv.severity === 'critical' || adv.severity === 'high'
                  ? 'bg-rose-50 border-rose-400 text-rose-950'
                  : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-600 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap font-black text-sm">
                    <span>{adv.title}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/80 border border-current">
                      Official Gazette • {adv.severity}
                    </span>
                    <span className="text-[11px] font-normal opacity-75">{adv.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed opacity-90">{adv.message}</p>
                  <p className="text-[10px] opacity-70 mt-1">Dispatched by: {adv.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 1. HEADER (Hero image, category, district, state, compact Leaflet map preview) ── */}
      <section className="bg-white rounded-3xl border-2 border-slate-300 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Hero Image & Key Meta */}
          <div className="lg:col-span-8 relative min-h-[320px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-8 text-white">
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/95 text-gov-navy text-[11px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow">
                  {spot.category}
                </span>
                <Link
                  to={`/region/district/${encodeURIComponent(spot.district)}`}
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-slate-200 text-xs font-semibold px-3 py-1 rounded-lg border border-white/20 transition flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {spot.district} District
                </Link>
                <Link
                  to={`/region/state/${encodeURIComponent(spot.state)}`}
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-slate-200 text-xs font-semibold px-3 py-1 rounded-lg border border-white/20 transition"
                >
                  {spot.state}
                </Link>
                {spot.isUnderVisited && (
                  <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                    🌿 Under-visited Eco-Gem
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {spot.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-200 font-medium max-w-2xl drop-shadow">
                {spot.tagline}
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                <span>Travel Time: <strong className="text-white">{spot.travelTimeFromHub}</strong></span>
                <span>•</span>
                <span>Distance: <strong className="text-white">{spot.distanceKmFromHub} km</strong></span>
                <span>•</span>
                <span>Statutory Capacity: <strong className="text-white">{spot.physicalCapacity.toLocaleString()} visitors</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Compact Leaflet Map Preview */}
          <div className="lg:col-span-4 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-gov-navy" />
                Live Location GIS
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {spot.coordinates[0].toFixed(3)}°N, {spot.coordinates[1].toFixed(3)}°E
              </span>
            </div>

            {/* Leaflet Map Preview */}
            <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-300 shadow-inner relative z-0">
              <MapContainer
                center={spot.coordinates}
                zoom={10}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker
                  center={spot.coordinates}
                  radius={12}
                  pathOptions={{
                    color: metrics.status === 'CRITICAL' ? '#e11d48' : metrics.status === 'MODERATE' ? '#d97706' : '#059669',
                    fillColor: metrics.status === 'CRITICAL' ? '#f43f5e' : metrics.status === 'MODERATE' ? '#f59e0b' : '#10b981',
                    fillOpacity: 0.85,
                    weight: 3
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]}>
                    <span className="font-bold text-xs">{spot.name}</span>
                  </Tooltip>
                </CircleMarker>
              </MapContainer>
            </div>

            {/* Actions Bar (Plan, Share) */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={`/plan/new?spotId=${spot.id}`}
                  className="bg-gov-navy hover:bg-gov-navy-light text-amber-300 text-xs font-bold py-2.5 px-3 rounded-xl text-center transition shadow flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan a Trip</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Share Status</span>
                </button>
              </div>

              {currentUser.role === 'authority' ? (
                <Link
                  to="/authority"
                  className="w-full inline-flex items-center justify-center gap-1 text-[11px] text-slate-500 hover:text-gov-navy hover:underline text-center py-1"
                >
                  <span>Open full regional GIS corridor command map</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ) : (
                <Link
                  to="/discover"
                  className="w-full inline-flex items-center justify-center gap-1 text-[11px] text-slate-500 hover:text-gov-navy hover:underline text-center py-1"
                >
                  <span>Explore more quiet spots on Discover Feed</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CROWD MODULE (Gauge + Confidence + 12h Forecast + Weekly Pattern + Provenance Breakdown) ── */}
      <section className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
                Carrying Capacity & Footfall Model
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {Math.round(telemetry.confidence_score * 100)}% Confidence Score
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dynamic Crowd Pressure Status
            </h2>
          </div>

          <div className={`px-4 py-2.5 rounded-2xl border-2 shadow-sm flex items-center gap-2.5 ${statusConfig.badge}`}>
            {statusConfig.icon}
            <div>
              <div className="text-xs sm:text-sm font-black">{statusConfig.headline}</div>
              <div className="text-[11px] opacity-80">{statusConfig.subtext}</div>
            </div>
          </div>
        </div>

        {/* ── Confirmed Booking Protection Guarantee Banner ── */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 border border-blue-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs text-base">
              🏨
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-blue-950">
                  Already have a Hotel or Activity Booking?
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-300">
                  ✓ 100% Guaranteed Access
                </span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                You will <strong>not</strong> be redirected or turned away at checkpoints. Highway redirection advisories are voluntary recommendations strictly aimed at spontaneous day-trippers. Keep your stay, and check our <strong>12-Hour Forecast</strong> below to bypass local attraction lines!
              </p>
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Estimated Inflow vs Capacity</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {spot.currentInflow.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">/ {spot.physicalCapacity.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full ${statusConfig.barColor}`}
                style={{ width: `${Math.min(100, crowdPercentage)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Operating at <strong>{crowdPercentage}%</strong> carrying capacity limit
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Estimated Wait & Queue</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {metrics.waitTimeMinutes}{' '}
              <span className="text-xs font-normal text-slate-500">mins wait</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-3">
              {metrics.waitTimeMinutes === 0
                ? 'Free-flowing access road with zero checkpoint choke.'
                : `Delay at toll/parking approach due to ${spot.currentInflow - spot.physicalCapacity} excess vehicles.`}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Weather & Ghat Hazard</span>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {spot.weatherHazardScore > 0.25 ? 'Caution (Fog / Rain)' : 'Safe / Favorable'}
            </div>
            <p className="text-[11px] text-slate-500 pt-3">
              Open-Meteo GFS Live: Temp {telemetry.weather.temp_c}°C • Rain: {telemetry.weather.rain_mm}mm/hr
            </p>
          </div>
        </div>

        {/* ── 12-Hour Forecast Strip with Visual Graph & Condition Points ── */}
        <div className="space-y-4 pt-3 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gov-navy" />
                <span>12-Hour Predictive Forecast Strip & Demand Graph</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Hourly arrival volume calibrated with Open-Meteo GFS weather sensors & road transit delays
              </p>
            </div>

            {/* Condition Color Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                &lt;70% Optimal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                70–84% Moderate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                ≥85% Peak Rush
              </span>
            </div>
          </div>

          {/* 12-Hour Visual Bar Graph with Numbers & Condition-Colored Points */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 text-white space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200">Hourly Inflow Trajectory</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  (Physical Capacity: <strong className="text-amber-300">{spot.physicalCapacity.toLocaleString()}</strong> visitors)
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Click any hour to inspect details</span>
            </div>

            {/* Graph Canvas */}
            <div className="h-44 sm:h-52 flex items-end gap-1.5 sm:gap-2 px-1 relative pt-6 pb-2 border-b border-slate-800">
              {/* Capacity Threshold Line */}
              {(() => {
                const maxInflow = Math.max(...forecast.map(p => Number(p.inflow) || 0), spot.physicalCapacity * 1.15, 1000);
                const capPct = Math.min(95, Math.round((spot.physicalCapacity / maxInflow) * 100));
                return (
                  <div
                    style={{ bottom: `${capPct}%` }}
                    className="absolute left-0 right-0 border-b border-dashed border-rose-400/50 z-0 pointer-events-none flex items-center justify-end pr-2"
                  >
                    <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/80 shadow-sm">
                      100% Capacity ({spot.physicalCapacity.toLocaleString()})
                    </span>
                  </div>
                );
              })()}

              {forecast.slice(0, 12).map((pt, i) => {
                const dcc = Number(pt.dccScore ?? pt.dcc_score ?? 0);
                const inflow = Number(pt.inflow ?? 0);
                const maxInflow = Math.max(...forecast.map(p => Number(p.inflow) || 0), spot.physicalCapacity * 1.15, 1000);
                const barHeightPct = Math.max(14, Math.min(100, Math.round((inflow / maxInflow) * 100)));
                const isSelected = selectedForecastHour === i;
                const isBest = dcc < 0.60;
                
                const pointStatus = dcc >= 0.85 ? 'CRITICAL' : dcc >= 0.70 ? 'MODERATE' : 'OPTIMAL';
                const barGradient =
                  pointStatus === 'CRITICAL'
                    ? 'from-rose-600 to-rose-400 shadow-rose-950/40'
                    : pointStatus === 'MODERATE'
                    ? 'from-amber-600 to-amber-400 shadow-amber-950/40'
                    : 'from-emerald-600 to-emerald-400 shadow-emerald-950/40';

                const pointDotColor =
                  pointStatus === 'CRITICAL'
                    ? 'bg-rose-400 ring-rose-300'
                    : pointStatus === 'MODERATE'
                    ? 'bg-amber-400 ring-amber-300'
                    : 'bg-emerald-400 ring-emerald-300';

                const label = pt.timeLabel || pt.time_label || pt.hour;
                const pctFormatted = `${Math.round(dcc * 100)}%`;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedForecastHour(isSelected ? null : i)}
                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer z-10"
                  >
                    {/* Exact Number Callout (Always visible on top of bar) */}
                    <div className="absolute -top-6 text-center whitespace-nowrap transition-transform duration-200 group-hover:scale-110">
                      <span className={`text-[10px] font-black font-mono px-1 py-0.2 rounded ${
                        pointStatus === 'CRITICAL' ? 'text-rose-300' : pointStatus === 'MODERATE' ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {inflow >= 1000 ? `${(inflow / 1000).toFixed(1)}k` : inflow}
                      </span>
                    </div>

                    {/* Condition Colored Point Dot */}
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${pointDotColor} ${isBest ? 'ring-2 ring-emerald-300 shadow-emerald-400/50 shadow' : 'ring-2 ring-offset-1 ring-offset-slate-950'} mb-1 transition-all group-hover:scale-125 z-10`} />

                    {/* Bar Pillar */}
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className={`w-full max-w-[28px] rounded-t-md bg-gradient-to-t ${barGradient} transition-all duration-300 shadow-md ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 opacity-100'
                          : 'opacity-85 group-hover:opacity-100 group-hover:scale-105'
                      }`}
                    />

                    {/* Tooltip on hover */}
                    <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-800 text-white text-[9px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap z-30 border border-slate-700">
                      {label}: {inflow.toLocaleString()} ({pctFormatted})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Hour Labels */}
            <div className="flex gap-1.5 sm:gap-2 px-1 text-[9px] font-mono text-slate-400">
              {forecast.slice(0, 12).map((pt, i) => (
                <div key={i} className="flex-1 text-center truncate">
                  {(pt.timeLabel || pt.time_label || pt.hour).replace(':00', '')}
                </div>
              ))}
            </div>

            {/* Selected Hour Details Box */}
            {selectedForecastHour !== null && forecast[selectedForecastHour] && (() => {
              const pt = forecast[selectedForecastHour];
              const dcc = Number(pt.dccScore ?? pt.dcc_score ?? 0);
              const inflow = Number(pt.inflow ?? 0);
              const status = dcc >= 0.85 ? 'CRITICAL' : dcc >= 0.70 ? 'MODERATE' : 'OPTIMAL';
              const label = pt.timeLabel || pt.time_label || pt.hour;
              return (
                <div className="mt-2 p-3 bg-slate-900 border border-cyan-700/60 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-cyan-300 text-sm">{label}</span>
                    <span className="text-slate-300">
                      Predicted Arrivals: <strong className="text-white text-sm">{inflow.toLocaleString()} visitors</strong>
                    </span>
                    <span className="text-slate-300">
                      Capacity Utilization: <strong className="text-amber-300">{Math.round(dcc * 100)}%</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      status === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : status === 'MODERATE'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {status}
                    </span>
                    {dcc < 0.60 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                        ✨ Recommended Best Arrival Window
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedForecastHour(null)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded transition"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </div>

          {/* 12-Hour Hourly Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {forecast.slice(0, 12).map((pt, i) => {
              const dcc = Number(pt.dccScore ?? pt.dcc_score ?? 0);
              const inflow = Number(pt.inflow ?? 0);
              const isBest = dcc < 0.60;
              const pointStatus = dcc >= 0.85 ? 'CRITICAL' : dcc >= 0.70 ? 'MODERATE' : 'OPTIMAL';
              const dotColor = pointStatus === 'CRITICAL' ? 'bg-rose-500' : pointStatus === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500';
              const label = pt.timeLabel || pt.time_label || pt.hour;
              const pct = Math.round(dcc * 100);

              return (
                <div
                  key={i}
                  onClick={() => setSelectedForecastHour(selectedForecastHour === i ? null : i)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-between cursor-pointer ${
                    isBest
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-sm'
                      : selectedForecastHour === i
                      ? 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
                  <div className="my-1 flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <strong className="text-xs font-black text-slate-900">
                      {inflow >= 1000 ? `${(inflow / 1000).toFixed(1)}k` : inflow}
                    </strong>
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    isBest ? 'bg-emerald-600 text-white' : pointStatus === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : pointStatus === 'MODERATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isBest ? 'Best Time' : `${pct}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Historical Weekly Crowd Rhythm (With Visual Graph of Numbers & Colored Condition Points) ── */}
        {/* ── Historical Weekly Crowd Rhythm (Strictly Up to Current Date) ── */}
        {rollingWeeklyDays.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gov-navy" />
                  <span>Historical Crowd Analytics (Up to Current Date)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                    Recorded Up to Today
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Aggregated turnstile & telemetry logs strictly up to the current date ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}).
                </p>
              </div>

              {/* Weekly Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                  Optimal Day
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                  Moderate Surge
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                  Peak Congestion
                </span>
              </div>
            </div>

            {/* Weekly Visual Graph of Numbers */}
            <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 text-white space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200">7-Day Arrival Volume & Capacity Load (Past 7 Days → Today)</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Statutory Capacity Baseline: <strong className="text-amber-300">{spot.physicalCapacity.toLocaleString()}</strong>)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Click any day to inspect details</span>
              </div>

              {/* Graph Canvas */}
              <div className="h-44 sm:h-52 flex items-end gap-3 sm:gap-6 px-3 relative pt-6 pb-2 border-b border-slate-800">
                {/* 100% Capacity Reference Line */}
                {(() => {
                  const maxDayVisitors = Math.max(
                    ...rollingWeeklyDays.map(p => Math.round(spot.physicalCapacity * (p.typicalFootfallRatio || 0.5))),
                    spot.physicalCapacity * 1.25
                  );
                  const capPct = Math.min(95, Math.round((spot.physicalCapacity / maxDayVisitors) * 100));
                  return (
                    <div
                      style={{ bottom: `${capPct}%` }}
                      className="absolute left-0 right-0 border-b border-dashed border-rose-400/50 z-0 pointer-events-none flex items-center justify-end pr-2"
                    >
                      <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/80 shadow-sm">
                        100% Capacity Limit ({spot.physicalCapacity.toLocaleString()} visitors)
                      </span>
                    </div>
                  );
                })()}

                {rollingWeeklyDays.map((p, idx) => {
                  const ratio = p.typicalFootfallRatio ?? (p.level === 'CRITICAL' ? 1.15 : p.level === 'MODERATE' ? 0.75 : 0.35);
                  const estimatedVisitors = Math.round(spot.physicalCapacity * ratio);
                  const loadPct = Math.round(ratio * 100);
                  const maxDayVisitors = Math.max(
                    ...rollingWeeklyDays.map(pt => Math.round(spot.physicalCapacity * (pt.typicalFootfallRatio || 0.5))),
                    spot.physicalCapacity * 1.25
                  );
                  const barHeightPct = Math.max(16, Math.min(100, Math.round((estimatedVisitors / maxDayVisitors) * 100)));
                  const isSelected = selectedWeeklyDay === idx;

                  const barGradient =
                    p.level === 'CRITICAL'
                      ? 'from-rose-600 to-rose-400 shadow-rose-950/40'
                      : p.level === 'MODERATE'
                      ? 'from-amber-600 to-amber-400 shadow-amber-950/40'
                      : 'from-emerald-600 to-emerald-400 shadow-emerald-950/40';

                  const pointDotColor =
                    p.level === 'CRITICAL'
                      ? 'bg-rose-400 ring-rose-300'
                      : p.level === 'MODERATE'
                      ? 'bg-amber-400 ring-amber-300'
                      : 'bg-emerald-400 ring-emerald-300';

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedWeeklyDay(isSelected ? null : idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer z-10"
                    >
                      {/* Numerical Value Callout Above Bar */}
                      <div className="absolute -top-6 text-center whitespace-nowrap transition-transform duration-200 group-hover:scale-110">
                        <span className={`text-[11px] font-black font-mono px-1.5 py-0.5 rounded ${
                          p.level === 'CRITICAL' ? 'text-rose-300' : p.level === 'MODERATE' ? 'text-amber-300' : 'text-emerald-300'
                        }`}>
                          {estimatedVisitors >= 1000 ? `${(estimatedVisitors / 1000).toFixed(1)}k` : estimatedVisitors}
                        </span>
                      </div>

                      {/* Condition Colored Dot */}
                      <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${pointDotColor} ring-2 ring-offset-1 ring-offset-slate-950 mb-1 transition-all group-hover:scale-125 z-10`} />

                      {/* Bar Pillar */}
                      <div
                        style={{ height: `${barHeightPct}%` }}
                        className={`w-full max-w-[42px] rounded-t-lg bg-gradient-to-t ${barGradient} transition-all duration-300 shadow-md ${
                          isSelected
                            ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 opacity-100'
                            : 'opacity-85 group-hover:opacity-100 group-hover:scale-105'
                        }`}
                      />

                      {/* Tooltip on hover */}
                      <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-800 text-white text-[9px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap z-30 border border-slate-700">
                        {p.dayFull}: {estimatedVisitors.toLocaleString()} ({loadPct}% load)
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-Axis Day Labels */}
              <div className="flex gap-3 sm:gap-6 px-3 text-[10px] font-mono text-slate-400 font-bold">
                {rollingWeeklyDays.map((p, idx) => (
                  <div key={idx} className="flex-1 text-center truncate">
                    <span className={p.isToday ? 'text-amber-300 font-black' : ''}>{p.dayLabel}</span>
                    <span className="block text-[8px] text-slate-500 font-normal">{p.dateStr}</span>
                  </div>
                ))}
              </div>

              {/* Selected Day Details Box */}
              {selectedWeeklyDay !== null && rollingWeeklyDays[selectedWeeklyDay] && (() => {
                const p = rollingWeeklyDays[selectedWeeklyDay];
                const ratio = p.typicalFootfallRatio ?? (p.level === 'CRITICAL' ? 1.15 : p.level === 'MODERATE' ? 0.75 : 0.35);
                const estimatedVisitors = Math.round(spot.physicalCapacity * ratio);
                const loadPct = Math.round(ratio * 100);
                return (
                  <div className="mt-2 p-3 bg-slate-900 border border-amber-500/50 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-amber-300 text-sm">{p.dayFull}</span>
                      <span className="text-slate-300">
                        Estimated Footfall: <strong className="text-white text-sm">{estimatedVisitors.toLocaleString()} visitors</strong>
                      </span>
                      <span className="text-slate-300">
                        Carrying Capacity Load: <strong className="text-amber-300">{loadPct}%</strong>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        p.level === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : p.level === 'MODERATE'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {p.level}
                      </span>
                      <span className="text-slate-400 italic">
                        &ldquo;{p.note}&rdquo;
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedWeeklyDay(null)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded transition"
                    >
                      Close
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* 7-Day Interactive Information Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {rollingWeeklyDays.map((p, idx) => {
                const ratio = p.typicalFootfallRatio ?? (p.level === 'CRITICAL' ? 1.15 : p.level === 'MODERATE' ? 0.75 : 0.35);
                const estimatedVisitors = Math.round(spot.physicalCapacity * ratio);
                const loadPct = Math.round(ratio * 100);
                const badgeColor =
                  p.level === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                    : p.level === 'MODERATE'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300';

                const isSelected = selectedWeeklyDay === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedWeeklyDay(isSelected ? null : idx)}
                    className={`p-3 rounded-xl border flex flex-col justify-between text-center space-y-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                        : p.isToday
                        ? 'bg-amber-50/50 border-amber-300/80 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${p.isToday ? 'text-amber-700 font-bold' : 'text-slate-800'}`}>{p.dayLabel}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{loadPct}%</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono text-left">
                        {p.dateStr}
                      </div>
                      <div className="text-sm font-black text-slate-900 mt-0.5">
                        {estimatedVisitors.toLocaleString()}
                      </div>
                      <span className="text-[9px] text-slate-500 block">est. visitors</span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                      {p.level}
                    </span>

                    <p className="text-[9px] text-slate-500 line-clamp-2 leading-tight">
                      {p.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tap-to-Expand Data Provenance Breakdown (§6, §8) ── */}
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setProvenanceExpanded(!provenanceExpanded)}
            className="w-full flex items-center justify-between p-3.5 bg-slate-100 hover:bg-slate-200 rounded-2xl transition text-xs font-bold text-slate-800"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-gov-navy" />
              <span>Transparent Data Tier Provenance & Metric Audit (Click to {provenanceExpanded ? 'collapse' : 'audit'})</span>
            </div>
            {provenanceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {provenanceExpanded && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Every metric in EcoRoute Bharat is rigorously tagged with a genuine data tier. We do not claim an uninstalled live sensor network; estimates derive from real weather APIs, gazetted statutory arrivals, and a transparent formula.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-700">
                  <thead className="bg-slate-200/80 font-bold uppercase text-slate-600">
                    <tr>
                      <th className="py-2 px-3">Tier</th>
                      <th className="py-2 px-3">Component</th>
                      <th className="py-2 px-3">Source & Citation</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Weight / Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {telemetry.active_tiers.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-gov-navy">{t.tierLabel}</td>
                        <td className="py-2 px-3 font-semibold">{t.component}</td>
                        <td className="py-2 px-3">
                          <strong>{t.source}</strong>
                          <span className="block text-[10px] text-slate-400">{t.citation}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                            t.status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">{t.contribution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Statutory Carrying Capacity Source: {spot.base_capacity_source_citation}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. TWIN ALTERNATIVES (Capacity-aware, cosine similarity engine) ── */}
      {twins.length > 0 && (
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Peaceful Sister Spots (Queue-Free Alternatives)
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Escape the crowd at {spot.name}
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-white/90 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
              ✓ Zero Traffic & Easy Parking
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            We match your preferred holiday vibe ({spot.category}) with serene, uncrowded nearby sister destinations where you save hours in traffic, find ample parking, and enjoy tranquil nature.
          </p>

          <div className="p-3 bg-white/80 border border-emerald-300 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
            <span className="text-base shrink-0">💡</span>
            <p className="text-[11px] leading-relaxed">
              <strong>Tailored for Spontaneous & Pre-Booking Travelers:</strong> Recommended for motorists driving in without lodging or visitors planning upcoming trips. If you already have hotel reservations in <strong>{spot.name}</strong>, keep your stay — your entry is guaranteed!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {twins.map(twin => {
              const twinDest = twin.destination;
              return (
                <div
                  key={twinDest.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition shadow-sm p-4 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={twinDest.imageUrl}
                      alt={twinDest.name}
                      className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {Math.round(twin.similarityScore * 100)}% Match
                        </span>
                        <span className="text-[10px] font-bold text-gov-green">
                          -{twin.crowdReductionPct}% Fewer Visitors
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900">{twinDest.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{twinDest.tagline}</p>
                      <p className="text-[11px] text-slate-400">
                        {twin.travelTimeDeltaText}
                      </p>
                    </div>
                  </div>

                  {twin.activePromo && (
                    <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-bold text-amber-950">🎁 {twin.activePromo.badge}</span>
                      <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300 font-bold">
                        {twin.activePromo.code}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">
                      ~2.5 Hours Highway Delay Avoided
                    </span>
                    <Link
                      to={`/spot/${twinDest.id}`}
                      className="bg-gov-navy hover:bg-gov-navy-light text-amber-300 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1 shadow"
                    >
                      <span>Explore {twinDest.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 4. NEARBY & PRACTICAL INFO (Hotels, food/water, attractions, getting there) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Attractions & Practical Amenities */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-300 p-6 space-y-5 shadow-sm">
          <div>
            <span className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
              Local Practical Information
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Major Attractions & Civic Amenities
            </h2>
          </div>

          {/* Attractions */}
          {spot.majorAttractions && spot.majorAttractions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400">Highlights within {spot.name}</h3>
              <div className="space-y-2">
                {spot.majorAttractions.map((att, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{att.name}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{att.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OSM Amenity Nodes (Food, Water, Restrooms) */}
          {spot.nearbyAmenities && spot.nearbyAmenities.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase text-slate-400">OSM Overpass Verified Civic Points</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {spot.nearbyAmenities.map((am, i) => {
                  const icon = am.type === 'drinking_water'
                    ? <Droplet className="w-4 h-4 text-sky-600 shrink-0" />
                    : am.type === 'restaurant'
                    ? <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                    : <Info className="w-4 h-4 text-emerald-600 shrink-0" />;
                  return (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      {icon}
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{am.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{am.distanceMeters}m away</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Getting There */}
          {spot.gettingThere && (
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Navigation className="w-4 h-4 text-gov-navy" />
                <span>Getting There & Road Conditions</span>
              </div>
              <p className="text-slate-600">
                Primary Route: <strong>{spot.gettingThere.primaryRoute}</strong>
              </p>
              <p className="text-slate-600">
                Live ETA: <strong>{spot.gettingThere.liveEtaText}</strong>
              </p>
              {spot.gettingThere.bottleneckActive && spot.gettingThere.bypassSuggestion && (
                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 font-medium text-[11px]">
                  ⚠️ <strong>Choke Advisory:</strong> {spot.gettingThere.bypassSuggestion}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Lodging & Homestays (MTDC Boosted) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-slate-300 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
                Hospitality & Stays
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Verified Stays & Homestays
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                MTDC accredited eco-partners prioritized for sustainability
              </p>
            </div>

            {spot.nearbyHotels && (
              <div className="space-y-3">
                {spot.nearbyHotels.map((hotel, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border transition space-y-1 ${
                      hotel.mtdcPartner
                        ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{hotel.name}</h4>
                        <span className="text-[10px] text-slate-500">{hotel.type}</span>
                      </div>
                      {hotel.mtdcPartner && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-gov-navy text-amber-300 px-2 py-0.5 rounded shadow-sm shrink-0">
                          MTDC Partner
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="font-bold text-slate-800">{hotel.pricePerNight} <span className="font-normal text-[10px] text-slate-500">/ night</span></span>
                      <span className="text-xs text-amber-600 font-bold">★ {hotel.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <Link
              to={`/plan/new?spotId=${spot.id}`}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl text-center block transition"
            >
              Book Itinerary with Stays in Trip Planner →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. COMMUNITY CHECK-INS (Ratings 1-5 + Check In CTA) ── */}
      <section className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-gov-navy uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-gov-green" />
              Crowdsourced Ground Telemetry
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Recent Visitor Check-Ins & Reports ({checkIns.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setCheckInModalOpen(true)}
            className="bg-gov-green hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Check In Here (Report Crowd)</span>
          </button>
        </div>

        {checkIns.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No crowdsourced check-ins yet today. Be the first traveler to check in and verify ground conditions!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkIns.map(chk => (
              <div
                key={chk.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {chk.user_label}
                  </span>
                  <span className="text-[10px] text-slate-400">{chk.timestamp}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <span>Congestion: {chk.rating}/5</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({chk.rating <= 2 ? 'Light / Pleasant' : chk.rating === 3 ? 'Moderate' : 'Heavy Gridlock'})
                  </span>
                </div>

                {chk.comment && (
                  <p className="text-slate-600 leading-relaxed italic">
                    &ldquo;{chk.comment}&rdquo;
                  </p>
                )}

                {chk.geofence_verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono">
                    <ShieldCheck className="w-3 h-3" /> Geofence Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Official Incident Command Link (Decoupled Flow) ── */}
      {currentUser.role === 'authority' && (
        <section className="bg-slate-900 text-white rounded-2xl border border-slate-700 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shrink-0">
              🛡️
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Official Incident Command Mode Active
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Viewing {spot.name} as a Visitor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official gate inflow throttles, 4-hour XGBoost breach curves, and live gazette dispatches are managed in your dedicated Command Operations Center.
              </p>
            </div>
          </div>
          <Link
            to={`/authority/spot/${spot.id}`}
            className="shrink-0 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition shadow flex items-center gap-2"
          >
            <span>Open Tactical Command</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* PROVIDER PANEL (Visible only if currentUser.role === 'provider') */}
      {currentUser.role === 'provider' && (
        <section className="bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center border border-amber-300">
                🏨
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                  MTDC Verified Operator Management Panel
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  Manage Listing & Off-Peak Incentives for {spot.name}
                </h2>
              </div>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl font-mono font-bold">
              ROLE: PROVIDER ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Room Availability Editor */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gov-navy" />
                Live Room & Occupancy Editor
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Reported Property Occupancy:</span>
                  <strong className="text-gov-navy text-sm font-mono">{tempOccupancy}%</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={tempOccupancy}
                  onChange={e => setTempOccupancy(Number(e.target.value))}
                  className="w-full accent-gov-navy cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => updateDestinationHotelOccupancy(spot.id, tempOccupancy)}
                  className="w-full py-2 bg-gov-navy text-white text-xs font-bold rounded-xl hover:bg-gov-navy-light transition"
                >
                  Update Live Occupancy Status
                </button>
              </div>
            </div>

            {/* Off-Peak Promotion Publisher */}
            <form onSubmit={handlePublishPromo} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Publish Off-Peak Tourist Voucher
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={promoTitle}
                  onChange={e => setPromoTitle(e.target.value)}
                  placeholder="Promo title (e.g. 25% Off Lakeside Homestay)"
                  className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none"
                />
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Coupon code (e.g. ECO25)"
                  className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-xl font-mono uppercase focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600 font-semibold shrink-0">Discount: {promoDiscount}%</label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={promoDiscount}
                  onChange={e => setPromoDiscount(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shrink-0 transition"
                >
                  Publish Voucher
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ── CHECK-IN MODAL ── */}
      {checkInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gov-green" />
                <h3 className="font-extrabold text-base text-slate-900">Community Check-In</h3>
              </div>
              <button
                onClick={() => setCheckInModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Reporting from <strong>{spot.name}</strong>? Help fellow travelers by self-reporting current crowd congestion on ground.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Observed Congestion (1 = Empty, 5 = Severe Jam):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCheckInRating(val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      checkInRating === val
                        ? 'bg-gov-navy text-amber-300 border-gov-navy'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val}★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Optional note (e.g. parking status, road condition):
              </label>
              <textarea
                value={checkInComment}
                onChange={e => setCheckInComment(e.target.value)}
                placeholder="Clear trails, plenty of parking spaces near the lake…"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-gov-navy"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-[11px] text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Geofence verification automatically applied for valid telemetry weighting.</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCheckInModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  addCheckIn(checkInRating, checkInComment);
                  setCheckInModalOpen(false);
                  setCheckInComment('');
                }}
                className="flex-1 py-2.5 bg-gov-green hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Submit Check-In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gov-navy" />
                <h3 className="font-extrabold text-base text-slate-900">Share Live Destination Status</h3>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Share Card Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900">{spot.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusConfig.badge}`}>
                  {metrics.status}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Currently running at <strong>{crowdPercentage}%</strong> carrying capacity with an estimated wait of <strong>{metrics.waitTimeMinutes} mins</strong>.
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                EcoRoute Bharat • Ministry of Tourism
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
              >
                <span>Share via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareCopy}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <span>{shareCopied ? '✓ Link & Summary Copied!' : 'Copy Share Text & Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
