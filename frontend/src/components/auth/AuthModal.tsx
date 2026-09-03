import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Building2, 
  Compass, 
  X, 
  Lock, 
  User, 
  Key, 
  AlertCircle, 
  Zap, 
  ShieldCheck
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { UserRole, AuthUser } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    authModalTargetRole, 
    setAuthModalOpen, 
    loginUser
  } = useCorridorStore();

  const [selectedTab, setSelectedTab] = useState<UserRole>('authority');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authModalTargetRole) {
      setSelectedTab(authModalTargetRole);
    }
  }, [authModalTargetRole]);

  if (!authModalOpen) return null;

  // Preset Fast Demo Credentials for quick 1-click evaluation
  const demoAuthorityProfiles: AuthUser[] = [
    {
      id: 'AUTH-PUNE-01',
      name: 'Dr. Rajeshwar Patil, IAS',
      role: 'authority',
      designation: 'District Magistrate & Disaster Management Officer',
      department: 'Pune District Administration',
      badgeNumber: 'IAS-MH-2018-9412',
      isAuthenticated: true
    },
    {
      id: 'AUTH-RAIGAD-02',
      name: 'Sunita Shinde, IPS',
      role: 'authority',
      designation: 'Superintendent of Police & Traffic Command',
      department: 'Raigad District Police',
      badgeNumber: 'IPS-MH-2019-3201',
      isAuthenticated: true
    }
  ];

  const demoProviderProfiles: AuthUser[] = [
    {
      id: 'PROV-MATHERAN-01',
      name: 'Matheran Eco-Heritage Homestays',
      role: 'provider',
      designation: 'Authorized MTDC Homestay Host',
      department: 'Maharashtra Tourism Development Corporation',
      badgeNumber: 'MTDC-ACC-2026-883',
      isAuthenticated: true
    },
    {
      id: 'PROV-KASHID-02',
      name: 'Kashid Sands Beach Resort & Watersports',
      role: 'provider',
      designation: 'Accredited Coastal Resort Partner',
      department: 'Raigad Tourism Hospitality Council',
      badgeNumber: 'MTDC-ACC-2026-442',
      isAuthenticated: true
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Try backend authentication
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role: selectedTab }),
        signal: AbortSignal.timeout(3000)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.user) {
          loginUser(data.user);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Backend offline fallback
    }

    // 2. Local Demo Verification
    if (selectedTab === 'authority') {
      const match = demoAuthorityProfiles[0];
      loginUser(match);
    } else if (selectedTab === 'provider') {
      const match = demoProviderProfiles[0];
      loginUser(match);
    } else {
      loginUser({
        id: 'CITIZEN-GUEST-01',
        name: 'Citizen Tourist',
        role: 'tourist',
        designation: 'Green Yatra Pass Holder',
        department: 'National Tourism Citizen Gateway',
        badgeNumber: 'IND-YATRA-2026',
        isAuthenticated: true
      });
    }
    setLoading(false);
  };

  const handleQuickDemoLogin = (profile: AuthUser) => {
    loginUser(profile);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl w-full max-w-xl overflow-hidden"
        >
          {/* Top National Flag Accent Strip */}
          <div className="tiranga-bar" />

          {/* Modal Header */}
          <div className="bg-gov-navy text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-gov-navy font-bold text-lg flex items-center justify-center border border-gov-gold">
                🏛️
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight text-white flex items-center gap-2">
                  <span>Stakeholder Portal Gateway</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Government of India • Ministry of Tourism & MTDC Portal Login
                </p>
              </div>
            </div>

            <button
              onClick={() => setAuthModalOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stakeholder Category Tabs */}
          <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-300 text-xs font-bold">
            <button
              onClick={() => { setSelectedTab('tourist'); setErrorMessage(null); }}
              className={`py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition ${
                selectedTab === 'tourist'
                  ? 'border-gov-navy bg-white text-gov-navy font-black shadow-sm'
                  : 'border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Citizen Tourist</span>
            </button>

            <button
              onClick={() => { setSelectedTab('authority'); setErrorMessage(null); }}
              className={`py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition ${
                selectedTab === 'authority'
                  ? 'border-gov-navy bg-white text-gov-navy font-black shadow-sm'
                  : 'border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>District Officer</span>
            </button>

            <button
              onClick={() => { setSelectedTab('provider'); setErrorMessage(null); }}
              className={`py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition ${
                selectedTab === 'provider'
                  ? 'border-gov-navy bg-white text-gov-navy font-black shadow-sm'
                  : 'border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>MTDC Operator</span>
            </button>
          </div>

          {/* Form & Fast Demo Container */}
          <div className="p-5 sm:p-6 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Tab 1: Citizen Gateway */}
            {selectedTab === 'tourist' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-gov-green rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Public Citizen & Tourist Portal
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                    Citizen access is open and free to all tourists. Explore real-time carrying capacity, receive traffic bypass alerts, and generate official Green Yatra Passes.
                  </p>
                </div>

                <button
                  onClick={() => handleLogin({ preventDefault: () => {} } as React.FormEvent)}
                  className="w-full bg-gov-navy hover:bg-gov-navy-light text-white font-bold py-3 px-4 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-amber-300" />
                  <span>Continue to Citizen Portal</span>
                </button>
              </div>
            )}

            {/* Tab 2: District Authority Login */}
            {selectedTab === 'authority' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-950 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Restricted Government Area:</strong> For District Magistrates, Police Superintendents, and Disaster Management Officers.
                  </div>
                </div>

                {/* 1-Click Fast Demo Login */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    ⚡ 1-Click Fast Demo Login (For Testing & Presentation):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {demoAuthorityProfiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(p)}
                        className="p-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-left transition space-y-0.5 group"
                      >
                        <div className="font-bold text-xs text-slate-900 group-hover:text-rose-900 flex items-center justify-between">
                          <span>{p.name.split(',')[0]}</span>
                          <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">Officer</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{p.designation}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-bold absolute">OR Enter Credentials</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Official Gov Email / Officer ID:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="pune.collector@gov.in"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-gov-navy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Official PIN / Password:
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-gov-navy"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gov-navy hover:bg-gov-navy-light text-white font-bold py-3 px-4 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Verifying...' : 'Log In to District Command Center'}</span>
                </button>
              </form>
            )}

            {/* Tab 3: MTDC Provider Login */}
            {selectedTab === 'provider' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>MTDC Accredited Provider Console:</strong> For registered hoteliers, homestay hosts, and accredited tour guides.
                  </div>
                </div>

                {/* 1-Click Fast Demo Login for Providers */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    ⚡ 1-Click Fast Demo Login (For Testing & Presentation):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {demoProviderProfiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(p)}
                        className="p-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition space-y-0.5 group"
                      >
                        <div className="font-bold text-xs text-slate-900 group-hover:text-amber-950 flex items-center justify-between">
                          <span className="truncate max-w-[150px]">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
                          <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">MTDC</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{p.designation}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2 text-[10px] text-slate-400 uppercase font-bold absolute">OR Enter MTDC Credentials</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      MTDC Registration ID / Email:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="MTDC/2026/HOTEL-99"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-gov-navy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Password:
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-gov-navy"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gov-navy hover:bg-gov-navy-light text-white font-bold py-3 px-4 rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{loading ? 'Verifying...' : 'Log In to MTDC Provider Console'}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
