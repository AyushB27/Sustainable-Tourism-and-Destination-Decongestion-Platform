import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  MapPin,
  Trees,
  Car,
  Award,
  Compass,
  Building2,
  CheckCircle2,
  Activity,
  Layers,
  Leaf,
  Users,
  Store,
  HeartHandshake,
  Coins,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics } from '../lib/engine';
import { GlobalSearchBox } from '../components/common/GlobalSearchBox';
import { GreenCertificateModal } from '../components/common/GreenCertificateModal';

export const LandingPage: React.FC = () => {
  const { destinations, divertedTripsCount } = useCorridorStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // Filter destinations based on category tab
  const filteredDestinations = selectedCategory === 'ALL'
    ? destinations
    : destinations.filter(d => d.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  // Telemetry metrics across all 21 locations
  const totalCapacity = destinations.reduce((sum, d) => sum + d.physicalCapacity, 0);
  const totalInflow = destinations.reduce((sum, d) => sum + d.currentInflow, 0);
  const avgUtilization = totalCapacity > 0 ? Math.round((totalInflow / totalCapacity) * 100) : 62;
  const criticalSpotsCount = destinations.filter(d => {
    const m = calculateDCCMetrics(d);
    return m.status === 'CRITICAL';
  }).length;

  const styleShortcuts = [
    { label: 'Misty Ghats', tag: 'Hill Station', icon: '🏔️', hint: 'Foggy Sahyadri passes' },
    { label: 'Coastal & Forts', tag: 'Coastal', icon: '🌊', hint: 'Sea bastions & white sands' },
    { label: 'Heritage Treks', tag: 'Heritage', icon: '🏰', hint: 'Maratha ramparts & caves' },
    { label: 'Sacred Groves', tag: 'Pilgrimage', icon: '🛕', hint: 'Spiritual origins & devrais' }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* ── 1. HERO WITH LIVE CORRIDOR TELEMETRY ── */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400 overflow-hidden">
        {/* Ambient Topographic Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          {/* Government Corridor Ticker */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SIH-26204 • Ministry of Tourism & Government of Maharashtra</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>🛰️ Western Ghats Bio-Corridors: <strong className="text-emerald-400">21 Monitored</strong></span>
              <span>⚡ Live Telemetry: <strong className="text-sky-400">Active</strong></span>
            </div>
          </div>

          {/* Core Title & Mission */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Transforming Tourism into a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-400 to-teal-300">
                Sustainable, Low-Impact Journey
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Instead of asking <em>"Where should I go?"</em>, EcoRoute Bharat answers: 
              <strong className="text-emerald-300 font-semibold"> "How can I visit while cutting emissions, supporting rural homestays, eliminating plastic, and skipping highway jams?"</strong>
            </p>
          </div>

          {/* Live Telemetry Ticker Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center backdrop-blur-md">
              <div className="text-2xl font-black text-emerald-400">
                {(divertedTripsCount * 3.4).toFixed(0)}+ kg
              </div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-1">
                <Trees className="w-3 h-3 text-emerald-400" />
                <span>Avoided CO2e</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center backdrop-blur-md">
              <div className="text-2xl font-black text-amber-300">
                {divertedTripsCount.toLocaleString()}
              </div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-1">
                <Car className="w-3 h-3 text-amber-400" />
                <span>Travelers Diverted</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center backdrop-blur-md">
              <div className="text-2xl font-black text-sky-400">
                {avgUtilization}%
              </div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-1">
                <Activity className="w-3 h-3 text-sky-400" />
                <span>Corridor Capacity</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center backdrop-blur-md">
              <div className="text-2xl font-black text-rose-400">
                {criticalSpotsCount}
              </div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-1">
                <AlertOctagon className="w-3 h-3 text-rose-400" />
                <span>Ghat Bottlenecks</span>
              </div>
            </div>
          </div>

          {/* Search Box & Style Tags */}
          <div className="max-w-2xl mx-auto space-y-3">
            <GlobalSearchBox
              variant="hero"
              placeholder="Search by spot name, district, or eco-category (e.g., Matheran, Kaas, Pune)..."
            />
            
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs pt-1">
              <span className="text-slate-400 font-semibold text-xs mr-1">Quick themes:</span>
              {styleShortcuts.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(s.tag)}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1 rounded-xl border border-white/15 transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/plan"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Launch Green Trip Planner</span>
            </Link>
            <Link
              to="/select-portal"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>1-Click Stakeholder Auth Demo</span>
            </Link>
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="px-5 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-sm flex items-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View Sample MTDC Green Certificate</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2A. THE 3 CORE PILLARS OF SUSTAINABILITY ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
            Holistic Impact Framework
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The 3 Pillars of Sustainable Tourism
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            Balancing environmental protection, cultural heritage respect, and direct village economic empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Environmental */}
          <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 space-y-4 shadow-sm hover:border-emerald-500 transition group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Leaf className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Weight: 40%
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition">
                🌱 Environmental Stewardship
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Aggressive carbon footprint reduction, zero single-use plastic, dynamic carrying capacity (DCC), and ecological buffer protection.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Round-trip & local transit CO2e calculation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dynamic Carrying Capacity (DCC) throttling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero-waste trail geotagging & clean-up squads</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Social */}
          <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 space-y-4 shadow-sm hover:border-sky-500 transition group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-black">
                <Users className="w-6 h-6 text-sky-700" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Weight: 30%
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition">
                👥 Social & Cultural Heritage
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Preservation of sacred devrais (sacred groves), respectful pilgrim etiquette, native storyteller guides, and barrier-free trails.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Sacred grove preservation & silence corridors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Native storyteller & guide union bookings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Multilingual Marathi/Hindi/English audio tours</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Economic */}
          <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 space-y-4 shadow-sm hover:border-amber-500 transition group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <Coins className="w-6 h-6 text-amber-700" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Weight: 30%
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition">
                💰 Local Economic Retention
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Direct tourist spending retained within rural villages, farm-to-table strawberry cooperatives, and Warli artisan guilds.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>90%+ revenue retained in village homestays</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Direct farmer cooperative & FPO integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Off-peak traveler diversion into rural districts</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 2B. THE 8-STAGE CLOSED-LOOP FEEDBACK ARCHITECTURE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>SIH-26204 Closed Ecosystem Loop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              The 8-Stage Continuous Improvement Feedback Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              From the moment a traveler explores a destination to post-trip data analysis by district collectors, every stage feeds into corridor preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '01', title: 'Discover', desc: 'Live DCC telemetry & AI twin suggestions divert crowds before departure.', icon: <Eye className="w-4 h-4 text-emerald-400" /> },
              { num: '02', title: 'Plan', desc: 'Multi-modal transit generator cuts emissions using trains, EVs & bypass hubs.', icon: <Compass className="w-4 h-4 text-sky-400" /> },
              { num: '03', title: 'Measure', desc: 'Real-time 3D sustainability score (Env, Soc, Econ) calculated per itinerary.', icon: <Activity className="w-4 h-4 text-amber-400" /> },
              { num: '04', title: 'Travel Sustainably', desc: 'Use electric shuttles at Valvan & Dasturi, hire native village guides.', icon: <Car className="w-4 h-4 text-teal-400" /> },
              { num: '05', title: 'Reward', desc: 'Earn Eco-Karma points, redeem MTDC credits, and earn verified certificates.', icon: <Award className="w-4 h-4 text-yellow-400" /> },
              { num: '06', title: 'Report', desc: 'Citizens report trail litter & overcrowding incidents via geo-tagged photos.', icon: <AlertTriangle className="w-4 h-4 text-rose-400" /> },
              { num: '07', title: 'Analyze', desc: 'District GIS engine correlates live sensor feeds and tourist waste reports.', icon: <Layers className="w-4 h-4 text-indigo-400" /> },
              { num: '08', title: 'Improve', desc: 'Authorities execute emergency capacity overrides and dynamic pricing.', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> }
            ].map((st) => (
              <div key={st.num} className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-emerald-400">{st.num}</span>
                  {st.icon}
                </div>
                <h4 className="font-extrabold text-sm text-white">{st.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. THE 5 DECOUPLED STAKEHOLDER PORTALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
              <Layers className="w-3.5 h-3.5" />
              <span>Decoupled Role-Based Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              5 Distinct Stakeholder Portals, 1 Unified Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed with strict architectural decoupling: Citizen queries run on scalable read-replicas without impeding emergency municipal authority dispatch or local village registrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Persona 1: Citizen Tourist */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-emerald-500/40 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  1. Citizen Tourist
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Low-emission itineraries, carbon calculations, and verified MTDC Green Certificates.
                </p>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Multi-day Green Planner</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>24x7 AI Helpline Bot</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/discover"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch Tourist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Persona 2: District GIS Authority */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-amber-500/40 flex flex-col justify-between space-y-4 hover:border-amber-400 transition">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  2. GIS Authority
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Corridor telemetry, Gazette advisories, and emergency capacity overrides.
                </p>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Capacity Overrides</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Gazette Advisories</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?role=authority"
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch Authority</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Persona 3: MTDC Provider & Operator */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-sky-500/40 flex flex-col justify-between space-y-4 hover:border-sky-400 transition">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  3. MTDC Operator
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Accredited homestays, dynamic vacancy updates, and off-peak discount codes.
                </p>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>Live Vacancy Sliders</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>Off-Peak Flash Sales</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth?role=provider"
                className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch Operator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Persona 4: Eco-NGO Clean-up Squad */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-emerald-400/40 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-300 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  4. Eco-NGO Desk
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Citizen incident queue, clean-up squad deployment, and plastic waste recovery metrics.
                </p>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Citizen Waste Triage</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Volunteer Dispatch</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/ngo"
                className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch NGO Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Persona 5: Village Community & Gram Panchayat */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-purple-500/40 flex flex-col justify-between space-y-4 hover:border-purple-400 transition">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  5. Community Desk
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Showcase tribal handicrafts, strawberry cooperatives, and native trek guide unions.
                </p>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>Local Experience Desk</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>Revenue Retention</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/community"
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch Community</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MODERN TRAVEL DISCOVERY FEED (21+ DESTINATIONS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest">
              Live Sensor Feed • 21 Western Ghats Locations
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Live Crowd Telemetry & Destination Catalog
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'Hill Station', 'Coastal', 'Heritage', 'Pilgrimage'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat === 'ALL' ? 'All 21 Spots' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDestinations.slice(0, 12).map((spot) => {
            const metrics = calculateDCCMetrics(spot);
            const statusConfig = {
              OPTIMAL: {
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />,
                label: 'Comfortable'
              },
              MODERATE: {
                badge: 'bg-amber-100 text-amber-900 border-amber-300',
                icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
                label: 'Moderate'
              },
              CRITICAL: {
                badge: 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse',
                icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
                label: 'Overcrowded'
              }
            }[metrics.status];

            const crowdRatio = Math.round((spot.currentInflow / spot.physicalCapacity) * 100);

            return (
              <Link
                key={spot.id}
                to={`/spot/${spot.id}`}
                className="group bg-white hover:bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition p-3.5 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      {spot.category}
                    </span>
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                      {spot.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition truncate">
                      {spot.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{spot.district}, Maharashtra</span>
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 pt-1">
                      {spot.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusConfig.badge}`}>
                    {statusConfig.icon}
                    <span>{statusConfig.label}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {crowdRatio}% capacity
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all button */}
        <div className="text-center pt-2">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300"
          >
            <span>View Full 21 Destination Catalog in Discover Feed</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── 5. CITIZEN REWARDS & GREEN KARMA SPOTLIGHT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-500/40 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>Pillar 2 & 3 • Citizen Rewards</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Earn Green Karma Points & Redeem MTDC Vouchers
              </h2>
            </div>
            <Link
              to="/account"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition self-start md:self-auto"
            >
              <span>View My Rewards Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="text-2xl font-black text-emerald-400">+100 Pts</div>
              <h3 className="font-bold text-sm text-white">Report Waste Hotspots</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Geo-tag plastic litter along mountain passes. Authority clean-up vans are dispatched automatically.
              </p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="text-2xl font-black text-amber-300">+150 Pts</div>
              <h3 className="font-bold text-sm text-white">Electric & Rail Transit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take electric train to Neral or local shared e-shuttles into Matheran to prevent vehicular exhaust.
              </p>
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
              <div className="text-2xl font-black text-sky-400">+100 Pts</div>
              <h3 className="font-bold text-sm text-white">Stay at Village Homestays</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book MTDC-accredited rural homestays to ensure 85% of your travel spend stays with local farming families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Certificate Modal */}
      <GreenCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        travelerName="Aarav Sharma"
        destinationName="Matheran Eco-Zone & Charlotte Lake"
        carbonSavedKg={24.8}
      />
    </div>
  );
};
