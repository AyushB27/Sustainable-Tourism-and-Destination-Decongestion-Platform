import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Clock, Sparkles } from 'lucide-react';
import type { Destination, HourlyForecastPoint } from '../../types';
import { generate12HourForecast } from '../../lib/engine';
import { useCorridorStore } from '../../store/useCorridorStore';

interface DemandCurveChartProps {
  destination: Destination;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: HourlyForecastPoint }>;
  label?: string;
}

export const DemandCurveChart: React.FC<DemandCurveChartProps> = ({ destination }) => {
  const { selectedTimeSlot, setSelectedTimeSlot } = useCorridorStore();
  const [forecastData, setForecastData] = React.useState<HourlyForecastPoint[]>(() => generate12HourForecast(destination));

  React.useEffect(() => {
    // Generate initial fallback points immediately
    setForecastData(generate12HourForecast(destination));

    // Fetch from backend endpoint with timeout
    fetch(`http://127.0.0.1:8000/api/destinations/${destination.id}/forecast`, {
      signal: AbortSignal.timeout(3000)
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && data.forecast_points && Array.isArray(data.forecast_points)) {
          setForecastData(data.forecast_points);
        }
      })
      .catch(() => {
        // Safe fallback already applied
      });
  }, [destination]);

  const capacity = destination.physicalCapacity;

  // Friendly Time-Slot Options
  const timeSlots = [
    { time: '07:00 AM', label: 'Early Morning (Dawn)', status: 'Best Time', delay: '0 min wait', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { time: '10:00 AM', label: 'Mid Morning', status: 'Moderate', delay: '25 min wait', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
    { time: '02:00 PM', label: 'Peak Afternoon', status: 'Heavy Rush', delay: '85 min wait', badge: 'bg-rose-100 text-rose-900 border-rose-300' },
    { time: '05:00 PM', label: 'Sunset & Evening', status: 'Comfortable', delay: '5 min wait', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  ];

  // Custom Tooltip
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isOverCapacity = data.inflow > data.capacity;
      return (
        <div className="bg-gov-navy text-white p-3.5 rounded-xl shadow-xl border border-slate-600 text-xs">
          <p className="font-bold text-amber-300 mb-1">{label} ({data.hour})</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-4">
              <span className="text-slate-300">Expected Visitors:</span>
              <strong className="text-white">{data.inflow.toLocaleString()}</strong>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-300">Comfortable Limit:</span>
              <span className="text-slate-300">{data.capacity.toLocaleString()}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-300">Crowd Status:</span>
              <span className={`font-bold ${data.dccScore >= 0.85 ? 'text-rose-400' : data.dccScore >= 0.7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {data.dccScore >= 0.85 ? 'Heavily Crowded' : data.dccScore >= 0.7 ? 'Moderate' : 'Comfortable Flow'}
              </span>
            </p>
            {isOverCapacity && (
              <p className="text-[11px] text-rose-300 pt-1 border-t border-slate-700 font-bold">
                ⚠️ Over capacity by +{(data.inflow - data.capacity).toLocaleString()} visitors
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gov-navy" />
            <h3 className="font-bold text-slate-900 text-base">
              Hourly Crowd Prediction & Best Time to Visit
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Forecasted tourist arrivals throughout the day to help you plan a queue-free trip
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-700 self-start sm:self-auto font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-gov-green" />
            <span>Expected Visitors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-600 border-b border-dashed border-rose-600" />
            <span>Comfort Limit ({capacity.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="govInflowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#138808" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#138808" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="timeLabel" 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={capacity} 
              stroke="#dc2626" 
              strokeDasharray="4 4" 
              strokeWidth={2}
              label={{ 
                value: 'Max Capacity', 
                fill: '#dc2626', 
                fontSize: 10, 
                position: 'insideTopRight' 
              }} 
            />
            <Area
              type="monotone"
              dataKey="inflow"
              stroke="#138808"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#govInflowGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Time-Slot Guidance */}
      <div className="space-y-2 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gov-navy" />
            Select Your Planned Departure Time:
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Click a time slot to see traffic impact</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {timeSlots.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => setSelectedTimeSlot(slot.time)}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                  isSelected
                    ? 'border-gov-navy bg-amber-50/90 shadow-sm ring-2 ring-gov-navy'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900">{slot.time}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${slot.badge}`}>
                    {slot.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>{slot.label}</span>
                  <span className="font-bold text-slate-800">{slot.delay}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Advisory Tip */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-800">
        <Sparkles className="w-4 h-4 text-gov-navy shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900">Recommended Travel Window:</strong>{' '}
          Departing between <strong>06:00 AM – 09:00 AM</strong> or after <strong>04:30 PM</strong> avoids over 80% of ghat traffic checkpoints and viewpoint overcrowding.
        </div>
      </div>
    </div>
  );
};
