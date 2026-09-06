import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  MapPin 
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics } from '../lib/engine';
import { GlobalSearchBox } from '../components/common/GlobalSearchBox';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { destinations, divertedTripsCount } = useCorridorStore();

  // Top 5 spots for the live preview strip (§4.1)
  const previewSpots = destinations.slice(0, 5);

  const styleShortcuts = [
    { label: 'Scenic Escapes', tag: 'scenic', icon: '🏔️', hint: 'Misty hills and waterfalls' },
    { label: 'Budget Weekend', tag: 'budget', icon: '💰', hint: 'Affordable homestays' },
    { label: 'Adventure Treks', tag: 'adventure', icon: '🥾', hint: 'Cliff trails and forts' },
    { label: 'Family Getaways', tag: 'family', icon: '👨‍👩‍👧‍👦', hint: 'Peaceful lakeside parks' }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* ── HERO SECTION ── */}
      <section className="relative bg-gradient-to-b from-gov-navy to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-gov-gold overflow-hidden">
        {/* Subtle background ambient map graphic */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Government Initiative Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ministry of Tourism • Western Ghats & Maharashtra Corridor Telemetry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Travel without the crowds. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-200">
              Preserve Western Ghats ecology.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Check live crowds and parking wait times in real time, discover peaceful queue-free sister spots, and unlock exclusive discounts on verified homestays across the Western Ghats.
          </p>

          {/* 3-Tier Search Box (§2.1, §4.1) */}
          <div className="pt-4 max-w-2xl mx-auto">
            <GlobalSearchBox
              variant="hero"
              placeholder="Where are you thinking of going? (e.g. Matheran, Raigad, Pune)…"
            />
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Type any destination, district, or state to see live crowd gauges and alternatives.
            </p>
          </div>

          {/* Travel Style Quick Tags (§4.2) */}
          <div className="pt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold text-xs mr-1">Not sure yet?</span>
            {styleShortcuts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/discover?style=${s.tag}`)}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-1.5 rounded-xl border border-white/15 transition flex items-center gap-1.5 shadow-sm"
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4.1 LIVE PREVIEW STRIP (4-5 destinations with crowd badges) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-gov-navy uppercase tracking-wider">
                Live Tourist Guide
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Popular Destinations & Live Crowd Levels
              </h2>
            </div>
            <Link
              to="/discover"
              className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore all destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {previewSpots.map(spot => {
              const metrics = calculateDCCMetrics(spot);
              const statusBadge = {
                OPTIMAL: {
                  badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                  icon: <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />,
                  text: 'Comfortable'
                },
                MODERATE: {
                  badge: 'bg-amber-100 text-amber-900 border-amber-300',
                  icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
                  text: 'Moderate'
                },
                CRITICAL: {
                  badge: 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse',
                  icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
                  text: 'Overcrowded'
                }
              }[metrics.status];

              const crowdRatio = Math.round((spot.currentInflow / spot.physicalCapacity) * 100);

              return (
                <Link
                  key={spot.id}
                  to={`/spot/${spot.id}`}
                  className="group bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-gov-navy transition p-3.5 flex flex-col justify-between shadow-sm hover:shadow"
                >
                  <div className="space-y-2">
                    <div className="relative h-28 rounded-xl overflow-hidden">
                      <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {spot.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-gov-navy transition truncate">
                        {spot.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {spot.district}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 mt-2 flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusBadge.badge}`}>
                      {statusBadge.icon}
                      <span>{statusBadge.text}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {crowdRatio}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPOSITION / TOURIST BENEFITS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xl">
              🌿
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Skip The Jams, Find Hidden Gems
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When famous hotspots like Lonavala or Mahabaleshwar are packed, discover equally stunning, peaceful sister destinations like Bhandardara and Tapola just a short scenic drive away.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-800 flex items-center gap-1">
              <span>{divertedTripsCount.toLocaleString()} travelers guided away from highway jams</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold text-xl">
              ⏱️
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Live Crowd & 12-Hour Forecast
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Know before you go! Check real-time crowd meters, parking wait times, and weather conditions hour-by-hour so you always arrive when it's peaceful and calm.
            </p>
            <div className="pt-2 text-xs font-bold text-sky-800 flex items-center gap-1">
              <span>Hourly crowd & wait time predictions</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl">
              🎫
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              GreenPass Discounts & Perks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save big while traveling better! Unlock up to 35% OFF verified MTDC homestays, lakeside camping, and local adventure activities when you choose off-peak times or sister spots.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-900 flex items-center gap-1">
              <span>Up to 35% OFF stays, food & activities</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl border-2 border-gov-gold">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
            Ready for a calm, queue-free holiday?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Plan your next journey with EcoRoute Bharat
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Generate an intelligent multi-day itinerary that blends live weather forecasts, crowd bypasses, and budget-friendly verified stays.
          </p>
          <div className="pt-2 flex justify-center gap-3 flex-wrap">
            <Link
              to="/plan/new"
              className="bg-gov-gold hover:bg-amber-400 text-gov-navy font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Trip Planner</span>
            </Link>
            <Link
              to="/discover"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition border border-white/20"
            >
              Browse Under-Visited Feed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
