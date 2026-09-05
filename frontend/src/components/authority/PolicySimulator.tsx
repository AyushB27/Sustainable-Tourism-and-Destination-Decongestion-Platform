import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  Play,
  RefreshCw
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { PolicySimulationResult } from '../../types';

export const PolicySimulator: React.FC = () => {
  const {
    destinations,
    currentUser,
    runPolicySimulation
  } = useCorridorStore();

  const [selectedSpotId, setSelectedSpotId] = useState(destinations[0]?.id || 'LON');
  const [proposedCap, setProposedCap] = useState(3800);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<PolicySimulationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter available spots to official's jurisdiction
  const jurisdictionSpots = React.useMemo(() => {
    const jur = currentUser.jurisdiction;
    if (!jur || jur.type === 'state') return destinations;
    if (jur.type === 'district') {
      return destinations.filter(d => d.district.toLowerCase().includes(String(jur.value).toLowerCase()));
    }
    if (jur.type === 'spot_list' && Array.isArray(jur.value)) {
      return destinations.filter(d => jur.value.includes(d.id));
    }
    return destinations;
  }, [destinations, currentUser.jurisdiction]);

  const targetSpot = destinations.find(d => d.id === selectedSpotId) || destinations[0];

  // Set default proposed cap when spot changes
  useEffect(() => {
    if (targetSpot) {
      setProposedCap(Math.round(targetSpot.physicalCapacity * 0.7));
    }
  }, [selectedSpotId]);

  const handleRunSimulation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await runPolicySimulation(selectedSpotId, proposedCap);
      setSimResult(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first mount
  useEffect(() => {
    handleRunSimulation();
  }, [selectedSpotId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-gov-navy" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Interactive Capacity Cap & Twin Diffusion Policy Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Model administrative carrying capacity caps and evaluate mathematical deflection to certified twin destinations in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Formula: DCC = 0.70 × (Inflow/Cap) + 0.30 × Hazard</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-950 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Sandbox */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Policy Parameters Sandbox</span>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
              Live Input
            </span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Target Destination (In Jurisdiction)</label>
            <select
              value={selectedSpotId}
              onChange={(e) => setSelectedSpotId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800"
            >
              {jurisdictionSpots.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.district}) — Current Inflow: {d.currentInflow}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="font-bold text-slate-700">Proposed Inflow Cap (Visitors)</label>
              <span className="font-mono font-black text-gov-navy text-sm">{proposedCap.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={targetSpot.physicalCapacity * 1.5}
              step={200}
              value={proposedCap}
              onChange={(e) => setProposedCap(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-navy"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Strict (1,000)</span>
              <span>Physical Cap ({targetSpot.physicalCapacity.toLocaleString()})</span>
              <span>Lax ({(targetSpot.physicalCapacity * 1.5).toLocaleString()})</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block text-[11px] uppercase">Current Operational Baseline</span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Current Inflow:</span>
                <strong className="text-slate-800">{targetSpot.currentInflow.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Physical Capacity:</span>
                <strong className="text-slate-800">{targetSpot.physicalCapacity.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Monsoon Hazard:</span>
                <strong className="text-slate-800">{(targetSpot.weatherHazardScore * 100).toFixed(0)}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Dwell Time:</span>
                <strong className="text-slate-800">{targetSpot.avgDwellTimeHours} hours</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-2.5 bg-gov-navy hover:bg-slate-800 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-amber-300" /> : <Play className="w-4 h-4 text-amber-300" />}
            <span>{loading ? 'Evaluating Model…' : 'Run Mathematical Simulation'}</span>
          </button>
        </div>

        {/* Right Column: "Show Your Work" Math Transparency & Twin Absorption */}
        <div className="lg:col-span-7 space-y-6">
          {simResult && (
            <>
              {/* Target Spot Comparison */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span>Modeled Target Effect: {simResult.target_spot.name}</span>
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    Deflected: {simResult.target_spot.modeled.deflected_visitors.toLocaleString()} visitors
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Baseline DCC</span>
                    <strong className="text-base text-slate-900 block mt-0.5">
                      {simResult.target_spot.baseline.dcc_score.toFixed(2)}
                    </strong>
                    <span className="text-[10px] font-bold text-rose-600">{simResult.target_spot.baseline.status}</span>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 uppercase block">Modeled DCC</span>
                    <strong className="text-base text-emerald-950 block mt-0.5">
                      {simResult.target_spot.modeled.dcc_score.toFixed(2)}
                    </strong>
                    <span className="text-[10px] font-bold text-emerald-700">{simResult.target_spot.modeled.status}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block">Baseline Wait</span>
                    <strong className="text-base text-slate-900 block mt-0.5">
                      {simResult.target_spot.baseline.wait_time_minutes}m
                    </strong>
                    <span className="text-[10px] text-slate-500">bottleneck delay</span>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 uppercase block">Wait Time Saved</span>
                    <strong className="text-base text-emerald-950 block mt-0.5">
                      -{simResult.target_spot.modeled.wait_time_saved_minutes}m
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-bold">saved per tourist</span>
                  </div>
                </div>

                {/* Plain Mathematical Derivation ("Show Your Work") */}
                <div className="p-3 bg-slate-900 text-white rounded-xl text-[11px] font-mono space-y-1">
                  <span className="text-amber-300 font-bold block">Mathematical Derivation:</span>
                  <p className="text-slate-300">
                    1. Proposed Cap = {simResult.target_spot.modeled.proposed_cap} → Effective Inflow = {simResult.target_spot.modeled.effective_inflow}
                  </p>
                  <p className="text-slate-300">
                    2. Utilization = ({simResult.target_spot.modeled.effective_inflow} / {simResult.target_spot.baseline.capacity}) = {simResult.target_spot.modeled.utilization_pct}%
                  </p>
                  <p className="text-slate-300">
                    3. DCC = (0.70 × {simResult.target_spot.modeled.utilization_pct / 100}) + (0.30 × {simResult.math_model.hazard_score}) = <strong className="text-emerald-400">{simResult.target_spot.modeled.dcc_score.toFixed(2)} ({simResult.target_spot.modeled.status})</strong>
                  </p>
                </div>
              </div>

              {/* Twin Destination Absorption */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Modeled Absorption by Certified Twin Destinations</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Reusing 4D Cosine Recommender Engine
                  </span>
                </div>

                <div className="space-y-3">
                  {simResult.twin_absorption.map((tw) => (
                    <div key={tw.twin_id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 text-sm">{tw.twin_name}</strong>
                          <span className="bg-white border border-slate-300 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                            {(tw.similarity_score * 100).toFixed(0)}% Cosine Match
                          </span>
                        </div>
                        <span className="text-emerald-700 font-mono font-bold">
                          +{tw.absorbed_visitors.toLocaleString()} Diverted Tourists
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Baseline Inflow</span>
                          <span className="text-slate-800">{tw.baseline_inflow.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Post-Inflow</span>
                          <strong className="text-slate-900">{tw.modeled_inflow.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">New DCC</span>
                          <strong className="text-emerald-700">{tw.modeled_dcc.toFixed(2)} ({tw.modeled_status})</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block uppercase">Safe Headroom</span>
                          <span className="text-slate-700">{tw.remaining_headroom.toLocaleString()} safe spaces</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
