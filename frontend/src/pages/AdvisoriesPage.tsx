import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldAlert, 
  Filter, 
  CheckCircle2 
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';

export const AdvisoriesPage: React.FC = () => {
  const { advisories, destinations } = useCorridorStore();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'critical' | 'high' | 'medium' | 'low'>('ALL');

  const filtered = useMemo(() => {
    return advisories.filter(a => {
      if (severityFilter === 'ALL') return true;
      return a.severity === severityFilter;
    });
  }, [advisories, severityFilter]);

  const activeCount = advisories.filter(a => a.active).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-gov-navy uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Official Gazette Dispatch System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Corridor Travel Advisories & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Broadcasted directly by District Disaster Cells, Highway Police, and the Maharashtra Maritime Board.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-rose-50 border border-rose-300 px-3.5 py-2 rounded-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <strong className="text-xs font-bold text-rose-950">
              {activeCount} Active Corridor Notices
            </strong>
          </div>
        </div>
      </div>

      {/* Severity Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <span className="text-slate-400 text-[11px] mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {(['ALL', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
          <button
            key={sev}
            type="button"
            onClick={() => setSeverityFilter(sev)}
            className={`px-3.5 py-1.5 rounded-xl border transition uppercase tracking-wider text-[11px] ${
              severityFilter === sev
                ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {sev === 'ALL' ? 'All Severities' : sev}
          </button>
        ))}
      </div>

      {/* Advisories Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
          <h3 className="font-bold text-slate-800 text-base">No active advisories for this filter</h3>
          <p className="text-xs text-slate-500">Corridor routes and checkpoints are operating normally.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(adv => {
            const dest = destinations.find(d => d.id === adv.destinationId);
            const isEmergency = adv.severity === 'critical' || adv.severity === 'high';

            return (
              <div
                key={adv.id}
                className={`p-6 rounded-3xl border-2 transition shadow-sm space-y-3 ${
                  isEmergency
                    ? 'bg-rose-50/70 border-rose-300'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase font-mono border ${
                      isEmergency
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-amber-500 text-white border-amber-600'
                    }`}>
                      {adv.severity}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {adv.title}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {adv.timestamp}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {adv.message}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Dispatched by: <strong>{adv.author}</strong> • Targeted at: <strong>{adv.destinationName}</strong>
                  </span>

                  {dest && (
                    <Link
                      to={`/spot/${dest.id}`}
                      className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 px-3.5 py-1.5 rounded-xl font-bold transition self-start sm:self-auto shadow-sm"
                    >
                      <span>Check Live {dest.name} Gauge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
