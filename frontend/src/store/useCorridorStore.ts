import { create } from 'zustand';
import type {
  Destination,
  UserRole,
  AuthUser,
  Advisory,
  Promotion,
  DestinationCategory,
  DemandFlow,
  PolicySimulationResult,
  CheckIn,
  TripPlan,
  GreenPass,
} from '../types';
import type { Language } from '../lib/i18n';
import {
  INITIAL_DESTINATIONS,
  INITIAL_ADVISORIES,
  INITIAL_PROMOTIONS
} from '../data/destinations';

export type PresetScenario = 'monsoon_surge' | 'khandala_landslide' | 'normal_balanced' | 'coastal_rush';

import { sessionManager } from '../lib/sessionManager';

// Default Citizen Guest User
export const DEFAULT_CITIZEN_USER: AuthUser = {
  id: 'CITIZEN-GUEST-01',
  name: 'Traveler Guest',
  role: 'tourist',
  designation: 'Eco-Corridor Explorer',
  department: 'EcoRoute Traveler Network',
  badgeNumber: 'ECO-GUEST',
  jurisdiction: null,
  isAuthenticated: false,
  homeCity: 'Mumbai',
  homeState: 'Maharashtra',
  travelStyleVector: [0.90, 0.70, 0.60, 0.85],
  interests: ['Waterfalls', 'Hill Treks', 'Scenic Routes', 'Heritage Forts']
};

export const INITIAL_CHECKINS: CheckIn[] = [
  {
    id: 'chk-01',
    spot_id: 'LON',
    spot_name: 'Lonavala & Khandala',
    rating: 5,
    user_label: 'Expressway Motorist',
    comment: 'Bumper-to-bumper queue extending 3km back from Khandala exit. Bhushi dam steps packed wall-to-wall.',
    timestamp: '15 mins ago',
    geofence_verified: true
  },
  {
    id: 'chk-02',
    spot_id: 'LON',
    spot_name: 'Lonavala & Khandala',
    rating: 4,
    user_label: 'Family Traveler',
    comment: 'Heavy monsoon drizzle and fog. Parking completely saturated near Tiger Leap.',
    timestamp: '42 mins ago',
    geofence_verified: true
  },
  {
    id: 'chk-03',
    spot_id: 'MAT',
    spot_name: 'Matheran Eco-Zone',
    rating: 2,
    user_label: 'Eco Walker',
    comment: 'Air is crisp and 100% clean. Zero engine fumes, lovely pony ride along Charlotte lake trail.',
    timestamp: '25 mins ago',
    geofence_verified: true
  },
  {
    id: 'chk-04',
    spot_id: 'ALB',
    spot_name: 'Alibaug Coastal Hub',
    rating: 5,
    user_label: 'Ferry Passenger',
    comment: 'Mandwa water terminal passenger turnaround delay at 75 mins. Long queue for auto-rickshaws.',
    timestamp: '30 mins ago',
    geofence_verified: true
  },
  {
    id: 'chk-05',
    spot_id: 'BHA',
    spot_name: 'Bhandardara Serene Haven',
    rating: 1,
    user_label: 'Nature Camper',
    comment: 'Tranquil Arthur lake with glass-like water. Barely 20 people around Umbrella Falls! Perfect escape.',
    timestamp: '1 hr ago',
    geofence_verified: true
  },
  {
    id: 'chk-06',
    spot_id: 'MAH',
    spot_name: 'Mahabaleshwar Plateau',
    rating: 5,
    user_label: 'Weekend Visitor',
    comment: 'Pasarni ghat has continuous crawl. Venna lake boating ticket counter line is over 45 minutes.',
    timestamp: '20 mins ago',
    geofence_verified: true
  },
  {
    id: 'chk-07',
    spot_id: 'TAP',
    spot_name: 'Tapola & Koyna Backwaters',
    rating: 1,
    user_label: 'Kayaker',
    comment: 'Scenic reservoir with zero congestion. Relaxing boat ride and fresh strawberries without the crowds.',
    timestamp: '2 hrs ago',
    geofence_verified: true
  }
];

