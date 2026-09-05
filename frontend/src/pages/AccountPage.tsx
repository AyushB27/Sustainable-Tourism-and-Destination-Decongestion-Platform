import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Save, 
  Lock,
  LogOut
} from 'lucide-react';
import { useCorridorStore } from '../store/useCorridorStore';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    role,
    requestRoleChange,
    logoutUser,
    setAuthModalOpen,
    userPreferences,
    togglePreferenceTag
  } = useCorridorStore();

  const [homeCity, setHomeCity] = useState(currentUser.homeCity || 'Mumbai');
  const [homeState, setHomeState] = useState(currentUser.homeState || 'Maharashtra');
  const [interests, setInterests] = useState<string[]>(
    currentUser.interests || ['Waterfalls', 'Hill Treks', 'Konkani Food', 'Heritage Forts']
  );
  const [newTag, setNewTag] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const styleItems = [
    { key: 'scenic' as const, label: 'Scenic Vistas & Clouds', icon: '🏔️', idx: 0 },
    { key: 'budget' as const, label: 'Budget-Friendly Stays', icon: '💰', idx: 1 },
    { key: 'adventure' as const, label: 'Adventure & Ghat Treks', icon: '🥾', idx: 2 },
    { key: 'family' as const, label: 'Family Comfort & Nature', icon: '👨‍👩‍👧‍👦', idx: 3 }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      homeCity,
      homeState,
      interests
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !interests.includes(newTag.trim())) {
      setInterests([...interests, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setInterests(interests.filter(t => t !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-extrabold text-gov-navy uppercase tracking-wider mb-1">
          <User className="w-3.5 h-3.5" />
          <span>Profile & Progressive Preferences (§4.3, §9)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Traveler Profile & Persona
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Configure your regional origin and travel vector. We never ask for intrusive surveys; your preferences shape Discover recommendations and carbon calculations.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* User Identity Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gov-navy text-amber-300 font-black text-xl flex items-center justify-center shadow">
              {currentUser.role === 'authority' ? '🛡️' : currentUser.role === 'provider' ? '🏨' : currentUser.role === 'developer' ? '⚡' : '🧭'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-slate-900 text-base">{currentUser.name}</strong>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentUser.designation} • {currentUser.department}</p>
            </div>
          </div>

          {currentUser.isAuthenticated ? (
            <button
              type="button"
              onClick={logoutUser}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="px-3.5 py-1.5 bg-gov-navy text-amber-300 text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Stakeholder Gateway Login</span>
            </button>
          )}
        </div>

        {/* 1. Home City & State (§4.3) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            1. Home Origin (For ETA and Carbon Savings math)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Home City:</label>
              <input
                type="text"
                value={homeCity}
                onChange={e => setHomeCity(e.target.value)}
                placeholder="e.g. Pune, Mumbai, Thane"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-gov-navy"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Home State:</label>
              <input
                type="text"
                value={homeState}
                onChange={e => setHomeState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-gov-navy"
              />
            </div>
          </div>
        </div>

        {/* 2. Travel Style 4 Tap-Cards (§4.3, §9) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 block">
            2. Travel Style Affinity (4 Tap-Cards — Not a tedious survey):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {styleItems.map(item => {
              const active = userPreferences[item.idx] >= 0.70;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => togglePreferenceTag(item.key)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                    active
                      ? 'bg-gov-navy text-white border-gov-navy shadow-md ring-2 ring-gov-navy/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="mt-2">
                    <strong className="text-xs block leading-tight">{item.label}</strong>
                    <span className={`text-[10px] mt-0.5 block ${active ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                      {active ? '● Active Priority' : 'Standard'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Specific Interest Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 block">
            3. Specific Interests & Discovery Themes:
          </label>
          <div className="flex flex-wrap gap-2">
            {interests.map(t => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-3 py-1 rounded-xl text-xs font-medium text-slate-800"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm pt-1">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add theme (e.g. Birdwatching)…"
              className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-gov-navy"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl"
            >
              Add
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Preferences saved successfully!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              Changes update your Discover feed and twin recommendations immediately.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-gov-navy hover:bg-gov-navy-light text-amber-300 font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Role Access Gateway */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Stakeholder Consoles & Access Level
        </h3>
        <p className="text-xs text-slate-500">
          EcoRoute Bharat adapts its panels based on your authenticated role. Select a role below to simulate or access the respective views:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <button
            type="button"
            onClick={() => requestRoleChange('tourist')}
            className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
              role === 'tourist' ? 'bg-gov-navy text-white border-gov-navy' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            🧭 Tourist & Citizen
          </button>
          <button
            type="button"
            onClick={() => requestRoleChange('authority')}
            className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
              role === 'authority' ? 'bg-gov-navy text-white border-gov-navy' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            🛡️ District GIS Authority
          </button>
          <button
            type="button"
            onClick={() => requestRoleChange('provider')}
            className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
              role === 'provider' ? 'bg-gov-navy text-white border-gov-navy' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            🏨 Homestay Provider
          </button>
          <button
            type="button"
            onClick={() => requestRoleChange('developer')}
            className={`p-3 rounded-2xl border text-left text-xs font-bold transition ${
              role === 'developer' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            ⚡ Developer Audit
          </button>
        </div>
      </div>
    </div>
  );
};
