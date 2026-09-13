import type { StateCreator } from 'zustand';
import type { CorridorStore } from '../useCorridorStore';
import type { Destination, Promotion, DemandFlow } from '../../types';
import type { Language } from '../../lib/i18n';
import { INITIAL_DESTINATIONS, INITIAL_PROMOTIONS } from '../../data/destinations';
import { INITIAL_ADVISORIES } from './authoritySlice';
import { apiGet } from '../../lib/api';

export type PresetScenario = 'monsoon_surge' | 'khandala_landslide' | 'normal_balanced' | 'coastal_rush';

export interface GlobalSlice {
  language: Language;
  destinations: Destination[];
  selectedDestinationId: string;
  promotions: Promotion[];
  liveBackendStatus: 'idle' | 'syncing' | 'connected' | 'offline';
  activeScenario: PresetScenario;
  demandFlows: DemandFlow[];

  setLanguage: (lang: Language) => void;
  setSelectedDestinationId: (id: string) => void;
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  deletePromotion: (id: string) => void;
  updateDestinationInflow: (id: string, inflow: number) => void;
  updateDestinationCapacity: (id: string, capacity: number) => void;
  updateDestinationWeather: (id: string, hazardScore: number) => void;
  updateDestinationHotelOccupancy: (id: string, occupancyPct: number) => void;
  updateDestinationParking: (id: string, parkingPct: number) => void;
  fetchLiveBackendFeed: () => Promise<void>;
  applyPresetScenario: (scenario: PresetScenario) => void;
  resetToDefault: () => void;
  fetchDemandFlows: () => Promise<void>;
}

export const createGlobalSlice: StateCreator<CorridorStore, [], [], GlobalSlice> = (set, get) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),

  destinations: INITIAL_DESTINATIONS,
  selectedDestinationId: 'LON', // Default to overloaded Lonavala hotspot
  setSelectedDestinationId: (id) => set({ selectedDestinationId: id }),

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

  liveBackendStatus: 'idle',
  fetchLiveBackendFeed: async () => {
    set({ liveBackendStatus: 'syncing' });
    try {
      const data = await apiGet('/api/destinations/live', { timeoutMs: 6000 });
      
      if (data && data.destinations && Array.isArray(data.destinations)) {
        const updatedDestinations = get().destinations.map(d => {
          const live = data.destinations.find((ld: any) => ld.id === d.id);
          if (live) {
            const rawInflow = live.current_inflow ?? live.currentInflow;
            const liveInflow = typeof rawInflow === 'number' && Number.isFinite(rawInflow) ? rawInflow : d.currentInflow;
            const rawHazard = live.weather_hazard_score ?? live.weatherHazardScore ?? live.live_sensors?.weather?.hazard_score;
            const liveHazard = typeof rawHazard === 'number' && Number.isFinite(rawHazard) ? rawHazard : (d.weatherHazardScore ?? 0.15);
            return {
              ...d,
              currentInflow: liveInflow,
              weatherHazardScore: liveHazard
            };
          }
          return d;
        });
        set({
          destinations: updatedDestinations,
          liveBackendStatus: 'connected'
        });
      }

      // Sync advisories from AuthoritySlice if possible, handled by authority slice ideally 
      // but since it's here we can do it via get()
      try {
        const advData = await apiGet('/api/advisories', { timeoutMs: 5000 });
        if (advData && Array.isArray(advData.advisories) && advData.advisories.length > 0) {
          const mappedAdvisories = advData.advisories.map((a: any) => ({
            id: a.id,
            destinationId: a.destination_id,
            destinationName: a.destination_name,
            severity: a.severity,
            title: a.title,
            message: a.message,
            author: a.author,
            active: Boolean(a.active),
            expiresAt: a.expires_at,
            revokedAt: a.revoked_at,
            timestamp: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          set({ advisories: mappedAdvisories }); // Modifies AuthoritySlice state!
        }
      } catch {
        // Keep existing on network error
      }
    } catch {
      set({ liveBackendStatus: 'offline' });
    }
  },

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
      const data = await apiGet('/api/demand-flows');
      if (data && Array.isArray(data.demand_flows)) {
        set({ demandFlows: data.demand_flows });
      }
    } catch (error) {
      console.warn('Backend API error during fetchDemandFlows.', error);
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
});
