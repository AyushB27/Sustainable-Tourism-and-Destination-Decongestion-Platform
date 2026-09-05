import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  ArrowUpDown, 
  Clock, 
  Car,
  Compass
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';
import { calculateDCCMetrics } from '../lib/engine';

export const RegionPage: React.FC = () => {
  const { type, value } = useParams<{ type: 'district' | 'state'; value: string }>();
  const navigate = useNavigate();
  const { destinations } = useCorridorStore();

  const [sortBy, setSortBy] = useState<'crowd' | 'alpha' | 'distance'>('crowd');

  const decodedValue = decodeURIComponent(value || '');

  // Filter spots strictly by district or state (exhaustive listing)
  const regionSpots = useMemo(() => {
    const target = decodedValue.toLowerCase().trim();
    return destinations.filter(d => {
      if (type === 'district') {
        return d.district.toLowerCase() === target || target.includes(d.district.toLowerCase());
      }
      if (type === 'state') {
        return d.state.toLowerCase() === target || target.includes(d.state.toLowerCase());
      }
      return false;
    });
  }, [destinations, type, decodedValue]);

  // Sort: Default crowd status (Optimal -> Moderate -> Critical first)
  const sortedSpots = useMemo(() => {
    const list = [...regionSpots];
    if (sortBy === 'crowd') {
      const order = { OPTIMAL: 0, MODERATE: 1, CRITICAL: 2 };
      list.sort((a, b) => {
        const metA = calculateDCCMetrics(a);
        const metB = calculateDCCMetrics(b);
        return order[metA.status] - order[metB.status] || metA.dccScore - metB.dccScore;
      });
    } else if (sortBy === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'distance') {
      list.sort((a, b) => a.distanceKmFromHub - b.distanceKmFromHub);
    }
    return list;
  }, [regionSpots, sortBy]);

  // Region crowd aggregate summary
  const summary = useMemo(() => {
    let optimal = 0;
    let moderate = 0;
    let critical = 0;
    regionSpots.forEach(s => {
      const { status } = calculateDCCMetrics(s);
      if (status === 'OPTIMAL') optimal++;
      else if (status === 'MODERATE') moderate++;
      else critical++;
    });
    return { optimal, moderate, critical, total: regionSpots.length };
  }, [regionSpots]);

  const regionTitle = type === 'district' ? `${decodedValue} District` : `${decodedValue} State`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous view</span>
        </button>
      </div>

      {/* Regional Hero Header */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gov-navy uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Exhaustive {type === 'district' ? 'District' : 'State'} Destination Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Every Monitored Destination in {regionTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Unfiltered completeness across all {summary.total} destinations. Sorted by current crowd pressure to help you find open, queue-free alternative visits.
          </p>
        </div>

        {/* Region Aggregate Health Pills */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <div className="bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{summary.optimal} Optimal</span>
          </div>
          {summary.moderate > 0 && (
            <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{summary.moderate} Moderate</span>
            </div>
          )}
          {summary.critical > 0 && (
            <div className="bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{summary.critical} Critical</span>
            </div>
          )}
        </div>
      </div>

      {/* Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 p-3 rounded-xl border border-slate-200">
        <div className="text-xs font-bold text-slate-700">
          Showing all {sortedSpots.length} destinations
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </span>
          <button
            type="button"
            onClick={() => setSortBy('crowd')}
            className={`px-3 py-1.5 rounded-lg transition ${
              sortBy === 'crowd'
                ? 'bg-gov-navy text-amber-300 font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Crowd Status (Optimal first)
          </button>
          <button
            type="button"
            onClick={() => setSortBy('distance')}
            className={`px-3 py-1.5 rounded-lg transition ${
              sortBy === 'distance'
                ? 'bg-gov-navy text-amber-300 font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Distance from Hub
          </button>
          <button
            type="button"
            onClick={() => setSortBy('alpha')}
            className={`px-3 py-1.5 rounded-lg transition ${
              sortBy === 'alpha'
                ? 'bg-gov-navy text-amber-300 font-bold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            A–Z
          </button>
        </div>
      </div>

      {/* Spot Grid */}
      {sortedSpots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <Compass className="w-8 h-8 mx-auto text-slate-400" />
          <h2 className="text-base font-bold text-slate-800">No destinations found in {regionTitle}</h2>
          <p className="text-xs text-slate-500">
            Currently monitored regions include Pune, Raigad, Satara, and Ahmednagar.
          </p>
          <button
            onClick={() => navigate('/region/state/Maharashtra')}
            className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl"
          >
            View Entire Maharashtra Corridor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSpots.map(spot => {
            const metrics = calculateDCCMetrics(spot);
            const statusConfig = {
              OPTIMAL: {
                badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                icon: <ShieldCheck className="w-4 h-4 text-gov-green" />,
                title: 'Optimal Flow • Zero Wait'
              },
              MODERATE: {
                badge: 'bg-amber-100 text-amber-900 border-amber-300',
                icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
                title: 'Moderate Influx'
              },
              CRITICAL: {
                badge: 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse',
                icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
                title: 'Heavily Overcrowded'
              }
            }[metrics.status];

            const crowdRatioPct = Math.round((spot.currentInflow / spot.physicalCapacity) * 100);

            return (
              <div
                key={spot.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-gov-navy transition overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Hero image with status overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                      {spot.category}
                    </span>
                    {spot.isUnderVisited && (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                        🌿 Hidden Gem
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h2 className="font-black text-lg leading-tight drop-shadow">{spot.name}</h2>
                      <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-300" />
                        {spot.district}, {spot.state}
                      </p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3 text-xs">
                    {/* Status Pill */}
                    <div className={`p-2 rounded-xl border flex items-center justify-between font-bold ${statusConfig.badge}`}>
                      <div className="flex items-center gap-1.5">
                        {statusConfig.icon}
                        <span>{statusConfig.title}</span>
                      </div>
                      <span className="font-mono text-[11px]">{crowdRatioPct}% cap</span>
                    </div>

                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {spot.description}
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{spot.travelTimeFromHub}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Wait: <strong>{metrics.waitTimeMinutes}m</strong></span>
                      </div>
                    </div>

                    {/* Highlights tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {spot.highlights.slice(0, 3).map((hl, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {spot.distanceKmFromHub} km from central hub
                  </span>
                  <Link
                    to={`/spot/${spot.id}`}
                    className="inline-flex items-center gap-1 bg-gov-navy hover:bg-gov-navy-light text-amber-300 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm"
                  >
                    <span>View Spot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
