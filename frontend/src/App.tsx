import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import { useCorridorStore } from './store/useCorridorStore';
import { Navbar } from './components/common/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { AiHelplineBot } from './components/common/AiHelplineBot';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { RegionPage } from './pages/RegionPage';
import { SpotPage } from './pages/SpotPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { SavedTripDetailPage } from './pages/SavedTripDetailPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { AccountPage } from './pages/AccountPage';
import { AdvisoriesPage } from './pages/AdvisoriesPage';
import { AuthorityCommandPage } from './pages/AuthorityCommandPage';
import { ProviderConsolePage } from './pages/ProviderConsolePage';
import { DevPortal } from './components/developer/DevPortal';

import { 
  Compass, 
  ShieldAlert, 
  ExternalLink,
  Lock,
  Code2,
  Sparkles,
  Calendar,
  User
} from 'lucide-react';

/** Redirect helper for legacy/provisional paths */
function SpotRedirect() {
  const { spotId } = useParams<{ spotId: string }>();
  return <Navigate to={`/spot/${spotId}`} replace />;
}

export function App() {
  const { 
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
    <BrowserRouter>
      <div className="min-h-screen bg-gov-light flex flex-col font-sans text-slate-900 gov-pattern pb-16 lg:pb-0">
        {/* Top Government Navbar */}
        <Navbar />

        {/* Global Stakeholder Authentication Modal */}
        <AuthModal />

        {/* 24x7 AI Tourism Helpline Assistant Widget */}
        <AiHelplineBot />

        {/* Main Content Router */}
        <main className="flex-1 pb-10">
          <Routes>
            {/* 1. Landing & Search */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/region/:type/:value" element={<RegionPage />} />

            {/* 2. Canonical Destination Spot Page (§3.1, §3.2) */}
            <Route path="/spot/:spotId" element={<SpotPage />} />

            {/* 3. Trip Planner & Itinerary */}
            <Route path="/plan/new" element={<TripPlannerPage />} />
            <Route path="/plan/:tripId" element={<SavedTripDetailPage />} />
            <Route path="/trips" element={<MyTripsPage />} />

            {/* 4. Account & Advisories */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/advisories" element={<AdvisoriesPage />} />

            {/* 5. Stakeholder Consoles (Provisional placeholders funneled to /spot/:spotId) */}
            <Route path="/authority" element={<AuthorityCommandPage />} />
            <Route path="/authority/spot/:spotId" element={<SpotRedirect />} />
            <Route path="/provider" element={<ProviderConsolePage />} />
            <Route path="/provider/spot/:spotId" element={<SpotRedirect />} />

            {/* 6. Developer & Fallback */}
            <Route path="/dev" element={<DevPortal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
                  <li>
                    <Link to="/discover" className="hover:text-white hover:underline flex items-center gap-1">
                      <span>Algorithmic Discover Feed</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/plan/new" className="hover:text-white hover:underline flex items-center gap-1">
                      <span>Smart Trip Planner & Green Pass</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/advisories" className="hover:text-white hover:underline flex items-center gap-1">
                      <span>Official Gazette Advisories</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/authority" className="hover:text-white hover:underline flex items-center gap-1">
                      <span>District GIS Emergency Command</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider" className="hover:text-white hover:underline flex items-center gap-1">
                      <span>Homestay & Operator Console</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dev" className="text-cyan-400 hover:text-white hover:underline font-bold flex items-center gap-1">
                      <span>Developer Audit Portal</span> <Code2 className="w-3 h-3" />
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => setAuthModalOpen(true)} 
                      className="text-amber-300 hover:text-white hover:underline text-left font-bold flex items-center gap-1"
                    >
                      <span>Stakeholder Portal Gateway</span> <Lock className="w-3 h-3" />
                    </button>
                  </li>
                  <li>
                    <a href="https://tourism.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                      <span>Ministry of Tourism</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </li>
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
                  <li className="pt-2">
                    <span className="text-[10px] text-slate-400">
                      Logged in as: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role})
                    </span>
                  </li>
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

        {/* Mobile Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gov-navy border-t border-slate-700 shadow-2xl px-2 py-1.5 flex items-center justify-around">
          <Link
            to="/"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition"
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            to="/discover"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition"
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span>Discover</span>
          </Link>

          <Link
            to="/plan/new"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition"
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Plan</span>
          </Link>

          <Link
            to="/authority"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition"
          >
            <ShieldAlert className="w-4 h-4 mb-0.5" />
            <span>Authority</span>
          </Link>

          <Link
            to="/account"
            className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition"
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>Account</span>
          </Link>
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;
