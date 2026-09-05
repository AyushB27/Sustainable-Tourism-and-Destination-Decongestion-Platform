import { create } from 'zustand';
import type {
  Destination,
  UserRole,
  AuthUser,
  Advisory,
  Promotion,
  DestinationCategory,
  DemandFlow,
  PolicySimulationResult
} from '../types';
import type { Language } from '../lib/i18n';
import {
  INITIAL_DESTINATIONS,
  INITIAL_ADVISORIES,
  INITIAL_PROMOTIONS
} from '../data/destinations';

export type PresetScenario = 'monsoon_surge' | 'khandala_landslide' | 'normal_balanced' | 'coastal_rush';

// Default Citizen Guest User
export const DEFAULT_CITIZEN_USER: AuthUser = {
  id: 'CITIZEN-GUEST-01',
  name: 'Citizen Tourist (नागरिक)',
  role: 'tourist',
  designation: 'General Traveler / Eco-Pass Holder',
  department: 'National Tourism Citizen Gateway',
  badgeNumber: 'IND-YATRA-2026',
  jurisdiction: null,
  isAuthenticated: true
};

interface CorridorStore {
  // Authentication & Stakeholder Identity
  currentUser: AuthUser;
  authModalOpen: boolean;
  authModalTargetRole: UserRole | null;
  setAuthModalOpen: (open: boolean, targetRole?: UserRole) => void;
  loginUser: (user: AuthUser) => void;
  logoutUser: () => void;

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

// Load persisted user or default
const getSavedUser = (): AuthUser => {
  try {
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

  loginUser: (user) => {
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

  logoutUser: () => {
    try {
      localStorage.removeItem('ecoroute_auth_user');
    } catch {
      // ignore
    }
    set({
      currentUser: DEFAULT_CITIZEN_USER,
      role: 'tourist'
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
      const response = await fetch('http://127.0.0.1:8000/api/destinations/live', { signal: AbortSignal.timeout(3500) });
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
        const advRes = await fetch('http://127.0.0.1:8000/api/advisories', { signal: AbortSignal.timeout(2000) });
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
