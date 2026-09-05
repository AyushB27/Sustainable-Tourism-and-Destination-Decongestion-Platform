import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  MapPin 
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics } from '../lib/engine';

export const ProviderConsolePage: React.FC = () => {
  const { destinations, promotions, currentUser } = useCorridorStore();

  // Illustrative operator listings (linked spots)
  const operatorSpots = destinations.filter(d => ['LON', 'MAT', 'BHA', 'KAS'].includes(d.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm">
            🏨
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                MTDC Accredited Operator Console (§6.1)
              </span>
              <span className="text-xs font-mono text-slate-500">
                PARTNER-ID: MTDC/WL/2026-HOTEL
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Local Homestay, Resort & Tour Operator Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Click any owned property listing to manage live room availability, publish off-peak tourist vouchers, and inspect carrying capacity directly on its Spot Page.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs space-y-0.5 self-start md:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Logged In Partner</span>
          <strong className="text-slate-900 block">{currentUser.name}</strong>
          <span className="text-emerald-700 font-semibold text-[11px]">MTDC Verified Tier 1 Partner</span>
        </div>
      </div>

      {/* Aggregate Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Managed Properties</span>
            <Building2 className="w-4 h-4 text-gov-navy" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {operatorSpots.length} Listings
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Across Lonavala, Matheran, Bhandardara & Kashid
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Active Off-Peak Promotions</span>
            <Tag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {promotions.length} Live Vouchers
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Driving traffic to low-pressure weekend slots
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Corridor Eco-Pass Redemptions</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            184 Guests
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Direct bookings via EcoRoute Bharat Green Passes
          </p>
        </div>
      </div>

      {/* Operator Property Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">
            Your Registered Destination Listings
          </h2>
          <span className="text-xs text-slate-500">
            Click any destination to access its canonical Spot Page with provider management tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operatorSpots.map(spot => {
            const metrics = calculateDCCMetrics(spot);
            const activePromo = promotions.find(p => p.destinationId === spot.id);

            return (
              <div
                key={spot.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400 transition p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{spot.district}, {spot.state}</span>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900">
                        {spot.name}
                      </h3>
                      <p className="text-xs text-slate-500">{spot.tagline}</p>
                    </div>

                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                      {spot.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Reported Occupancy</span>
                      <strong className="text-slate-900 text-sm">{spot.hotelOccupancyPct}% Filled</strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">Spot Crowd Status</span>
                      <strong className={metrics.status === 'CRITICAL' ? 'text-rose-600' : metrics.status === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600'}>
                        {metrics.status} ({metrics.dccScore.toFixed(2)} DCC)
                      </strong>
                    </div>
                  </div>

                  {activePromo && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
                      <div>
                        <strong className="text-amber-950 block">{activePromo.title}</strong>
                        <span className="text-[10px] text-amber-800">Code: {activePromo.code}</span>
                      </div>
                      <span className="bg-white text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-300">
                        {activePromo.discountPct}% Off
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {spot.physicalCapacity.toLocaleString()} cap
                  </span>
                  <Link
                    to={`/spot/${spot.id}`}
                    className="bg-gov-navy hover:bg-gov-navy-light text-amber-300 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <span>Manage on Spot Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