export const INITIAL_TRIP_PLANS: TripPlan[] = [
  {
    id: 'trip-sah-101',
    user_id: 'CITIZEN-GUEST-01',
    destinations: ['BHA', 'MAT'],
    dates: {
      start: '2026-09-12',
      end: '2026-09-14'
    },
    budget_band: '₹₹',
    group_type: 'friends',
    itinerary: [
      {
        dayNumber: 1,
        date: '2026-09-12',
        destinationId: 'BHA',
        destinationName: 'Bhandardara Serene Haven',
        morningActivity: 'Early morning scenic drive via Igatpuri; sunrise stop at Wilson Dam.',
        afternoonActivity: 'Lakeside picnic and Arthur lake row-boating away from tourists.',
        eveningActivity: 'Firefly trail night walk & camp dinner by the water.',
        recommendedLodging: 'MTDC Resort Bhandardara (Verified Eco-Partner)',
        estimatedCrowdLevel: 'OPTIMAL',
        transitTip: 'Take NH-160 to avoid heavy Mumbai-Pune expressway choke.'
      },
      {
        dayNumber: 2,
        date: '2026-09-13',
        destinationId: 'MAT',
        destinationName: 'Matheran Eco-Zone',
        morningActivity: 'Drive to Dasturi park base; walk or pony ride up Charlotte lake.',
        afternoonActivity: 'Panoramic vistas from Echo Point and Louisa Point clifftops.',
        eveningActivity: 'Sunset at Panorama Point; heritage marketplace street dinner.',
        recommendedLodging: 'The Verandah in the Forest (Heritage Bungalow)',
        estimatedCrowdLevel: 'OPTIMAL',
        transitTip: 'Vehicles must park at Dasturi Point for zero-pollution zone.'
      }
    ],
    totalCo2SavedKg: 24.8,
    created_at: '2026-09-04T10:00:00Z'
  }
];

export const INITIAL_GREEN_PASSES: GreenPass[] = [
  {
    id: 'gp-pass-8821',
    user_id: 'CITIZEN-GUEST-01',
    trip_plan_id: 'trip-sah-101',
    original_spot_id: 'LON',
    original_spot_name: 'Lonavala & Khandala',
    twin_spot_id: 'BHA',
    twin_spot_name: 'Bhandardara Serene Haven',
    distance_delta_km: 82,
    co2_saved_kg: 18.5,
    geofence_verified: true,
    issued_at: '2026-09-04T10:15:00Z',
    code: 'GREEN-YATRA-BHA-25',
    status: 'active',
    discountPct: 25,
    operatorName: 'Sahyadri Rural Tourism Collective'
  }
];

interface CorridorStore {
  // Authentication & Stakeholder Identity
  currentUser: AuthUser;
  authModalOpen: boolean;
  authModalTargetRole: UserRole | null;
  setAuthModalOpen: (open: boolean, targetRole?: UserRole) => void;
  loginUser: (user: AuthUser, rememberMe?: boolean) => void;
  logoutUser: (roleToLogout?: UserRole) => void;
  updateUserProfile: (profile: Partial<AuthUser>) => void;

  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Navigation & Role
  role: UserRole;
  setRole: (role: UserRole) => void;
  requestRoleChange: (targetRole: UserRole) => void;
  
  // Destination Data
  destinations: Destination[];
  selectedDestinationId: string;
  setSelectedDestinationId: (id: string) => void;
  
  // Categories & Tourist User Filters
  categoryFilter: 'ALL' | DestinationCategory;
  setCategoryFilter: (cat: 'ALL' | DestinationCategory) => void;
  userPreferences: [number, number, number, number]; // [Scenic, Budget, Adventure, Family]
  setUserPreferences: (prefs: [number, number, number, number]) => void;
  togglePreferenceTag: (tag: 'scenic' | 'budget' | 'adventure' | 'family') => void;
  
  // Selected Time Slot
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;

  // Advisories
  advisories: Advisory[];
  broadcastAdvisory: (advisory: Omit<Advisory, 'id' | 'timestamp'>) => void;
  toggleAdvisoryActive: (id: string) => void;
  dismissAdvisory: (id: string) => void;
  
  // Service Provider Promotions
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  deletePromotion: (id: string) => void;
  
