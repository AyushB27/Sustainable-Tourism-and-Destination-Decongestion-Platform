import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  CloudRain, 
  ShieldCheck, 
  AlertOctagon,
  Car,
  MapPin
} from 'lucide-react';
import type { Destination, DCCMetrics } from '../../types';

interface HeroDCCStatusProps {
  destination: Destination;
  metrics: DCCMetrics;
}

export const HeroDCCStatus: React.FC<HeroDCCStatusProps> = ({
  destination,
  metrics
}) => {
  const { status, waitTimeMinutes } = metrics;

  const statusConfig = {
    OPTIMAL: {
      headline: 'Low Crowds • Great Time to Visit',
      badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-400',
      pillBg: 'bg-gov-green',
      textColor: 'text-gov-green',
      cardBg: 'border-emerald-300 bg-white',
      icon: <ShieldCheck className="w-5 h-5 text-gov-green" />,
      explanation: 'Tourist density is comfortable and well within capacity limits. Zero traffic delays along access roads.'
    },
    MODERATE: {
      headline: 'Moderate Influx • Expect Moderate Queues',
      badgeBg: 'bg-amber-100 text-amber-950 border-amber-400',
      pillBg: 'bg-amber-600',
      textColor: 'text-amber-700',
      cardBg: 'border-amber-300 bg-white',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      explanation: 'Approaching maximum weekend threshold. We recommend early morning visits to avoid queues.'
    },
    CRITICAL: {
      headline: 'Heavily Overcrowded • Long Checkpoint Delays',
      badgeBg: 'bg-rose-100 text-rose-950 border-rose-500 animate-pulse',
      pillBg: 'bg-rose-600',
      textColor: 'text-rose-700',
      cardBg: 'border-rose-400 bg-rose-50/50 shadow-md',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      explanation: 'Heavy vehicular bottlenecks on ghat roads. Consider taking the recommended twin destination below to save over 1 hour.'
    }
  };

  const config = statusConfig[status];
  const crowdPercentage = Math.round((destination.currentInflow / destination.physicalCapacity) * 100);

  return (
    <div className={`rounded-2xl border-2 shadow-sm p-4 sm:p-6 transition-all duration-300 ${config.cardBg}`}>
      {/* Destination Name & Live Crowd Status Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="flex items-center gap-1 text-gov-navy font-bold">
              <MapPin className="w-3.5 h-3.5" />
              {destination.district}
            </span>
            <span>•</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              {destination.category}
            </span>
            <span>•</span>
            <span className="text-slate-600">{destination.travelTimeFromHub}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {destination.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {destination.tagline}
          </p>
        </div>

        {/* Big Friendly Status Badge */}
        <div className="self-start md:self-auto flex flex-col md:items-end gap-1">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-extrabold shadow-sm ${config.badgeBg}`}>
            {config.icon}
            <span>{config.headline}</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {config.explanation}
          </span>
        </div>
      </div>

      {/* 3 Simple, User-Friendly Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {/* Card 1: Crowd Level */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gov-navy" />
              Current Crowd Level
            </span>
            <span className={`text-xs font-extrabold ${crowdPercentage > 100 ? 'text-rose-700' : 'text-gov-green'}`}>
              {crowdPercentage}% Full
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {destination.currentInflow.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              visitors right now
            </span>
          </div>

          {/* Clean Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${config.pillBg}`}
              style={{ width: `${Math.min(100, crowdPercentage)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Recommended comfortable limit: {destination.physicalCapacity.toLocaleString()} visitors
          </p>
        </div>

        {/* Card 2: Road & Checkpoint Traffic Delay */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-700" />
              Ghat Road Traffic Delay
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              waitTimeMinutes > 20 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {waitTimeMinutes > 0 ? 'Traffic Delay' : 'Smooth Flow'}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-black ${
              waitTimeMinutes > 30 ? 'text-rose-600' : waitTimeMinutes > 0 ? 'text-amber-600' : 'text-gov-green'
            }`}>
              {waitTimeMinutes > 0 ? `+${waitTimeMinutes} mins` : '0 mins'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {waitTimeMinutes > 0 ? 'estimated travel delay' : 'no traffic bottlenecks'}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight">
            {waitTimeMinutes > 0
              ? 'Vehicles are queuing on the primary ghat ascent. Expect slow movement.'
              : 'Highway speed is normal with free-flowing traffic through all toll plazas.'}
          </p>
        </div>

        {/* Card 3: Parking & Live Weather Condition */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Amenities & Weather
          </span>

          <div className="space-y-2 text-xs text-slate-800">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-slate-600" />
                <span>Parking Availability:</span>
              </div>
              <strong className={destination.localPressure.parkingSaturationPct > 80 ? 'text-rose-600' : 'text-slate-900'}>
                {destination.localPressure.parkingSaturationPct}% Occupied
              </strong>
            </div>

            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-600" />
                <span>Weather Condition:</span>
              </div>
              <strong className="text-slate-900">
                {destination.weatherHazardScore > 0.4 ? 'Rainy & Cool (21°C)' : 'Clear & Pleasant (24°C)'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Official Government Advisory Notice Alert */}
      {destination.activeAdvisory && (
        <div className="mt-4 p-4 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-start gap-3 text-rose-950 shadow-sm">
          <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <div className="font-bold flex items-center gap-2">
              <span className="text-rose-900 font-black">Official Travel Warning:</span>
              <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                District Authority Notice
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
