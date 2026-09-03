import { useEffect } from 'react';
import { useCorridorStore } from './store/useCorridorStore';
import { Navbar } from './components/common/Navbar';
import { TouristView } from './components/tourist/TouristView';
import { AuthorityView } from './components/authority/AuthorityView';
import { ProviderView } from './components/provider/ProviderView';
import { AuthModal } from './components/auth/AuthModal';
import { AiHelplineBot } from './components/common/AiHelplineBot';
import { 
  Compass, 
  ShieldAlert, 
  Building2,
  ExternalLink,
  Lock
} from 'lucide-react';

export function App() {
  const { 
    role, 
    requestRoleChange, 
    currentUser, 
    setAuthModalOpen,
    fetchLiveBackendFeed 
  } = useCorridorStore();

  // Automatic on-load sync with Python backend sensor pipeline
  useEffect(() => {
    // Initial fetch on mount
    fetchLiveBackendFeed();

    // Background sensor polling every 25 seconds
    const interval = setInterval(() => {
      fetchLiveBackendFeed();
    }, 25000);

    return () => clearInterval(interval);
  }, [fetchLiveBackendFeed]);

  return (
    <div className="min-h-screen bg-gov-light flex flex-col font-sans text-slate-900 gov-pattern pb-16 lg:pb-0">
      {/* Top Government Navbar */}
      <Navbar />

      {/* Global Stakeholder Authentication Modal */}
      <AuthModal />

      {/* 24x7 AI Tourism Helpline Assistant Widget */}
      <AiHelplineBot />

      {/* Main Content View Container */}
      <main className="flex-1 pb-10">
        {role === 'tourist' && <TouristView />}
        {role === 'authority' && <AuthorityView />}
        {role === 'provider' && <ProviderView />}
      </main>

      {/* Official Government Portal Footer */}
      <footer className="bg-gov-navy text-slate-300 text-xs border-t-4 border-gov-gold pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700/80">
            {/* Column 1: Ministry Info */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-gov-gold flex items-center justify-center text-xl text-gov-navy font-serif">
                  🏛️
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    EcoRoute Bharat — Sustainable Tourism & Smart Travel Portal
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ministry of Tourism, Govt. of India • Western Ghats & Maharashtra Corridor
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
                An AI-driven carrying capacity and tourist diffusion initiative deployed across the Western Ghats & Maharashtra Corridor in partnership with Maharashtra Tourism Development Corporation (MTDC) & District Disaster Management Authorities.
              </p>
            </div>

            {/* Column 2: Citizen & Tourist Portals */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gov-gold">
                Quick Navigation
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li><button onClick={() => requestRoleChange('tourist')} className="hover:text-white hover:underline text-left">Citizen Travel Advisory & Green Yatra</button></li>
                <li><button onClick={() => requestRoleChange('authority')} className="hover:text-white hover:underline text-left">District GIS Emergency Command</button></li>
                <li><button onClick={() => requestRoleChange('provider')} className="hover:text-white hover:underline text-left">Homestay & Tour Operator Registry</button></li>
                <li><button onClick={() => setAuthModalOpen(true)} className="text-amber-300 hover:text-white hover:underline text-left font-bold flex items-center gap-1">Stakeholder Portal Gateway <Lock className="w-3 h-3" /></button></li>
                <li><a href="https://tourism.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">Ministry of Tourism <ExternalLink className="w-3 h-3 text-slate-400" /></a></li>
              </ul>
            </div>

            {/* Column 3: Official Helplines & Compliance */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gov-gold">
                Helpline & Support
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li>National Tourist Helpline: <strong className="text-white">1363 (24x7 Toll Free)</strong></li>
                <li>National Emergency Response: <strong className="text-rose-400">112</strong></li>
                <li>Right to Information (RTI) Disclosures</li>
                <li>CPGRAMS Citizen Grievance Portal</li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & NIC Attribution */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              <p>
                © 2026 Ministry of Tourism, Government of India. All Rights Reserved.
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Designed & Developed under SIH26204 • Hosted by National Informatics Centre (NIC) Node.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-slate-400">Website Policy</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Terms & Conditions</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Web Information Manager</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Quick-Action Role Switcher */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gov-navy border-t border-slate-700 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => requestRoleChange('tourist')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition ${
            role === 'tourist' ? 'text-amber-300 bg-slate-800' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Citizen Portal</span>
        </button>

        <button
          onClick={() => requestRoleChange('authority')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition ${
            role === 'authority' ? 'text-amber-300 bg-slate-800' : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 mb-0.5" />
          <span className="flex items-center gap-1">
            District GIS
            {currentUser.role !== 'authority' && <Lock className="w-2.5 h-2.5 text-slate-400" />}
          </span>
        </button>

        <button
          onClick={() => requestRoleChange('provider')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold transition ${
            role === 'provider' ? 'text-amber-300 bg-slate-800' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4 mb-0.5" />
          <span className="flex items-center gap-1">
            Providers
            {currentUser.role !== 'provider' && <Lock className="w-2.5 h-2.5 text-slate-400" />}
          </span>
        </button>
      </nav>
    </div>
  );
}

export default App;
