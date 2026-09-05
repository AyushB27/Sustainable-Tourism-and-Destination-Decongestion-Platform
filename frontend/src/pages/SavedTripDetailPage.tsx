import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Printer, 
  ArrowRight
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';

export const SavedTripDetailPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const { tripPlans, greenPasses, destinations } = useCorridorStore();

  const [copied, setCopied] = useState(false);

  // Find trip plan
  const plan = tripPlans.find(p => p.id === tripId) || tripPlans[0];
  const pass = greenPasses.find(g => g.trip_plan_id === plan?.id) || greenPasses[0];

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Trip Plan Not Found</h1>
        <Link to="/plan/new" className="text-xs text-gov-navy font-bold underline">
          Create a new trip plan →
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `🌿 My EcoRoute Bharat Itinerary (${plan.destinations.join(' & ')}): Saved ~${plan.totalCo2SavedKg} kg CO₂ and avoided peak traffic! Check details: ${shareUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── TOP NAV BAR ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/trips')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? '✓ Link Copied' : 'Share Plan'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-gov-navy text-white text-xs font-bold rounded-xl hover:bg-gov-navy-light transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Itinerary</span>
          </button>
        </div>
      </div>

      {/* ── TRIP HEADER ── */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Confirmed Green Yatra Plan • ID: {plan.id}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Eco-Balanced Travel Itinerary
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Travel Dates: <strong>{plan.dates.start}</strong> to <strong>{plan.dates.end}</strong> • Group: <strong className="capitalize">{plan.group_type}</strong> • Budget: <strong>{plan.budget_band}</strong>
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              🌱
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                Corridor Carbon Savings
              </span>
              <strong className="text-lg font-black text-emerald-950">
                ~{plan.totalCo2SavedKg} kg CO₂ Saved
              </strong>
            </div>
          </div>
        </div>

        {/* ── OFFICIAL GREENPASS VOUCHER CERTIFICATE (§7) ── */}
        {pass && (
          <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-navy text-white rounded-2xl p-5 sm:p-6 border-2 border-gov-gold shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-gov-gold text-gov-navy text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Govt Verified Green Pass
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">
                    CODE: {pass.code}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {pass.discountPct}% Off Homestay Voucher Issued
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Awarded for bypassing the overcrowded {pass.original_spot_name} bottleneck and choosing {pass.twin_spot_name}. Redeemable directly at {pass.operatorName}.
                </p>
              </div>

              {/* QR Code Digital Representation */}
              <div className="bg-white p-3 rounded-2xl text-slate-900 flex flex-col items-center justify-center shrink-0 shadow">
                <div className="w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center text-white text-[10px] font-mono text-center font-bold">
                  [QR PASS]
                  <br />
                  {pass.code.slice(-4)}
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 font-bold">SCAN AT CHECK-IN</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── DAY-BY-DAY ITINERARY CARDS ── */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gov-navy" />
          <span>Day-by-Day Journey Schedule</span>
        </h2>

        <div className="space-y-4">
          {plan.itinerary.map(day => {
            const dest = destinations.find(d => d.id === day.destinationId);
            return (
              <div
                key={day.dayNumber}
                className="bg-white rounded-3xl border-2 border-slate-200 p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gov-navy text-amber-300 font-black text-sm flex items-center justify-center">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">{day.date}</span>
                      <h3 className="font-extrabold text-base text-slate-900">
                        {day.destinationName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-xl border border-emerald-300">
                      Crowd Status: {day.estimatedCrowdLevel}
                    </span>
                    {dest && (
                      <Link
                        to={`/spot/${dest.id}`}
                        className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
                      >
                        <span>Spot Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* 3 Periods: Morning, Afternoon, Evening */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Morning (07:00 - 11:30)
                    </span>
                    <p className="text-slate-700 leading-relaxed">{day.morningActivity}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-sky-600 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Afternoon (12:00 - 16:30)
                    </span>
                    <p className="text-slate-700 leading-relaxed">{day.afternoonActivity}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Evening & Night (17:00+)
                    </span>
                    <p className="text-slate-700 leading-relaxed">{day.eveningActivity}</p>
                  </div>
                </div>

                {/* Practical Lodging & Route Transit Tip */}
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                      Recommended Verified Stay:
                    </span>
                    <div className="font-bold text-slate-900">{day.recommendedLodging}</div>
                  </div>
                  <div className="text-[11px] text-slate-600 sm:text-right max-w-sm">
                    <strong>Transit Tip:</strong> {day.transitTip}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
