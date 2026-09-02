import { create } from 'zustand';
import type {
  Destination,
  UserRole,
  Advisory,
  Promotion,
  DestinationCategory,
} from '../types';
import type { Language } from '../lib/i18n';
import {
  INITIAL_DESTINATIONS,
  INITIAL_ADVISORIES,
  INITIAL_PROMOTIONS
} from '../data/destinations';

export type PresetScenario = 'monsoon_surge' | 'khandala_landslide' | 'normal_balanced' | 'coastal_rush';

interface CorridorStore {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Navigation & Role
  role: UserRole;
  setRole: (role: UserRole) => void;
  
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
}

export const useCorridorStore = create<CorridorStore>((set, get) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),

  role: 'tourist',
  setRole: (role) => set({ role }),
  
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