  // Live State Modifiers (Authority & Provider Controls)
  updateDestinationInflow: (id: string, inflow: number) => void;
  updateDestinationCapacity: (id: string, capacity: number) => void;
  updateDestinationWeather: (id: string, hazardScore: number) => void;
  updateDestinationHotelOccupancy: (id: string, occupancyPct: number) => void;
  updateDestinationParking: (id: string, parkingPct: number) => void;
  
  // Python Backend Pipeline Live Sync
  liveBackendStatus: 'idle' | 'syncing' | 'connected' | 'offline';
  fetchLiveBackendFeed: () => Promise<void>;

  // Reroute & Gamification Action
  rerouteToDestination: (id: string) => void;
  divertedTripsCount: number;
  totalCarbonSavedKg: number;
  lastRerouteNotice: string | null;
  clearRerouteNotice: () => void;
  
  // Community Check-ins (§3.1, §7)
  checkIns: CheckIn[];
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'timestamp'>) => void;

  // Saved Trip Plans & Green Passes (§4.4, §7)
  tripPlans: TripPlan[];
  addTripPlan: (plan: TripPlan) => void;
  deleteTripPlan: (id: string) => void;
  greenPasses: GreenPass[];
  addGreenPass: (pass: GreenPass) => void;
  redeemGreenPass: (code: string) => void;

  // Quick Simulation Scenarios
  activeScenario: PresetScenario;
  applyPresetScenario: (scenario: PresetScenario) => void;
  resetToDefault: () => void;

  // Regional Demand Flows (O-D Matrix)
  demandFlows: DemandFlow[];
  fetchDemandFlows: () => Promise<void>;

  // Authority Real-Backend Operations
  revokeAdvisory: (advisoryId: string) => Promise<{ success: boolean; message?: string }>;
  extendAdvisory: (advisoryId: string, newExpiresAt: string) => Promise<{ success: boolean; message?: string }>;
  overrideCapacity: (spotId: string, overrideCap: number, reason?: string) => Promise<{ success: boolean; message?: string }>;
  runPolicySimulation: (spotId: string, proposedCap: number) => Promise<PolicySimulationResult | null>;
}

