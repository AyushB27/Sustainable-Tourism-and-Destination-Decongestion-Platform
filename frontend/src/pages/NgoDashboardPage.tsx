import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Users, HeartHandshake, Leaf } from 'lucide-react';
import { apiGet, apiPost } from '../lib/api';

export const NgoDashboardPage: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'dispatched' | 'resolved'>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/waste/incidents');
      if (data && data.incidents) {
        setIncidents(data.incidents);
      }
    } catch {
      // Offline mock data
      setIncidents([
        {
          id: 'WST-101',
          destination_name: 'Lonavala (Tiger Point)',
          category: 'Plastic Waste Accumulation',
          severity: 'high',
          description: 'Discarded mineral water bottles and snack packaging in sensitive valley ravine.',
          status: 'pending',
          created_at: new Date().toISOString()
        },
        {
          id: 'WST-102',
          destination_name: 'Mahabaleshwar (Venna Lake)',
          category: 'Overflowing Waste Bins',
          severity: 'medium',
          description: 'Lake perimeter trash cans overflowing near boat rental jetty.',
          status: 'dispatched',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleDispatchSquad = async (incidentId: string) => {
    try {
      await apiPost('/api/waste/dispatch', { report_id: incidentId, incident_id: incidentId, status: 'dispatched', notes: 'NGO Sahyadri Clean-up Squad dispatched.' });
      setActionSuccess(`Eco-Volunteer Squad deployed to incident ${incidentId}!`);
      fetchIncidents();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch {
      setActionSuccess(`Deployment error: Failed to dispatch squad to incident ${incidentId}`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await apiPost('/api/waste/dispatch', { report_id: incidentId, incident_id: incidentId, status: 'resolved', notes: 'Clean-up verified & waste repatriated.' });
      setActionSuccess(`Incident ${incidentId} marked as successfully resolved & recycled!`);
      fetchIncidents();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch {
      setActionSuccess(`Update error: Failed to resolve incident ${incidentId}`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.status === filter);
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
  const pendingCount = incidents.filter(i => i.status === 'pending').length;
  const dispatchedCount = incidents.filter(i => i.status === 'dispatched').length;
  const resolutionRate = incidents.length > 0 ? ((resolvedCount / incidents.length) * 100).toFixed(1) : '100.0';
  const estimatedKgCleaned = 1250 + (resolvedCount * 65);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-300">
            <HeartHandshake className="w-8 h-8 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                NGO & Environmental Conservation Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">ROLE: NGO Partner</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Sahyadri Conservation & Cleanliness Desk</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Triage citizen waste reports, dispatch volunteer cleanup squads, and track regional environmental rehabilitation impact.
            </p>
          </div>
        </div>

        <button
          onClick={fetchIncidents}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Impact Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase">Estimated Waste Repatriated</span>
          <strong className="text-2xl font-black text-slate-900 block font-mono">{estimatedKgCleaned.toLocaleString()} kg</strong>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Plastic & litter safely cleared
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase">Queue Status</span>
          <strong className="text-2xl font-black text-slate-900 block font-mono">{pendingCount} Pending / {dispatchedCount} Dispatched</strong>
          <span className="text-[10px] text-slate-500">Across {incidents.length} total logged incidents</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase">Active Volunteers</span>
          <strong className="text-2xl font-black text-slate-900 block font-mono">412 Members</strong>
          <span className="text-[10px] text-sky-700 font-bold flex items-center gap-1">
            <Users className="w-3 h-3" /> Registered Sahyadri guardians
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-xs font-bold uppercase">Resolution Rate</span>
          <strong className="text-2xl font-black text-emerald-600 block font-mono">{resolutionRate}%</strong>
          <span className="text-[10px] text-slate-500">{resolvedCount} incidents closed successfully</span>
        </div>
      </div>

      {/* Incident Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Environmental Incident Queue ({filtered.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Citizen-reported litter and plastic pollution requiring volunteer or municipal clean-up squad action.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(['all', 'pending', 'dispatched', 'resolved'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition capitalize cursor-pointer ${
                  filter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400">
            No incidents found matching this status filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inc => (
              <div
                key={inc.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-gov-navy">{inc.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      inc.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inc.severity} Severity
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      inc.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : inc.status === 'dispatched' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      ● {inc.status}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">{inc.destination_name || inc.category}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {inc.status === 'pending' && (
                    <button
                      onClick={() => handleDispatchSquad(inc.id)}
                      className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Deploy Squad</span>
                    </button>
                  )}
                  {inc.status === 'dispatched' && (
                    <button
                      onClick={() => handleResolveIncident(inc.id)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                  {inc.status === 'resolved' && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
