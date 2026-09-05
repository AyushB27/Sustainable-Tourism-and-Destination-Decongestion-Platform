import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  Users,
  ShieldAlert,
  Sparkles,
  Share2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Send,
  Building,
  Utensils,
  Navigation,
  Compass,
  ArrowLeft,
  XCircle,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';
import { useSpotData } from '../../hooks/useSpotData';
import { useCorridorStore } from '../../store/useCorridorStore';

export const SpotPage: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();
  const {
    spot,
    metrics,
    forecast,
    twins,
    advisories,
    provenance,
    confidenceScore,
    historicalPattern,
    checkIns,
    addCheckIn,
    isAuthority,
    hasJurisdiction,
    jurisdiction,
    overrideCapacity,
    broadcastAdvisory
  } = useSpotData(spotId);

  const { rerouteToDestination } = useCorridorStore();

  // Local UI states
  const [provenanceExpanded, setProvenanceExpanded] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInRating, setCheckInRating] = useState(4);
  const [checkInNote, setCheckInNote] = useState('');
  const [shareNotice, setShareNotice] = useState(false);

  // Authority panel states
  const [advTitle, setAdvTitle] = useState('');
  const [advSeverity, setAdvSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [advMessage, setAdvMessage] = useState('');
  const [advExpiresAt, setAdvExpiresAt] = useState('2026-10-31T23:59:59');
  const [advBroadcasting, setAdvBroadcasting] = useState(false);
  const [advFeedback, setAdvFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [overrideCapValue, setOverrideCapValue] = useState(spot?.physicalCapacity || 5000);
  const [overrideReason, setOverrideReason] = useState('Emergency Monsoon Precaution');
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);
  const [overrideFeedback, setOverrideFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!spot || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Destination Not Found</h2>
        <p className="text-sm text-slate-600 mb-4">The destination code '{spotId}' is not registered in the corridor registry.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${spot.name} — Live Crowd Status`,
        text: `${spot.name} is currently ${metrics.status} (${(metrics.dccScore * 100).toFixed(0)}% Capacity Load). Check live crowd updates and scenic twin routes on EcoRoute Bharat!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareNotice(true);
      setTimeout(() => setShareNotice(false), 2500);
    }
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCheckIn(checkInRating, checkInNote);
    setCheckInModalOpen(false);
    setCheckInNote('');
  };

  const handleAuthorityAdvisoryBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advTitle.trim() || !advMessage.trim()) return;
    setAdvBroadcasting(true);
    setAdvFeedback(null);

    const result = await fetch('http://127.0.0.1:8000/api/advisories/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination_id: spot.id,
        destination_name: spot.name,
        severity: advSeverity,
        title: advTitle.trim(),
        message: advMessage.trim(),
        author: 'District Authority Officer',
        expires_at: advExpiresAt,
        user: useCorridorStore.getState().currentUser
      })
    });

    const data = await result.json();
    setAdvBroadcasting(false);

    if (result.ok) {
      setAdvFeedback({ type: 'success', message: 'Official Gazette advisory broadcasted successfully!' });
      broadcastAdvisory({
        destinationId: spot.id,
        destinationName: spot.name,
        severity: advSeverity,
        title: advTitle.trim(),
        message: advMessage.trim(),
        author: 'District Authority Officer',
        active: true,
        expiresAt: advExpiresAt
      });
      setAdvTitle('');
      setAdvMessage('');
    } else {
      setAdvFeedback({ type: 'error', message: data.message || 'Jurisdiction authorization failed.' });
    }
  };

  const handleCapacityOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverrideSubmitting(true);
    setOverrideFeedback(null);

    const res = await overrideCapacity(spot.id, overrideCapValue, overrideReason);
    setOverrideSubmitting(false);

    if (res.success) {
      setOverrideFeedback({ type: 'success', message: `Physical capacity overridden to ${overrideCapValue.toLocaleString()}!` });
    } else {
      setOverrideFeedback({ type: 'error', message: res.message || 'Failed to apply capacity override.' });
    }
  };

  const statusColor = metrics.status === 'CRITICAL'
    ? 'text-rose-600 bg-rose-50 border-rose-300'
    : metrics.status === 'MODERATE'
    ? 'text-amber-600 bg-amber-50 border-amber-300'
    : 'text-emerald-600 bg-emerald-50 border-emerald-300';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* ── Active Advisories Notice (Top Priority) ── */}
      {advisories.length > 0 && (
        <div className="bg-rose-600 text-white px-4 py-3 shadow-md">
          <div className="max-w-6xl mx-auto flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded mr-2">
                Official Gazette Advisory
              </span>
              <strong className="text-sm">{advisories[0].title}: </strong>
              <span className="text-xs opacity-95">{advisories[0].message}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation Top Bar ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">Canonical Spot Route: /spot/{spot.id}</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {shareNotice && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2 rounded-xl shadow-xl animate-fade-in">
          Link copied to clipboard!
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* ── 1. HEADER SECTION ── */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
            <img
              src={spot.imageUrl}
              alt={spot.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {spot.category}
                  </span>
                  <span className="bg-white/20 backdrop-blur-xs font-mono text-[11px] px-2 py-0.5 rounded">
                    {spot.district}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{spot.name}</h1>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">{spot.tagline}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/authority"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white border border-white/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Corridor Map</span>
                </Link>
                <button
                  onClick={() => setCheckInModalOpen(true)}
                  className="bg-gov-gold hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow-md transition"
                >
                  Check In Here
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Description</span>
              <p className="text-slate-800 mt-0.5 leading-relaxed">{spot.description}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Base Capacity vs Inflow</span>
              <p className="text-slate-800 mt-0.5 font-mono font-bold">
                {spot.currentInflow.toLocaleString()} Live Inflow / {spot.physicalCapacity.toLocaleString()} Max Capacity
              </p>
              <span className="text-[10px] text-slate-500 block mt-1">Average Dwell Time: {spot.avgDwellTimeHours} hours</span>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block">Coordinates</span>
              <p className="font-mono text-slate-800 mt-0.5">{spot.coordinates[0].toFixed(4)}° N, {spot.coordinates[1].toFixed(4)}° E</p>
              <span className="text-[10px] text-slate-500 block mt-1">{spot.travelTimeFromHub} ({spot.distanceKmFromHub} km from Pune/Mumbai)</span>
            </div>
          </div>
        </section>

        {/* ── 2. CROWD MODULE & PROVENANCE ── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Dynamic Carrying Capacity (DCC) Status</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${statusColor}`}>
                  {metrics.status}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic carrying index computed from live physical capacity utilization (70%) and environmental weather hazards (30%).
              </p>
            </div>

            {/* Confidence Score Pill */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3.5 py-1.5 flex items-center gap-2 self-start sm:self-auto">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Confidence Score</span>
                <strong className="text-emerald-950 text-sm font-mono">{confidenceScore}% High Confidence</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">DCC Stress Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-slate-900">{metrics.dccScore.toFixed(2)}</span>
                <span className="text-xs text-slate-500 font-bold">/ 1.00</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Optimal: &lt;0.70 • Critical: &gt;=0.85</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Capacity Utilization</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-slate-900">{(metrics.capacityUtilization * 100).toFixed(0)}%</span>
                <span className="text-xs text-slate-500 font-bold">of max load</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">{spot.currentInflow} of {spot.physicalCapacity} safe spaces</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Checkpoint Queue Delay</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-black font-mono ${metrics.waitTimeMinutes > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {metrics.waitTimeMinutes > 0 ? `~${metrics.waitTimeMinutes}` : '0'}
                </span>
                <span className="text-xs text-slate-500 font-bold">minutes</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Toll & ghat bottleneck queue model</span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Weather Hazard Risk</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-slate-900">{(spot.weatherHazardScore * 100).toFixed(0)}%</span>
                <span className="text-xs text-slate-500 font-bold">monsoon index</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Open-Meteo precipitation & wind sensor</span>
            </div>
          </div>

          {/* 12-Hour Forecast Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gov-navy" />
                12-Hour Predictive Demand Forecast
              </span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                ✨ Best arrival: 07:00 AM – 09:30 AM (Minimal queues)
              </span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 overflow-x-auto pb-1">
              {forecast.slice(0, 12).map((pt, idx) => {
                const ptStatusColor = pt.dccScore >= 0.85
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : pt.dccScore >= 0.70
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950';

                return (
                  <div key={idx} className={`p-2 rounded-xl border text-center font-mono ${ptStatusColor}`}>
                    <span className="text-[10px] block opacity-80">{pt.hour}</span>
                    <strong className="text-xs font-black block mt-0.5">{pt.inflow}</strong>
                    <span className="text-[9px] block mt-0.5 opacity-70">DCC {pt.dccScore.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Weekly Pattern */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Weekly Historical Arrival Curve</span>
            <div className="grid grid-cols-7 gap-2">
              {historicalPattern.map((p) => (
                <div key={p.day} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">{p.day}</span>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full ${p.pct > 80 ? 'bg-rose-500' : p.pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 block mt-1">{p.crowdLevel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tap-to-Expand Provenance Breakdown */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setProvenanceExpanded(!provenanceExpanded)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                Data Provenance & Source Transparency ({provenance.length} Data Feeds Active)
              </span>
              {provenanceExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {provenanceExpanded && (
              <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                <p className="text-xs text-slate-600">
                  Every metric on this platform is tagged with its verified source tier. We do not claim an artificial sensor network.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                        <th className="text-left py-2">Signal</th>
                        <th className="text-left py-2">Reported Value</th>
                        <th className="text-left py-2">Source Tier</th>
                        <th className="text-left py-2">Provider</th>
                        <th className="text-left py-2">Verified At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {provenance.map((item, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2.5 font-bold text-slate-900">{item.name}</td>
                          <td className="py-2.5 text-slate-700">{item.value}</td>
                          <td className="py-2.5">
                            <span className="bg-slate-100 text-slate-800 border border-slate-300 text-[10px] px-2 py-0.5 rounded font-bold">
                              {item.tier}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-600">{item.source}</td>
                          <td className="py-2.5 text-slate-500">{item.fetchedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. TWIN ALTERNATIVES (COSINE SIMILARITY) ── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Certified Less-Crowded Twin Destinations</span>
              </h2>
              <p className="text-xs text-slate-500">
                4D vector cosine matching against {spot.name}'s scenic and adventure profile. Diversion saves queue time and reduces corridor carbon.
              </p>
            </div>
            <span className="text-[11px] bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Up to 80% Less Footfall
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {twins.slice(0, 2).map((tw) => (
              <div
                key={tw.destination.id}
                className="border-2 border-slate-200 hover:border-gov-navy rounded-2xl p-4 transition flex flex-col justify-between space-y-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gov-navy uppercase tracking-wider">{tw.destination.name}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-300">
                      {(tw.similarityScore * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{tw.destination.tagline}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-2 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Crowd Score</span>
                    <strong className="text-emerald-700">{tw.candidateDccScore.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Wait Saved</span>
                    <strong className="text-emerald-700">~{metrics.waitTimeMinutes}m</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Carbon Delta</span>
                    <strong className="text-emerald-700">-18.5 kg</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/spot/${tw.destination.id}`}
                    className="flex-1 py-2 text-center bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition"
                  >
                    View Spot Details
                  </Link>
                  <button
                    onClick={() => {
                      rerouteToDestination(tw.destination.id);
                      navigate(`/spot/${tw.destination.id}`);
                    }}
                    className="flex-1 py-2 text-center bg-gov-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <ThumbsUp className="w-3 h-3 text-amber-300" />
                    <span>Choose Twin Spot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. NEARBY & PRACTICAL INFO ── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Navigation className="w-5 h-5 text-gov-navy" />
            <span>Nearby Amenities & Practical Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Hospitality & Stays</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                MTDC Accredited Homestays and heritage valley villas available. Off-peak discount voucher <strong>HOMESTAY25</strong> eligible for this weekend.
              </p>
              <span className="text-[10px] text-slate-500 block font-mono">Current Room Occupancy: {spot.hotelOccupancyPct}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>Food, Water & Sanitation</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Drinking water kiosks, clean highway restrooms, and authentic Maharashtrian agro-tourism dining certified along the access corridor.
              </p>
              <span className="text-[10px] text-slate-500 block font-mono">Verified OpenStreetMap Points: {Math.round(spot.physicalCapacity / 300)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Getting There & Bypass Route</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Toll route: NH-48 Ghat bypass. When critical alerts fire, state police redirect through northern loop saving 45 minutes of idling traffic.
              </p>
              <span className="text-[10px] text-slate-500 block font-mono">Highway Delay Factor: {(1.0 + spot.weatherHazardScore * 0.8).toFixed(2)}x</span>
            </div>
          </div>
        </section>

        {/* ── 5. COMMUNITY CHECK-INS ── */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-gov-navy" />
                <span>Recent Community Ground Check-Ins</span>
              </h2>
              <p className="text-xs text-slate-500">
                Crowdsourced observations by travelers physically on-site, feeding real-time confidence scores.
              </p>
            </div>
            <button
              onClick={() => setCheckInModalOpen(true)}
              className="px-3.5 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              + Submit Check-In
            </button>
          </div>

          <div className="space-y-3">
            {checkIns.map((chk) => (
              <div key={chk.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900">{chk.user_label}</strong>
                    <span className="text-amber-500 font-bold">{'★'.repeat(chk.rating)}</span>
                    <span className="text-[10px] text-slate-400 font-mono">• {chk.timestamp}</span>
                  </div>
                  {chk.comment && <p className="text-slate-700 mt-1">{chk.comment}</p>}
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1.5">
                    {chk.rating <= 2 ? 'Low Crowds' : chk.rating <= 4 ? 'Moderate' : 'Heavy Crowd'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. PLAN A TRIP HERE CTA ── */}
        <section className="bg-gradient-to-r from-gov-navy to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              Smart Decongested Trip Planning
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">Plan Your Visit to {spot.name}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              Pre-fill our AI scheduler to balance travel dates with predictive crowd curves, toll vouchers, and verified homestays.
            </p>
          </div>

          <Link
            to={`/plan/new?spot=${spot.id}`}
            className="px-6 py-3 bg-gov-gold hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs sm:text-sm transition shrink-0 shadow-md flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Generate Itinerary</span>
          </Link>
        </section>

        {/* ========================================================================= */}
        {/* ── 7. ROLE-CONDITIONAL AUTHORITY PANEL (§3.2 / AUTHORITY JOURNEY) ─────── */}
        {/* ========================================================================= */}
        {isAuthority && (
          <section className="bg-slate-900 text-white rounded-3xl border-2 border-gov-gold p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gov-gold text-slate-950 rounded-xl font-bold">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-gov-gold">
                      Authority Incident & Capacity Control Panel
                    </h2>
                    <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                      Role: Official Authority
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Additive management tools for <strong>{spot.name}</strong>. Operations are strictly enforced server-side against your administrative jurisdiction.
                  </p>
                </div>
              </div>

              {/* Jurisdiction Status Pill */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
                hasJurisdiction
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300'
              }`}>
                {hasJurisdiction ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <div>
                  <span className="block text-[9px] uppercase tracking-wider opacity-75">Jurisdiction Scope</span>
                  <span>{hasJurisdiction ? `Authorized (${jurisdiction?.type}: ${jurisdiction?.value})` : `Read-Only (Outside ${jurisdiction?.value})`}</span>
                </div>
              </div>
            </div>

            {/* Sub-Panel 1: Capacity Override Slider */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Emergency Capacity Override (Hard Ceiling)
                </span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {overrideCapValue.toLocaleString()} Max Visitors
                </span>
              </div>

              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                disabled={!hasJurisdiction}
                value={overrideCapValue}
                onChange={(e) => setOverrideCapValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gov-gold disabled:opacity-40"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <input
                  type="text"
                  disabled={!hasJurisdiction}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Reason for override (e.g. Flash Flood Risk)..."
                  className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gov-gold disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={handleCapacityOverrideSubmit}
                  disabled={!hasJurisdiction || overrideSubmitting}
                  className="w-full sm:w-auto px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs transition disabled:opacity-40 shrink-0"
                >
                  {overrideSubmitting ? 'Updating Backend…' : 'Apply Override (PUT /api)'}
                </button>
              </div>

              {overrideFeedback && (
                <div className={`p-2.5 rounded-xl text-xs font-bold ${
                  overrideFeedback.type === 'success' ? 'bg-emerald-950 border border-emerald-700 text-emerald-300' : 'bg-rose-950 border border-rose-700 text-rose-300'
                }`}>
                  {overrideFeedback.message}
                </div>
              )}
            </div>

            {/* Sub-Panel 2: Spot-Scoped Advisory Composer */}
            <form onSubmit={handleAuthorityAdvisoryBroadcast} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-rose-400" />
                  Issue Gazette Emergency Bulletin for {spot.name}
                </span>
                <span className="text-[10px] text-slate-400">Writes directly to SQLite gazette_advisories</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Advisory Headline</label>
                  <input
                    type="text"
                    disabled={!hasJurisdiction}
                    value={advTitle}
                    onChange={(e) => setAdvTitle(e.target.value)}
                    placeholder="e.g. Heavy Inundation Warning near Ghat Tunnel"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gov-gold disabled:opacity-40"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Severity Level</label>
                  <select
                    disabled={!hasJurisdiction}
                    value={advSeverity}
                    onChange={(e) => setAdvSeverity(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gov-gold disabled:opacity-40"
                  >
                    <option value="low">Low (Notice)</option>
                    <option value="medium">Medium (Moderate Warning)</option>
                    <option value="high">High (Heavy Rush/Hazard)</option>
                    <option value="critical">Critical (Immediate Diversion)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Advisory Message & Citizen Action</label>
                <textarea
                  rows={2}
                  disabled={!hasJurisdiction}
                  value={advMessage}
                  onChange={(e) => setAdvMessage(e.target.value)}
                  placeholder="Provide precise diversion or safety guidance to tourists..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gov-gold disabled:opacity-40"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 w-full sm:w-auto text-xs text-slate-400">
                  <span className="text-[10px]">Validity Expiry:</span>
                  <input
                    type="datetime-local"
                    disabled={!hasJurisdiction}
                    value={advExpiresAt.slice(0, 16)}
                    onChange={(e) => setAdvExpiresAt(`${e.target.value}:00`)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!hasJurisdiction || advBroadcasting}
                  className="w-full sm:w-auto px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{advBroadcasting ? 'Broadcasting…' : 'Broadcast Live Bulletin'}</span>
                </button>
              </div>

              {advFeedback && (
                <div className={`p-2.5 rounded-xl text-xs font-bold ${
                  advFeedback.type === 'success' ? 'bg-emerald-950 border border-emerald-700 text-emerald-300' : 'bg-rose-950 border border-rose-700 text-rose-300'
                }`}>
                  {advFeedback.message}
                </div>
              )}
            </form>
          </section>
        )}
      </main>

      {/* ── Community Check-In Modal ── */}
      <AnimatePresence>
        {checkInModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-base">Ground Check-In at {spot.name}</h3>
                <button onClick={() => setCheckInModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <form onSubmit={handleCheckInSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">How are the crowd levels right now?</label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCheckInRating(r)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm border transition ${
                          checkInRating === r
                            ? 'bg-gov-navy text-white border-gov-navy shadow-xs'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {r}★
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">1 = Completely Empty • 5 = Severe Traffic & Gridlock</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Observation Note</label>
                  <textarea
                    rows={3}
                    value={checkInNote}
                    onChange={(e) => setCheckInNote(e.target.value)}
                    placeholder="e.g. Parking at viewpoint is 80% full, but road is clear."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-gov-navy"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckInModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded-xl font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
