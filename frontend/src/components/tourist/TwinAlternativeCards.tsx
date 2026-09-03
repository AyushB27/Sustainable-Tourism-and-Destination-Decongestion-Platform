import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  Clock, 
  Tag, 
  TrendingDown, 
  Navigation,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import type { Destination, TwinRecommendation, DCCMetrics } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';

interface TwinAlternativeCardsProps {
  targetDestination?: Destination;
  targetMetrics: DCCMetrics;
  recommendations: TwinRecommendation[];
}

export const TwinAlternativeCards: React.FC<TwinAlternativeCardsProps> = ({
  targetMetrics,
  recommendations
}) => {
  const { rerouteToDestination } = useCorridorStore();
  const isCritical = targetMetrics.status === 'CRITICAL';

  const handleReroute = (destination: Destination) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    rerouteToDestination(destination.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gov-navy text-amber-300 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2 flex-wrap">
              <span>Recommended Less-Crowded Alternatives</span>
              <span className="text-xs bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                Certified Twin Spots
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Same natural beauty, waterfalls, and scenic viewpoints — with up to 80% fewer tourist crowds
            </p>
          </div>
        </div>

        {isCritical && (
          <div className="bg-rose-50 text-rose-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-300 flex items-center gap-1.5 self-start sm:self-auto">
            <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Avoid ~{targetMetrics.waitTimeMinutes} mins of traffic jams</span>
          </div>
        )}
      </div>

      {/* Alternatives Grid */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {recommendations.map((rec, idx) => {
            const { destination, similarityScore, crowdReductionPct, travelTimeDeltaText, activePromo } = rec;
            const simPercentage = Math.round(similarityScore * 100);

            return (
              <motion.div
                key={destination.id}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="bg-white rounded-2xl border-2 border-slate-300 hover:border-gov-navy shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Image Header with Friendly Badges */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                  {/* Top Matching Pills */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
                    <span className="bg-white/95 backdrop-blur-md text-gov-navy text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                      {simPercentage}% Experience Match
                    </span>

                    <span className="bg-gov-green text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {crowdReductionPct}% Fewer Tourists
                    </span>
                  </div>

                  {/* Destination Label */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      Recommended Alternative #{idx + 1} • {destination.district}
                    </span>
                    <h4 className="text-xl font-black leading-tight">
                      {destination.name}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                      {destination.description}
                    </p>

                    {/* Highlights tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {destination.highlights.slice(0, 3).map((hl, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-200"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Crowd & Travel Delta Summary */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200 text-xs">
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-900 font-bold uppercase block">
                        Crowd Level
                      </span>
                      <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-gov-green" />
                        {destination.currentInflow.toLocaleString()} (Comfortable)
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-700 font-bold uppercase block">
                        Driving Time
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {travelTimeDeltaText}
                      </span>
                    </div>
                  </div>

                  {/* MTDC Homestay Subsidy Coupon */}
                  {activePromo && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2.5">
                      <Tag className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-amber-950">
                            {activePromo.badge}
                          </span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-mono px-1.5 py-0.2 rounded font-bold border border-amber-300">
                            {activePromo.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900 mt-0.5">
                          {activePromo.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Button: Reroute Travel */}
                  <button
                    onClick={() => handleReroute(destination)}
                    className="w-full bg-gov-navy hover:bg-gov-navy-light text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm border-2 border-transparent hover:border-gov-gold"
                  >
                    <Navigation className="w-4 h-4 text-gov-gold" />
                    <span>Choose {destination.name.split(' ')[0]} & Get Free Travel Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
