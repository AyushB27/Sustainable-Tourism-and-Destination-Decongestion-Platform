import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  Compass 
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';

export const MyTripsPage: React.FC = () => {
  const { tripPlans, greenPasses, deleteTripPlan } = useCorridorStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-extrabold text-gov-navy uppercase tracking-wider">
            Traveler Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
            My Saved Trips & Green Passes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your saved itineraries, redeemable homestay discounts, and eco-certified certificates.
          </p>
        </div>

        <Link
          to="/plan/new"
          className="bg-gov-gold hover:bg-amber-400 text-gov-navy font-black text-xs px-5 py-3 rounded-2xl shadow transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan a New Trip</span>
        </Link>
      </div>

      {/* ── SECTION 1: ACTIVE GREEN PASSES ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-gov-green" />
            <span>Active Green Yatra Passes ({greenPasses.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Redeemable with verified MTDC partners</span>
        </div>

        {greenPasses.length === 0 ? (
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No Green Passes issued yet. Choose an alternative twin route in the trip planner to earn exclusive eco-rewards and homestay discounts!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {greenPasses.map(pass => (
              <div
                key={pass.id}
                className="bg-gradient-to-r from-gov-navy to-slate-900 text-white rounded-3xl p-5 border-2 border-gov-gold shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="bg-gov-gold text-gov-navy text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      {pass.discountPct}% Discount Voucher
                    </span>
                    <h3 className="font-extrabold text-base text-white mt-1">
                      {pass.twin_spot_name}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Rerouted from {pass.original_spot_name} • Saved {pass.co2_saved_kg} kg CO₂
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs text-amber-300 font-bold block">
                      {pass.code}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">
                      ● Active
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-300 text-[11px]">
                    Operator: <strong>{pass.operatorName}</strong>
                  </span>
                  {pass.trip_plan_id && (
                    <Link
                      to={`/plan/${pass.trip_plan_id}`}
                      className="text-amber-300 hover:underline font-bold text-xs flex items-center gap-1"
                    >
                      <span>View Itinerary</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 2: SAVED TRIPS ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gov-navy" />
          <span>Saved Itineraries ({tripPlans.length})</span>
        </h2>

        {tripPlans.length === 0 ? (
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
            <Compass className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">No saved trips yet</h3>
            <p className="text-xs text-slate-500">
              Start building your holiday plan with our forecast-aware trip wizard.
            </p>
            <Link
              to="/plan/new"
              className="inline-block px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl"
            >
              Start Trip Planner
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tripPlans.map(plan => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-gov-navy transition p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">ID: {plan.id}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded capitalize">
                      {plan.group_type}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      ~{plan.totalCo2SavedKg} kg CO₂ saved
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900">
                    {plan.itinerary.map(i => i.destinationName).join(' → ')}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Travel Window: <strong>{plan.dates.start}</strong> to <strong>{plan.dates.end}</strong> • Budget: <strong>{plan.budget_band}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteTripPlan(plan.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                    title="Delete trip plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/plan/${plan.id}`}
                    className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-amber-300 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
