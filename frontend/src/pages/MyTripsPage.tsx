import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  Compass,
  Award,
  Coins,
  Users
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { GreenCertificateModal } from '../components/common/GreenCertificateModal';

export const MyTripsPage: React.FC = () => {
  const { tripPlans, greenPasses, deleteTripPlan, fetchUserTrips } = useCorridorStore();

  const [selectedCertTrip, setSelectedCertTrip] = useState<any | null>(null);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    fetchUserTrips().finally(() => setLoadingTrips(false));
  }, [fetchUserTrips]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Green Certificate Modal */}
      {selectedCertTrip && (
        <GreenCertificateModal
          isOpen={!!selectedCertTrip}
          onClose={() => setSelectedCertTrip(null)}
          travelerName="Eco-Conscious Traveler"
          destinationName={selectedCertTrip.destinationName || 'Western Ghats Bio-Corridor'}
          carbonSavedKg={selectedCertTrip.carbonAvoidedKg || selectedCertTrip.totalCo2SavedKg || 34.2}
          dateStr={selectedCertTrip.startDate || selectedCertTrip.dates?.start || new Date().toLocaleDateString()}
          certificateId={`CERT-MH-${selectedCertTrip.id || Math.floor(100000 + Math.random() * 900000)}`}
        />
      )}

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

      {/* ── SECTION 2: SAVED TRIPS & ITINERARIES ── */}
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
        ) : loadingTrips ? (
          <div className="p-8 text-center text-slate-500">
            <span className="w-6 h-6 border-2 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto block mb-2" />
            Loading your trips...
          </div>
        ) : (
          <div className="space-y-4">
            {tripPlans.map(plan => {
              const displayName = plan.destinationName || 
                (Array.isArray(plan.itinerary) && plan.itinerary.length > 0 ? plan.itinerary.map((i: any) => i.destinationName).filter(Boolean).join(' → ') : null) || 
                (Array.isArray(plan.destinations) && plan.destinations.length > 0 ? plan.destinations.join(' • ') : 'Western Ghats Eco-Route');

              const datesStr = plan.startDate || (plan.dates ? `${plan.dates.start} to ${plan.dates.end}` : 'Flexible Travel');
              const co2Saved = plan.carbonAvoidedKg || plan.totalCo2SavedKg || 34.2;
              const overallScore = plan.sustainabilityScore || plan.overall_sustainability_score || 91;
              const envScore = plan.environmentalScore || plan.environmental_score || 90;
              const socScore = plan.socialScore || plan.social_score || 88;
              const econScore = plan.economicScore || plan.economic_score || 94;

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 hover:border-gov-navy transition p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400">ID: {plan.id}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          🌿 -{co2Saved} kg CO₂e Saved
                        </span>
                        <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                          Score: {overallScore}/100
                        </span>
                      </div>

                      <h3 className="font-extrabold text-lg text-slate-900">
                        {displayName}
                      </h3>

                      <p className="text-xs text-slate-500">
                        Date: <strong>{datesStr}</strong> • Mode: <strong className="capitalize">{plan.transportMode?.replace('_', ' ') || 'Green Transit'}</strong> • Stay: <strong className="capitalize">{plan.accommodationType || 'Homestay'}</strong>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedCertTrip(plan)}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl border border-amber-300 transition flex items-center gap-1.5 shadow-sm"
                        title="View Official Certificate"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>Green Certificate</span>
                      </button>

                      <Link
                        to={`/plan/${plan.id}`}
                        className="px-3.5 py-1.5 bg-gov-navy hover:bg-slate-900 text-amber-300 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
                      >
                        <span>View Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this trip plan?')) {
                            deleteTripPlan(plan.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                        title="Delete trip plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 3 Pillars Badge Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-emerald-600" />
                        <span>Environmental (40%)</span>
                      </span>
                      <strong className="text-xs font-mono text-emerald-800">{envScore}/100</strong>
                    </div>

                    <div className="bg-sky-50 rounded-xl p-2 border border-sky-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
                        <Users className="w-3 h-3 text-sky-600" />
                        <span>Social & Heritage (30%)</span>
                      </span>
                      <strong className="text-xs font-mono text-sky-800">{socScore}/100</strong>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-2 border border-amber-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-600" />
                        <span>Local Economic (30%)</span>
                      </span>
                      <strong className="text-xs font-mono text-amber-800">{econScore}/100</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
