import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Megaphone
} from 'lucide-react';
import type { Destination, Advisory } from '../../types';
import { useCorridorStore } from '../../store/useCorridorStore';

interface DigitalAdvisoryDispatcherProps {
  destinations: Destination[];
  advisories: Advisory[];
}

export const DigitalAdvisoryDispatcher: React.FC<DigitalAdvisoryDispatcherProps> = ({
  destinations,
  advisories
}) => {
  const { broadcastAdvisory, dismissAdvisory } = useCorridorStore();

  const [selectedDestId, setSelectedDestId] = useState<string>(destinations[0]?.id || 'LON');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('critical');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Quick preset templates
  const presets = [
    {
      title: 'Heavy Fog on Amrutanjan Bridge',
      destId: 'LON',
      severity: 'critical' as const,
      msg: 'Dense fog reducing visibility to under 20m. Ghat section speed restricted to 30 km/h with 4km tailback.'
    },
    {
      title: 'Bhushi Dam Parking Saturated',
      destId: 'LON',
      severity: 'high' as const,
      msg: 'Bhushi & Tiger Point parking full. Vehicles being turned back at Khandala toll. Divert to Matheran / Bhandardara.'
    },
    {
      title: 'Mandwa Jetty 80-Min Ferry Delay',
      destId: 'ALB',
      severity: 'high' as const,
      msg: 'High passenger surge at Mumbai-Mandwa Ro-Ro. Avoid Alibaug beachfront and explore southern Kashid coast.'
    },
    {
      title: 'Pasarni Ghat Landslide Clearance',
      destId: 'MAH',
      severity: 'critical' as const,
      msg: 'Minor boulder fall on Wai-Panchgani route. One-way traffic running with 45-min bottleneck.'
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setSelectedDestId(preset.destId);
    setSeverity(preset.severity);
    setTitle(preset.title);
    setMessage(preset.msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const targetDest = destinations.find(d => d.id === selectedDestId);
    const destName = selectedDestId === 'ALL' ? 'Entire Corridor' : targetDest?.name || 'Corridor';

    // Fire-and-forget backend POST — UI updates immediately regardless of backend status
    fetch('http://127.0.0.1:8000/api/advisories/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination_id: selectedDestId,
        destination_name: destName,
        severity,
        title: title.trim(),
        message: message.trim(),
        author: 'Corridor Command Disaster Unit'
      }),
      signal: AbortSignal.timeout(3000)
    }).catch(() => { /* backend offline — Zustand state still updated below */ });

    broadcastAdvisory({
      destinationId: selectedDestId,
      destinationName: destName,
      severity,
      title: title.trim(),
      message: message.trim(),
      active: true,
      author: 'Corridor Command Disaster Unit'
    });

    setTitle('');
    setMessage('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              Digital Advisory & Emergency Dispatcher
              <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 font-semibold px-2 py-0.5 rounded-full">
                Broadcast Live
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Push real-time safety warnings, traffic diversions, and weather alerts directly to the Tourist Portal
            </p>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          One-Click Incident Presets
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs transition space-y-0.5 group"
            >
              <div className="font-bold text-slate-800 group-hover:text-emerald-800 flex items-center justify-between">
                <span>{p.title}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{p.destId}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{p.msg}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Target destination */}
          <div className="sm:col-span-6">
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Target Destination
            </label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              aria-label="Target Destination"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">📢 All Corridor Destinations (Global Notice)</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.category})
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="sm:col-span-6">
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Alert Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
              aria-label="Alert Severity Level"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="critical">🔴 Critical Alert (Red Banner + Sound Alert)</option>
              <option value="high">🟠 High Caution (Orange Banner)</option>
              <option value="medium">🟡 Moderate Advisory (Yellow Notice)</option>
              <option value="low">🔵 Informational (Blue Tip)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
            Advisory Headline
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Heavy Fog & 4km Traffic Tailback on Amrutanjan Bridge"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
            Detailed Advisory Directive
          </label>
          <textarea
            required
            rows={2}
            placeholder="Provide specific instructions, detour recommendations, or estimated delays..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1">
          {broadcastSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Advisory broadcast live to Tourist Portal!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Broadcast immediately syncs with mobile portals
            </span>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Advisory</span>
          </button>
        </div>
      </form>

      {/* Active Broadcasts Feed */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Active Broadcasts on Air ({advisories.length})
        </h4>

        {advisories.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No active advisories broadcast currently.</p>
        ) : (
          <div className="space-y-2">
            {advisories.map((adv) => {
              const severityColor = {
                critical: 'border-rose-300 bg-rose-50/50 text-rose-900',
                high: 'border-amber-300 bg-amber-50/50 text-amber-900',
                medium: 'border-yellow-300 bg-yellow-50/50 text-yellow-900',
                low: 'border-sky-300 bg-sky-50/50 text-sky-900'
              }[adv.severity];

              return (
                <div
                  key={adv.id}
                  className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${severityColor}`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="font-bold text-slate-900">{adv.title}</strong>
                      <span className="text-[10px] bg-white px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                        {adv.destinationName}
                      </span>
                      <span className="text-[10px] text-slate-500">{adv.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{adv.message}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => dismissAdvisory(adv.id)}
                    title="Dismiss Advisory"
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
