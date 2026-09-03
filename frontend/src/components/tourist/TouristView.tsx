import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Car, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  QrCode, 
  Tag, 
  Search, 
  SlidersHorizontal 
} from 'lucide-react';

export const TouristView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      {/* Landscape Container */}
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. Header & Quick Discovery Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wide uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Live Western Ghats Corridor Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Where would you like to travel?
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time crowd monitoring and queue-free scenic alternatives across Maharashtra
            </p>
          </div>

          {/* Quick Destination Search & Filter */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                defaultValue="Lonavala & Khandala"
                placeholder="Search destination..."
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <button
              type="button"
              className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm text-slate-700 focus:outline-none"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 2. Destination Category Switcher (Hardcoded Structural Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            type="button"
            className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-sm shrink-0"
          >
            All Destinations
          </button>
          <button
            type="button"
            className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl shadow-sm shrink-0"
          >
            Hill Stations
          </button>
          <button
            type="button"
            className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl shadow-sm shrink-0"
          >
            Coastal & Beaches
          </button>
          <button
            type="button"
            className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl shadow-sm shrink-0"
          >
            Heritage Forts
          </button>
          <button
            type="button"
            className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl shadow-sm shrink-0"
          >
            Lakes & Waterfalls
          </button>
        </div>

        {/* 3. PRIMARY ACTION & LIVE COMPARISON GRID (Landscape 2-Column Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (5 Cols): Selected Hotspot Status */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-5"
          >
            {/* Visual Destination Header */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden h-48 sm:h-52 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1609864087968-30642456ec48?auto=format&fit=crop&w=1000&q=80"
                  alt="Lonavala and Khandala Ghats"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  🔴 Heavily Crowded
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white bg-slate-950/70 backdrop-blur-sm p-2.5 rounded-xl">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    Pune District • 2.5 hrs from Mumbai
                  </span>
                  <h2 className="text-lg font-black">Lonavala & Khandala Ghats</h2>
                </div>
              </div>
            </div>

            {/* Live Metrics Minimalist Grid */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-700" />
                  <span>Crowd</span>
                </div>
                <div className="text-base font-black text-slate-900 mt-1">4,800</div>
                <div className="text-[10px] text-rose-600 font-bold mt-0.5">138% Over Cap</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Traffic Delay</span>
                </div>
                <div className="text-base font-black text-rose-600 mt-1">+45 mins</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Ghat Checkpoint</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Car className="w-3.5 h-3.5 text-slate-700" />
                  <span>Parking</span>
                </div>
                <div className="text-base font-black text-slate-900 mt-1">92%</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Near Saturation</div>
              </div>
            </div>

            {/* Travel Warning Bulletin */}
            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl text-xs text-rose-950 space-y-1">
              <span className="font-extrabold uppercase text-[10px] text-rose-700 block">
                Official Police Advisory
              </span>
              <p className="leading-relaxed">
                Heavy monsoon traffic jam on Khandala tunnel curves. Viewpoint parking lots are full.
              </p>
            </div>
          </motion.section>

          {/* Right Column (7 Cols): The Hero Decongested Solution */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-500/20 relative space-y-5"
          >
            {/* Recommendation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                  ✨ Recommended Eco-Twin Destination
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                  Matheran Eco-Heritage Plateau
                </h3>
              </div>
              <div className="self-start sm:self-auto text-right">
                <span className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-full">
                  Only 35 mins away
                </span>
              </div>
            </div>

            {/* Visual Media & Experience Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden h-44 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80"
                  alt="Matheran Eco Plateau"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  🟢 80% Fewer Crowds
                </div>
              </div>

              <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Asia's only automobile-free hill station. Enjoy mist-covered red mud trails, Charlotte Lake, and panoramic valley viewpoints with zero vehicle noise or traffic jams.
                </p>

                {/* Hardcoded Feature Pills */}
                <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-700">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">🌲 Eco-Protected Zone</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">🐴 Horse Trails</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg">💧 Waterfall Views</span>
                </div>
              </div>
            </div>

            {/* Incentive Subsidy Banner */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <strong className="text-amber-950 font-bold">25% MTDC Homestay Discount</strong>
                  <span className="text-slate-600 block text-[11px]">Use verified promo code at check-in</span>
                </div>
              </div>
              <span className="bg-white px-2.5 py-1 rounded-xl font-mono font-bold text-amber-900 border border-amber-300 text-xs shadow-sm">
                HOMESTAY25
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              className="w-full bg-slate-900 text-white font-extrabold py-3.5 px-5 rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 focus:outline-none"
            >
              <span>Choose Matheran & Get Priority Travel Pass</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </motion.section>
        </div>

        {/* 4. SECONDARY SECTION: BEST TIMES TO VISIT TODAY (Horizontal Landscape Row) */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Best Departure Times for Today
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hourly traffic velocity forecast to help you bypass mountain highway checkpoints
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
              Save up to 60 minutes
            </span>
          </div>

          {/* 4 Hardcoded Time-Slot Cards in Responsive Landscape Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Slot 1: Dawn */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">06:00 AM – 09:00 AM</span>
                <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                  Best Time
                </span>
              </div>
              <div className="text-xs font-bold text-emerald-950">Early Morning Dawn</div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Smooth expressway drive with zero checkpoint queues.
              </p>
            </div>

            {/* Slot 2: Mid-Morning */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">09:30 AM – 01:00 PM</span>
                <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Moderate
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">Morning Tourist Flow</div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Expect 15–20 min slow movement at toll plazas.
              </p>
            </div>

            {/* Slot 3: Peak Afternoon */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">01:30 PM – 05:00 PM</span>
                <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                  Peak Rush
                </span>
              </div>
              <div className="text-xs font-bold text-rose-950">Afternoon Congestion</div>
              <p className="text-[11px] text-rose-800 leading-snug">
                Heavy bottleneck. We suggest avoiding travel during this window.
              </p>
            </div>

            {/* Slot 4: Sunset */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">05:30 PM Onwards</span>
                <span className="bg-emerald-100 text-emerald-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Comfortable
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">Sunset & Evening</div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Ideal for overnight stays and peaceful homestay check-ins.
              </p>
            </div>
          </div>
        </section>

        {/* 5. TERTIARY SECTION: FUTURE ITINERARY & DIGITAL PASS (Landscape 2-Column Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: 2-Day Multi-Day Itinerary (7 Cols) */}
          <section className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-800" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Recommended Weekend Itinerary
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">2-Day Balanced Plan</span>
            </div>

            <div className="space-y-3">
              {/* Day 1 */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">Day 1: Saturday</span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md">
                    Morning Slot
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800">
                  07:00 AM • Scenic Matheran Arrival & Charlotte Lake
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Arrive early before day-tripper influx. Enjoy breakfast at an accredited MTDC heritage café.
                </p>
              </div>

              {/* Day 2 */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">Day 2: Sunday</span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md">
                    Afternoon Slot
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800">
                  01:30 PM • Bhandardara Lakeside Nature Walk
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Relax along pristine waters with 85% fewer tourists, followed by an easy highway return.
                </p>
              </div>
            </div>
          </section>

          {/* Right: Digital Green Travel Pass (5 Cols) */}
          <section className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Green Travel Pass
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">ID: ECO-MH-902</span>
            </div>

            {/* Pass Card */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Verified Destination
                  </span>
                  <div className="font-extrabold text-sm">Matheran Eco-Corridor</div>
                </div>
                <div className="p-2 bg-white text-slate-900 rounded-xl">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Toll Priority</span>
                  <strong className="text-white">Green Lane Active</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Carbon Offset</span>
                  <strong className="text-emerald-400">~18.5 kg CO₂ Saved</strong>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Present this digital pass at toll plazas for streamlined green-lane transit.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
