import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCorridorStore } from './store/useCorridorStore';
import { AuthModal } from './components/auth/AuthModal';
import { RoleGuard } from './components/auth/RoleGuard';

// Layout Shells
import { TouristLayout } from './components/layout/TouristLayout';
import { AuthorityLayout } from './components/layout/AuthorityLayout';
import { ProviderLayout } from './components/layout/ProviderLayout';
import { DevLayout } from './components/layout/DevLayout';

// Pages
import { PortalSelectPage } from './pages/PortalSelectPage';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { RegionPage } from './pages/RegionPage';
import { SpotPage } from './pages/SpotPage';
import { AuthoritySpotPage } from './pages/AuthoritySpotPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { SavedTripDetailPage } from './pages/SavedTripDetailPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { AccountPage } from './pages/AccountPage';
import { AuthorityCommandPage } from './pages/AuthorityCommandPage';
import { ProviderConsolePage } from './pages/ProviderConsolePage';
import { AuthorityView } from './components/authority/AuthorityView';
import { ProviderView } from './components/provider/ProviderView';
import { DevPortal } from './components/developer/DevPortal';

export function App() {
  const { fetchLiveBackendFeed } = useCorridorStore();

  // Background sensor pipeline synchronization
  useEffect(() => {
    fetchLiveBackendFeed();
    const interval = setInterval(() => {
      fetchLiveBackendFeed();
    }, 25000);
    return () => clearInterval(interval);
  }, [fetchLiveBackendFeed]);

  return (
    <>
      {/* Global Stakeholder Authentication Modal */}
      <AuthModal />

      {/* Role-Isolated Routing Hierarchy */}
      <Routes>
        {/* ── PART 1: DEDICATED PORTAL SELECTION & AUTHENTICATION ── */}
        <Route path="/" element={<PortalSelectPage />} />
        <Route path="/select-portal" element={<PortalSelectPage />} />
        <Route path="/portals" element={<PortalSelectPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        {/* ── PART 2A: ISOLATED TOURIST PORTAL SHELL ── */}
        <Route element={<TouristLayout />}>
          <Route path="/tourist" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/region/:type/:value" element={<RegionPage />} />
          <Route path="/spot/:spotId" element={<SpotPage />} />
          <Route path="/plan/new" element={<TripPlannerPage />} />
          <Route path="/plan/:tripId" element={<SavedTripDetailPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        {/* ── PART 2B: ISOLATED DISTRICT GIS AUTHORITY SHELL (PROTECTED) ── */}
        <Route
          element={
            <RoleGuard allowedRoles={['authority']}>
              <AuthorityLayout />
            </RoleGuard>
          }
        >
          <Route path="/authority" element={<AuthorityView />} />
          <Route path="/authority/advisories" element={<AuthorityView />} />
          <Route path="/authority/policy-simulator" element={<AuthorityView />} />
          <Route path="/authority/impact" element={<AuthorityView />} />
          <Route path="/authority/overview" element={<AuthorityCommandPage />} />
          <Route path="/authority/spot/:spotId" element={<AuthoritySpotPage />} />
        </Route>

        {/* ── PART 2C: ISOLATED MTDC OPERATOR CONSOLE SHELL (PROTECTED) ── */}
        <Route
          element={
            <RoleGuard allowedRoles={['provider']}>
              <ProviderLayout />
            </RoleGuard>
          }
        >
          <Route path="/provider" element={<ProviderView />} />
          <Route path="/provider/listings" element={<ProviderConsolePage />} />
          <Route path="/provider/spot/:spotId" element={<SpotPage />} />
        </Route>

        {/* ── PART 2D: INTERNAL DEVELOPER DIAGNOSTICS SHELL (PROTECTED) ── */}
        <Route
          element={
            <RoleGuard allowedRoles={['developer']}>
              <DevLayout />
            </RoleGuard>
          }
        >
          <Route path="/dev" element={<DevPortal />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
