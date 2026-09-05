import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  Plus
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const AdvisoryManager: React.FC = () => {
  const {
    advisories,
    currentUser,
    destinations,
    revokeAdvisory,
    extendAdvisory,
    broadcastAdvisory
  } = useCorridorStore();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');
  const [extendingId, setExtendingId] = useState<string | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('2026-10-31T23:59:59');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New advisory modal
  const [composerOpen, setComposerOpen] = useState(false);
  const [newDestId, setNewDestId] = useState(destinations[0]?.id || 'LON');
  const [newSeverity, setNewSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newExpiry, setNewExpiry] = useState('2026-10-31T23:59:59');

  // Filter advisories based on official's jurisdiction
  const jurisdictionAdvisories = useMemo(() => {
    const jur = currentUser.jurisdiction;
    return advisories.filter(a => {
      // Status filter
      if (filterStatus === 'active' && !a.active) return false;
      if (filterStatus === 'revoked' && a.active) return false;

      // Jurisdiction filter
      if (!jur || jur.type === 'state') return true;
      if (a.destinationId === 'ALL') return true;
      const targetDest = destinations.find(d => d.id === a.destinationId);
      if (!targetDest) return false;
      if (jur.type === 'district') {
        return targetDest.district.toLowerCase().includes(String(jur.value).toLowerCase());
      }
      if (jur.type === 'spot_list' && Array.isArray(jur.value)) {
        return jur.value.includes(a.destinationId);
      }
      return false;
    });
  }, [advisories, currentUser.jurisdiction, destinations, filterStatus]);

  const handleRevoke = async (advisoryId: string) => {
    setActionLoading(true);
    setActionNotice(null);
    const res = await revokeAdvisory(advisoryId);
    setActionLoading(false);
    if (res.success) {
      setActionNotice({ type: 'success', text: `Advisory ${advisoryId} revoked and removed from tourist alerts.` });
    } else {
      setActionNotice({ type: 'error', text: res.message || 'Jurisdiction check failed on backend.' });
    }
  };

  const handleExtend = async (advisoryId: string) => {
    setActionLoading(true);
    setActionNotice(null);
    const res = await extendAdvisory(advisoryId, newExpiryDate);
    setActionLoading(false);
    setExtendingId(null);
    if (res.success) {
      setActionNotice({ type: 'success', text: `Advisory ${advisoryId} extended to ${newExpiryDate}.` });
    } else {
      setActionNotice({ type: 'error', text: res.message || 'Jurisdiction check failed on backend.' });
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;
    setActionLoading(true);
    setActionNotice(null);

    const targetDest = destinations.find(d => d.id === newDestId);
    const destName = newDestId === 'ALL' ? 'All Corridor Hubs' : targetDest?.name || newDestId;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/advisories/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_id: newDestId,
          destination_name: destName,
          severity: newSeverity,
          title: newTitle.trim(),
          message: newMessage.trim(),
          author: currentUser.designation || 'District Administration',
          expires_at: newExpiry,
          user: currentUser
        })
      });
      const data = await res.json();
      setActionLoading(false);

      if (res.ok) {
        setActionNotice({ type: 'success', text: 'New emergency advisory published to official gazette and tourist spot pages.' });
        broadcastAdvisory({
          destinationId: newDestId,
          destinationName: destName,
          severity: newSeverity,
          title: newTitle.trim(),
          message: newMessage.trim(),
          author: currentUser.designation || 'District Administration',
          active: true,
          expiresAt: newExpiry
        });
        setComposerOpen(false);
        setNewTitle('');
        setNewMessage('');
      } else {
        setActionNotice({ type: 'error', text: data.message || 'Server rejected advisory (out of jurisdiction).' });
      }
    } catch {
      setActionLoading(false);
      setActionNotice({ type: 'error', text: 'Network connection failed.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Official Gazette Advisory Management Console
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and historical emergency bulletins scoped to your jurisdiction ({currentUser.jurisdiction?.value || 'All'}). Direct sync with SQLite <code className="text-slate-700">gazette_advisories</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Status filter pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : ''}`}
            >
              All ({advisories.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1 rounded-lg transition ${filterStatus === 'active' ? 'bg-white text-emerald-700 shadow-xs' : ''}`}
            >
              Active ({advisories.filter(a => a.active).length})
            </button>
            <button
              onClick={() => setFilterStatus('revoked')}
              className={`px-3 py-1 rounded-lg transition ${filterStatus === 'revoked' ? 'bg-white text-rose-700 shadow-xs' : ''}`}
            >
              Revoked
            </button>
          </div>

          <button
            onClick={() => setComposerOpen(true)}
            className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>New Advisory</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className={`p-3 rounded-xl text-xs font-bold ${
          actionNotice.type === 'success' ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' : 'bg-rose-50 border border-rose-300 text-rose-950'
        }`}>
          {actionNotice.text}
        </div>
      )}

      {/* Advisories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Target Hub</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Title & Guidance Message</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jurisdictionAdvisories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No advisories found matching the current filter.
                  </td>
                </tr>
              ) : (
                jurisdictionAdvisories.map((adv) => {
                  const isCritical = adv.severity === 'critical' || adv.severity === 'high';
                  return (
                    <tr key={adv.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{adv.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{adv.destinationName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isCritical ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {adv.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <strong className="text-slate-900 block">{adv.title}</strong>
                        <p className="text-slate-600 mt-0.5 line-clamp-2">{adv.message}</p>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono">Author: {adv.author}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        <div>Issued: {adv.timestamp}</div>
                        {adv.expiresAt && <div className="text-slate-400">Expires: {adv.expiresAt.slice(0, 10)}</div>}
                        {adv.revokedAt && <div className="text-rose-600 font-bold">Revoked: {adv.revokedAt.slice(0, 10)}</div>}
                      </td>
                      <td className="py-3 px-4">
                        {adv.active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-bold bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[10px]">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            REVOKED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {adv.active ? (
                          <>
                            <button
                              onClick={() => {
                                setExtendingId(adv.id);
                                setNewExpiryDate(adv.expiresAt || '2026-10-31T23:59:59');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                            >
                              Extend
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleRevoke(adv.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold rounded-lg transition"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setExtendingId(adv.id);
                              setNewExpiryDate('2026-10-31T23:59:59');
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-lg transition"
                          >
                            Re-Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extend Validity Modal */}
      {extendingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Extend Advisory Validity</h3>
            <p className="text-xs text-slate-600">Update the expiration timestamp for advisory {extendingId}.</p>
            <input
              type="datetime-local"
              value={newExpiryDate.slice(0, 16)}
              onChange={(e) => setNewExpiryDate(`${e.target.value}:00`)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setExtendingId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExtend(extendingId)}
                className="px-4 py-2 bg-gov-navy text-white rounded-xl text-xs font-bold"
              >
                Save & Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Advisory Composer Modal */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Broadcast New Emergency Gazette Bulletin</span>
              </h3>
              <button onClick={() => setComposerOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Destination</label>
                  <select
                    value={newDestId}
                    onChange={(e) => setNewDestId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.district})</option>
                    ))}
                    {currentUser.jurisdiction?.type === 'state' && (
                      <option value="ALL">Corridor-Wide (All Destinations)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="low">Low (Notice)</option>
                    <option value="medium">Medium (Advisory)</option>
                    <option value="high">High (Bottleneck / Hazard)</option>
                    <option value="critical">Critical (Immediate Diversion)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bulletin Headline</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Landslide Warning on Khandala Ghat"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message & Detour Guidance</label>
                <textarea
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Provide precise road bypass or carrying capacity advisory to citizens..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Valid Until (Expiry)</label>
                <input
                  type="datetime-local"
                  value={newExpiry.slice(0, 16)}
                  onChange={(e) => setNewExpiry(`${e.target.value}:00`)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{actionLoading ? 'Broadcasting…' : 'Broadcast to Gazette'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
