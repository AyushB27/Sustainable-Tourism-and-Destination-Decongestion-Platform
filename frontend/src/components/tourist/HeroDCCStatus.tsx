import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  CloudRain, 
  ShieldCheck, 
  AlertOctagon,
  Car,
  FileText
} from 'lucide-react';
import type { Destination, DCCMetrics } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';
import { TRANSLATIONS } from '../../lib/i18n';

interface HeroDCCStatusProps {
  destination: Destination;
  metrics: DCCMetrics;
}

export const HeroDCCStatus: React.FC<HeroDCCStatusProps> = ({
  destination,
  metrics
}) => {
  const { language } = useCorridorStore();
  const t = TRANSLATIONS[language];
  const { dccScore, status, capacityUtilization, waitTimeMinutes } = metrics;

  const statusConfig = {
    OPTIMAL: {
      label: t.optimalCapacity,
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-400',
      pillBg: 'bg-gov-green',
      textColor: 'text-gov-green',
      heroBorder: 'border-gov-green/40 bg-white',
      icon: <ShieldCheck className="w-5 h-5 text-gov-green" />,
      subtext: 'पर्यटन क्षमता के भीतर (Capacity Safe)'
    },
    MODERATE: {
      label: t.moderateCapacity,
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-400',
      pillBg: 'bg-amber-600',
      textColor: 'text-amber-700',
      heroBorder: 'border-amber-400/60 bg-white',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      subtext: 'चेतावनी: सीमा के निकट (Near Maximum Threshold)'
    },
    CRITICAL: {
      label: t.criticalCapacity,
      badgeBg: 'bg-rose-100 text-rose-950 border-rose-500 animate-pulse',
      pillBg: 'bg-rose-600',
      textColor: 'text-rose-700',
      heroBorder: 'border-rose-500 bg-rose-50/40 shadow-md',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      subtext: 'अति-भारित क्षेत्र: मार्ग परिवर्तन आवश्यक (Critical Overload)'
    }
  };

  const config = statusConfig[status];
  const utilizationPct = Math.round(capacityUtilization * 100);

  return (
    <div className={`rounded-xl border-2 shadow-sm p-4 sm:p-6 transition-all duration-300 ${config.heroBorder}`}>
      {/* Official Government Advisory Notice Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="bg-slate-100 text-gov-navy font-bold px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              सूचना सं. MH-TOUR/2026-{destination.id}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-semibold uppercase">
              {destination.district}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-gov-navy font-bold">
              {destination.category}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2 flex-wrap">
            <span>{destination.name}</span>
            <span className="text-xs font-normal text-slate-500">({destination.tagline})</span>
          </h2>
        </div>

        {/* Official Status Badge */}
        <div className="self-start sm:self-auto flex flex-col sm:items-end gap-1">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border-2 text-xs sm:text-sm font-extrabold shadow-sm ${config.badgeBg}`}>
            {config.icon}
            <span>{config.label}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {config.subtext}
          </span>
        </div>
      </div>

      {/* 3 Telemetry Gauges Grid (Government Gazette Format) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Metric 1: Dynamic Carrying Capacity (DCC) Index */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.dccScore} (भार सूचकांक)
            </span>
            <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
              Max 1.00
            </span>
          </div>

          <div className="my-2.5 flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-black ${config.textColor}`}>
              {dccScore.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / 1.00 Index
            </span>
          </div>

          <div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${config.pillBg}`}
                style={{ width: `${Math.min(100, dccScore * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>0.00 (खाली)</span>
              <span>0.70 (संतुलित)</span>
              <span>0.85+ (अतिभारित)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Estimated Highway & Checkpoint Queuing Delay */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {t.estWait}
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
              waitTimeMinutes > 30 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {waitTimeMinutes > 0 ? t.queuesActive : t.zeroDelay}
            </span>
          </div>

          <div className="my-2.5 flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-black ${
              waitTimeMinutes > 45 ? 'text-rose-600' : waitTimeMinutes > 0 ? 'text-amber-600' : 'text-gov-green'
            }`}>
              {waitTimeMinutes > 0 ? `${waitTimeMinutes} min` : '0 min'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {waitTimeMinutes > 0 ? 'प्रतीक्षा समय (Queue Delay)' : 'अबाधित प्रवेश (Free Flow)'}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight">
            {waitTimeMinutes > 0 
              ? `Estimated entry bottleneck due to +${(destination.currentInflow - destination.physicalCapacity).toLocaleString()} influx over physical limit.`
              : 'Vehicular movement along access roads is operating at designated speed.'}
          </p>
        </div>

        {/* Metric 3: Physical Capacity Utilization & Environmental Risk */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {t.inflowVsCap}
            </span>
            <span className={`text-[11px] font-bold ${utilizationPct > 100 ? 'text-rose-700' : 'text-slate-800'}`}>
              {utilizationPct}% Utilized
            </span>
          </div>

          <div className="my-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {destination.currentInflow.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {destination.physicalCapacity.toLocaleString()} max
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.parkingLoad}: <strong>{destination.localPressure.parkingSaturationPct}%</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.weatherRisk}: <strong>{(destination.weatherHazardScore * 100).toFixed(0)}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Government Advisory Alert Box (High Priority Bulletin) */}
      {destination.activeAdvisory && (
        <div className="mt-4 p-4 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-start gap-3 text-rose-950 shadow-sm">
          <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <div className="font-bold flex items-center gap-2">
              <span className="text-rose-900">{t.activeAdvisoryBadge}</span>
              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                जिला प्रशासन आदेश | District Advisory
              </span>
            </div>
            <p className="mt-1 text-rose-900 font-medium leading-relaxed">
              {destination.activeAdvisory}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
