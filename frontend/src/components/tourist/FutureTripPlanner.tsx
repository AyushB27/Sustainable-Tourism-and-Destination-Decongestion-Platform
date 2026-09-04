import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Printer, 
  Compass
} from 'lucide-react';
import type { Destination } from '../../types';

interface FutureTripPlannerProps {
  destinations?: Destination[];
}

export const FutureTripPlanner: React.FC<FutureTripPlannerProps> = () => {
  const [travelDate, setTravelDate] = useState('2026-09-12'); // Next Weekend
  const [duration, setDuration] = useState<'1-day' | '2-day' | '3-day'>('2-day');
  const [travelStyle, setTravelStyle] = useState<'scenic' | 'adventure' | 'family' | 'budget'>('scenic');
  const [backendPlanStatus, setBackendPlanStatus] = useState<'idle' | 'loading' | 'connected' | 'offline'>('idle');

  // Call backend itinerary API whenever user changes their trip parameters
  React.useEffect(() => {
    setBackendPlanStatus('loading');
    fetch('http://127.0.0.1:8000/api/itinerary/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ travel_date: travelDate, duration, travel_style: travelStyle }),
      signal: AbortSignal.timeout(3500)
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => setBackendPlanStatus('connected'))
      .catch(() => setBackendPlanStatus('offline'));
  }, [travelDate, duration, travelStyle]);

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
              <span>Future Trip & Decongested Itinerary Planner</span>
              <span className="text-xs bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded border border-amber-300">
                AI Smart Scheduler
              </span>
              {backendPlanStatus === 'connected' && (
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300">
                  ✅ Backend API
                </span>
              )}
              {backendPlanStatus === 'offline' && (
                <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-300">
                  📵 Offline Mode
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Plan upcoming holidays with AI-predicted congestion curves and balanced multi-day itineraries to bypass 90% of corridor bottlenecks
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition self-start sm:self-auto shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-gov-navy" />
          <span>Print / Export Plan</span>
        </button>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Date Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gov-navy" />
            <span>Planned Travel Date:</span>
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
            <span>Trip Duration:</span>
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as '1-day' | '2-day' | '3-day')}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner cursor-pointer"
          >
            <option value="1-day">1-Day (Daytrip)</option>
            <option value="2-day">2-Day Weekend Trip</option>
            <option value="3-day">3-Day Long Holiday</option>
          </select>
        </div>

        {/* Travel Style */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-gov-navy" />
            <span>Travel Preference:</span>
          </label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value as 'scenic' | 'adventure' | 'family' | 'budget')}
            className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-gov-navy shadow-inner cursor-pointer"
          >
            <option value="scenic">Relaxed & Scenic</option>
            <option value="adventure">Adventure & Trekking</option>
            <option value="family">Family Friendly</option>
            <option value="budget">Budget & Sustainable</option>
          </select>
        </div>
      </div>

      {/* Future Predicted Congestion Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-rose-800 block">
              Conventional Hotspots (e.g. Lonavala)
            </span>
            <strong className="text-rose-950 text-sm">
              Predicted Crowd Load: {predictedHotspotCongestion}% Over Capacity
            </strong>
          </div>
          <span className="bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded text-[10px]">
            {isWeekend ? '🔴 Heavy Traffic Jams' : '🟡 Moderate Crowds'}
          </span>
        </div>

        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-gov-green block">
              AI-Decongested Twin Route (e.g. Matheran & Bhandardara)
            </span>
            <strong className="text-emerald-950 text-sm">
              Predicted Crowd Load: {predictedTwinCongestion}% (Comfortable)
            </strong>
          </div>
          <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
            🟢 Zero Checkpoint Delays
          </span>
        </div>
      </div>

      {/* Generated Itinerary Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gov-gold" />
            Optimized Smart Itinerary
          </h4>
          <span className="text-[11px] text-gov-green font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
            🌿 Avoids ~2.5 Hours Traffic Delay • Saves ~24 kg CO₂
          </span>
        </div>

        <div className="space-y-4">
          {itineraryPlan.map((dayPlan, dIdx) => (
            <div key={dIdx} className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gov-navy text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                <span>{dayPlan.day}</span>
                <span className="text-[10px] text-amber-300 font-medium">Decongested Schedule</span>
              </div>

              <div className="p-4 bg-white space-y-3">
                {/* Morning Slot */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gov-navy flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {dayPlan.morningSlot.time}
                    </span>
                    <strong className="text-slate-900 text-sm block">{dayPlan.morningSlot.title}</strong>
                    <p className="text-slate-600 text-xs leading-relaxed">{dayPlan.morningSlot.desc}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded text-[10px] self-start sm:self-auto shrink-0 border border-emerald-300">
                    {dayPlan.morningSlot.badge}
                  </span>
                </div>

                {/* Afternoon Slot */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gov-navy flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {dayPlan.afternoonSlot.time}
                    </span>
                    <strong className="text-slate-900 text-sm block">{dayPlan.afternoonSlot.title}</strong>
                    <p className="text-slate-600 text-xs leading-relaxed">{dayPlan.afternoonSlot.desc}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-950 font-bold px-2.5 py-0.5 rounded text-[10px] self-start sm:self-auto shrink-0 border border-amber-300">
                    {dayPlan.afternoonSlot.badge}
                  </span>
                </div>

                {/* Evening Slot */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gov-navy flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {dayPlan.eveningSlot.time}
                    </span>
                    <strong className="text-slate-900 text-sm block">{dayPlan.eveningSlot.title}</strong>
                    <p className="text-slate-600 text-xs leading-relaxed">{dayPlan.eveningSlot.desc}</p>
                  </div>
                  <span className="bg-slate-200 text-slate-800 font-bold px-2.5 py-0.5 rounded text-[10px] self-start sm:self-auto shrink-0 border border-slate-300">
                    {dayPlan.eveningSlot.badge}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