// Load persisted user or default based on active role session
const getSavedUser = (): AuthUser => {
  try {
    const activeRole = sessionManager.getActiveRole();
    const session = sessionManager.getSession(activeRole);
    if (session && session.user) return session.user;

    const saved = localStorage.getItem('ecoroute_auth_user');
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return DEFAULT_CITIZEN_USER;
};

export const useCorridorStore = create<CorridorStore>((set, get) => ({
  currentUser: getSavedUser(),
  authModalOpen: false,
  authModalTargetRole: null,

  setAuthModalOpen: (open, targetRole) => set({ 
    authModalOpen: open, 
    authModalTargetRole: targetRole || null 
  }),

  loginUser: (user, rememberMe = true) => {
    // Create and persist an isolated session for this role
    sessionManager.createSession(user.role, user, rememberMe);
    try {
      localStorage.setItem('ecoroute_auth_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    set({
      currentUser: user,
      role: user.role,
      authModalOpen: false,
      authModalTargetRole: null
    });
  },

  logoutUser: (roleToLogout?: UserRole) => {
    const targetRole = roleToLogout || get().currentUser.role;
    sessionManager.clearSession(targetRole);

    // If logged out current active role, fallback to tourist or guest
    const touristSession = sessionManager.getSession('tourist');
    const fallbackUser = touristSession ? touristSession.user : DEFAULT_CITIZEN_USER;

    try {
      localStorage.removeItem('ecoroute_auth_user');
    } catch {
      // ignore
    }
    set({
      currentUser: fallbackUser,
      role: touristSession ? 'tourist' : 'tourist'
    });
  },

  updateUserProfile: (profile) => {
    const updated = { ...get().currentUser, ...profile };
    sessionManager.createSession(updated.role, updated);
    try {
      localStorage.setItem('ecoroute_auth_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ currentUser: updated });
  },

  checkIns: INITIAL_CHECKINS,
  addCheckIn: (checkInData) => {
    const newCheckIn: CheckIn = {
      ...checkInData,
      id: `chk-${Date.now()}`,
      timestamp: 'Just now'
    };
    set({ checkIns: [newCheckIn, ...get().checkIns] });
  },

  tripPlans: INITIAL_TRIP_PLANS,
  addTripPlan: (plan) => {
    set({ tripPlans: [plan, ...get().tripPlans] });
  },
  deleteTripPlan: (id) => {
    set({ tripPlans: get().tripPlans.filter(p => p.id !== id) });
  },

  greenPasses: INITIAL_GREEN_PASSES,
  addGreenPass: (pass) => {
    set({ greenPasses: [pass, ...get().greenPasses] });
  },
  redeemGreenPass: (code) => {
    set({
      greenPasses: get().greenPasses.map(p =>
        p.code === code ? { ...p, status: 'redeemed' } : p
      )
    });
  },

  language: 'en',
  setLanguage: (language) => set({ language }),

  role: getSavedUser().role,
  setRole: (role) => set({ role }),

  requestRoleChange: (targetRole) => {
    const { currentUser } = get();
    // If target is tourist / citizen or developer portal, always allow
    if (targetRole === 'tourist' || targetRole === 'developer') {
      set({ role: targetRole });
      return;
    }
    // If user already authenticated for this role, allow
    if (currentUser.role === targetRole && currentUser.isAuthenticated) {
      set({ role: targetRole });
      return;
    }
    // Otherwise, open auth modal requesting login for target role
    set({
      authModalOpen: true,
      authModalTargetRole: targetRole
    });
  },
  
  destinations: INITIAL_DESTINATIONS,
  selectedDestinationId: 'LON', // Default to overloaded Lonavala hotspot
  setSelectedDestinationId: (id) => set({ selectedDestinationId: id }),
  
  categoryFilter: 'ALL',
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  
  userPreferences: [0.90, 0.70, 0.60, 0.85],
  setUserPreferences: (prefs) => set({ userPreferences: prefs }),
  togglePreferenceTag: (tag) => {
    const current = [...get().userPreferences] as [number, number, number, number];
    const map = { scenic: 0, budget: 1, adventure: 2, family: 3 };
    const idx = map[tag];
    current[idx] = current[idx] >= 0.7 ? 0.35 : 0.95;
    set({ userPreferences: current });
  },

  selectedTimeSlot: '07:00 AM',
  setSelectedTimeSlot: (selectedTimeSlot) => set({ selectedTimeSlot }),

  liveBackendStatus: 'idle',
  fetchLiveBackendFeed: async () => {
    set({ liveBackendStatus: 'syncing' });
    try {
      const response = await fetch('http://127.0.0.1:8000/api/destinations/live', { signal: AbortSignal.timeout(6000) });
      if (!response.ok) throw new Error('Backend HTTP error');
      const data = await response.json();
      
      if (data && data.destinations && Array.isArray(data.destinations)) {
        const updatedDestinations = get().destinations.map(d => {
          const live = data.destinations.find((ld: { id: string; current_inflow: number; weather_hazard_score: number }) => ld.id === d.id);
          if (live) {
            return {
              ...d,
              currentInflow: live.current_inflow,
              weatherHazardScore: live.weather_hazard_score
            };
          }
          return d;
        });
        set({
          destinations: updatedDestinations,
          liveBackendStatus: 'connected'
        });
      }

      // Also sync active official advisories from backend gazette
      try {
        const advRes = await fetch('http://127.0.0.1:8000/api/advisories', { signal: AbortSignal.timeout(5000) });
        if (advRes.ok) {
          const advData = await advRes.json();
          if (advData && Array.isArray(advData.advisories) && advData.advisories.length > 0) {
            const mappedAdvisories: Advisory[] = advData.advisories.map((a: {
              id: string;
              destination_id: string;
              destination_name: string;
              severity: 'low' | 'medium' | 'high' | 'critical';
              title: string;
              message: string;
              author: string;
              active: number;
              created_at: string;
            }) => ({
              id: a.id,
              destinationId: a.destination_id,
              destinationName: a.destination_name,
              severity: a.severity,
              title: a.title,
              message: a.message,
              author: a.author,
              active: Boolean(a.active),
              expiresAt: (a as any).expires_at,
              revokedAt: (a as any).revoked_at,
              timestamp: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            set({ advisories: mappedAdvisories });
          }
        }
      } catch {
        // Keep existing initial advisories on network error
      }
    } catch {
      set({ liveBackendStatus: 'offline' });
    }
  },
  
  advisories: INITIAL_ADVISORIES,
  broadcastAdvisory: (advisoryData) => {
    const newAdvisory: Advisory = {
      ...advisoryData,
      id: `adv-${Date.now()}`,
      timestamp: 'Just now'
    };
    
    const updatedDestinations = get().destinations.map(dest => {
      if (advisoryData.destinationId === 'ALL' || dest.id === advisoryData.destinationId) {
        return {
          ...dest,
          activeAdvisory: `${advisoryData.title}: ${advisoryData.message}`
        };
      }
      return dest;
    });
    
    set({
      advisories: [newAdvisory, ...get().advisories],
      destinations: updatedDestinations
    });
  },
  
  toggleAdvisoryActive: (id) => {
    set({
      advisories: get().advisories.map(adv =>
        adv.id === id ? { ...adv, active: !adv.active } : adv
      )
    });
  },
  
  dismissAdvisory: (id) => {
    const targetAdv = get().advisories.find(a => a.id === id);
    const updatedAdvisories = get().advisories.filter(adv => adv.id !== id);
    
    const updatedDestinations = get().destinations.map(dest => {
      if (targetAdv && (targetAdv.destinationId === 'ALL' || dest.id === targetAdv.destinationId)) {
        return { ...dest, activeAdvisory: undefined };
      }
      return dest;
    });
    
    set({
      advisories: updatedAdvisories,
      destinations: updatedDestinations
    });
  },
  
  promotions: INITIAL_PROMOTIONS,
  addPromotion: (promoData) => {
    const newPromo: Promotion = {
      ...promoData,
      id: `prm-${Date.now()}`
    };
    set({
      promotions: [newPromo, ...get().promotions]
    });
  },
  
  deletePromotion: (id) => {
    set({
      promotions: get().promotions.filter(p => p.id !== id)
    });
  },
  
  updateDestinationInflow: (id, inflow) => {
    set({
      destinations: get().destinations.map(dest =>
        dest.id === id ? { ...dest, currentInflow: Math.max(0, inflow) } : dest
      )
    });
  },
  
  updateDestinationCapacity: (id, capacity) => {
    set({
      destinations: get().destinations.map(dest =>
        dest.id === id ? { ...dest, physicalCapacity: Math.max(100, capacity) } : dest
      )
    });
  },
  
  updateDestinationWeather: (id, hazardScore) => {
    set({
      destinations: get().destinations.map(dest =>
        dest.id === id ? { ...dest, weatherHazardScore: Math.min(1, Math.max(0, hazardScore)) } : dest
      )
    });
  },
  
  updateDestinationHotelOccupancy: (id, occupancyPct) => {
    set({
      destinations: get().destinations.map(dest => {
        if (dest.id === id) {
          const parkingStress = Math.min(100, Math.round(occupancyPct * 0.95));
          return {
            ...dest,
            hotelOccupancyPct: occupancyPct,
            localPressure: {
              ...dest.localPressure,
              parkingSaturationPct: parkingStress
            }
          };
        }
        return dest;
      })
    });
  },
  
  updateDestinationParking: (id, parkingPct) => {
    set({
      destinations: get().destinations.map(dest =>
        dest.id === id ? {
          ...dest,
          localPressure: {
            ...dest.localPressure,
            parkingSaturationPct: parkingPct
          }
        } : dest
      )
    });
  },
  
  divertedTripsCount: 1420,
  totalCarbonSavedKg: 8520,
  lastRerouteNotice: null,
  
  rerouteToDestination: (newDestId) => {
    const newSelected = get().destinations.find(d => d.id === newDestId);
    
    if (newSelected) {
      set({
        selectedDestinationId: newDestId,
        divertedTripsCount: get().divertedTripsCount + 1,
        totalCarbonSavedKg: get().totalCarbonSavedKg + 18.5,
        lastRerouteNotice: `Successfully rerouted to ${newSelected.name}! You saved ~18.5 kg CO2 and bypassed an estimated delay.`
      });
    }
  },
  
  clearRerouteNotice: () => set({ lastRerouteNotice: null }),
  
  activeScenario: 'monsoon_surge',
  
  applyPresetScenario: (scenario) => {
    if (scenario === 'monsoon_surge') {
      set({
        activeScenario: scenario,
        destinations: INITIAL_DESTINATIONS,
        selectedDestinationId: 'LON'
      });
    } else if (scenario === 'khandala_landslide') {
      const modified = INITIAL_DESTINATIONS.map(d => {
        if (d.id === 'LON') {
          return {
            ...d,
            weatherHazardScore: 0.85,
            currentInflow: 13500,
            activeAdvisory: 'EMERGENCY: Heavy rockfall near Khandala tunnel. Expressway restricted to 1 lane.'
          };
        }
        if (d.id === 'MAH') {
          return {
            ...d,
            weatherHazardScore: 0.70,
            activeAdvisory: 'Landslide watch active on Mahad-Poladpur ghat connector.'
          };
        }
        return d;
      });
      set({
        activeScenario: scenario,
        destinations: modified,
        selectedDestinationId: 'LON'
      });
    } else if (scenario === 'normal_balanced') {
      const modified = INITIAL_DESTINATIONS.map(d => ({
        ...d,
        currentInflow: Math.round(d.physicalCapacity * 0.55),
        weatherHazardScore: 0.05,
        hotelOccupancyPct: 50,
        activeAdvisory: undefined,
        localPressure: {
          parkingSaturationPct: 45,
          waterStressIndex: 0.3,
          municipalWasteAlert: false
        }
      }));
      set({
        activeScenario: scenario,
        destinations: modified,
        selectedDestinationId: 'LON'
      });
    } else if (scenario === 'coastal_rush') {
      const modified = INITIAL_DESTINATIONS.map(d => {
        if (d.id === 'ALB') {
          return {
            ...d,
            currentInflow: 10500,
            physicalCapacity: 8000,
            weatherHazardScore: 0.25,
            hotelOccupancyPct: 98,
            activeAdvisory: 'CRITICAL: Varsoli & Nagaon beaches at maximum carrying limit.'
          };
        }
        return d;
      });
      set({
        activeScenario: scenario,
        destinations: modified,
        selectedDestinationId: 'ALB'
      });
    }
  },
  
  demandFlows: [],
  fetchDemandFlows: async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/demand-flows');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.demand_flows)) {
          set({ demandFlows: data.demand_flows });
        }
      }
    } catch {
      // ignore
    }
  },

  revokeAdvisory: async (advisoryId: string) => {
    const { currentUser, advisories } = get();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/advisories/${advisoryId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to revoke advisory' };
      }
      set({
        advisories: advisories.map(a => a.id === advisoryId ? { ...a, active: false, revokedAt: data.revoked_at } : a)
      });
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  },

  extendAdvisory: async (advisoryId: string, newExpiresAt: string) => {
    const { currentUser, advisories } = get();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/advisories/${advisoryId}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, new_expires_at: newExpiresAt })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to extend advisory' };
      }
      set({
        advisories: advisories.map(a => a.id === advisoryId ? { ...a, active: true, expiresAt: newExpiresAt } : a)
      });
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  },

  overrideCapacity: async (spotId: string, overrideCap: number, reason: string = 'Emergency Administrative Action') => {
    const { currentUser, destinations } = get();
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/destinations/${spotId}/capacity-override`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, override_capacity: overrideCap, reason })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to apply capacity override' };
      }
      set({
        destinations: destinations.map(d => d.id === spotId ? { ...d, physicalCapacity: overrideCap } : d)
      });
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  },

  runPolicySimulation: async (spotId: string, proposedCap: number) => {
    const { currentUser } = get();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/policy-simulator/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, target_spot_id: spotId, proposed_cap: proposedCap })
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || 'Simulation error');
    } catch (e: any) {
      throw e;
    }
  },

  resetToDefault: () => {
    set({
      destinations: INITIAL_DESTINATIONS,
      advisories: INITIAL_ADVISORIES,
      promotions: INITIAL_PROMOTIONS,
      selectedDestinationId: 'LON',
      activeScenario: 'monsoon_surge',
      liveBackendStatus: 'idle'
    });
  }
}));
