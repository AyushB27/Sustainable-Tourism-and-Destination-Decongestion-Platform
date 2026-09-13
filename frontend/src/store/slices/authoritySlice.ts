import type { StateCreator } from 'zustand';
import type { CorridorStore } from '../useCorridorStore';
import type { Advisory, PolicySimulationResult } from '../../types';
import { apiPost, apiPut } from '../../lib/api';

export const INITIAL_ADVISORIES: Advisory[] = [
  {
    id: 'adv-01',
    destinationId: 'LON',
    destinationName: 'Lonavala & Khandala',
    severity: 'critical',
    title: 'Expressway Diversion Active',
    message: 'Khandala Ghat section is experiencing >45 min delays. Traffic police diverting light vehicles via Khopoli internal route.',
    author: 'State Highway Patrol',
    active: true,
    timestamp: '10 mins ago',
    expiresAt: new Date(Date.now() + 7200000).toISOString() // +2 hours
  },
  {
    id: 'adv-02',
    destinationId: 'ALB',
    destinationName: 'Alibaug Coastal Hub',
    severity: 'high',
    title: 'Ro-Ro Ferry Capacity Warning',
    message: 'Mandwa terminal parking is at 98% capacity. Walk-on passengers only for the next 3 departures.',
    author: 'Maritime Board',
    active: true,
    timestamp: '1 hr ago',
    expiresAt: new Date(Date.now() + 14400000).toISOString() // +4 hours
  }
];

export interface AuthoritySlice {
  advisories: Advisory[];
  divertedTripsCount: number;
  totalCarbonSavedKg: number;
  lastRerouteNotice: string | null;

  broadcastAdvisory: (advisory: Omit<Advisory, 'id' | 'timestamp'>) => void;
  toggleAdvisoryActive: (id: string) => void;
  dismissAdvisory: (id: string) => void;
  revokeAdvisory: (advisoryId: string) => Promise<{ success: boolean; message?: string }>;
  extendAdvisory: (advisoryId: string, newExpiresAt: string) => Promise<{ success: boolean; message?: string }>;
  overrideCapacity: (spotId: string, overrideCap: number, reason?: string) => Promise<{ success: boolean; message?: string }>;
  runPolicySimulation: (spotId: string, proposedCap: number) => Promise<PolicySimulationResult | null>;
  rerouteToDestination: (id: string) => void;
  clearRerouteNotice: () => void;
}

export const createAuthoritySlice: StateCreator<CorridorStore, [], [], AuthoritySlice> = (set, get) => ({
  advisories: INITIAL_ADVISORIES,
  divertedTripsCount: 1420,
  totalCarbonSavedKg: 8520,
  lastRerouteNotice: null,

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

  revokeAdvisory: async (advisoryId) => {
    const { currentUser, advisories } = get();
    try {
      const data = await apiPost(`/api/advisories/${advisoryId}/revoke`, { user: currentUser });
      set({
        advisories: advisories.map(a => a.id === advisoryId ? { ...a, active: false, revokedAt: data.revoked_at } : a)
      });
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  },

  extendAdvisory: async (advisoryId, newExpiresAt) => {
    const { currentUser, advisories } = get();
    try {
      const data = await apiPost(`/api/advisories/${advisoryId}/extend`, { user: currentUser, new_expires_at: newExpiresAt });
      set({
        advisories: advisories.map(a => a.id === advisoryId ? { ...a, active: true, expiresAt: newExpiresAt } : a)
      });
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  },

  overrideCapacity: async (spotId, overrideCap, reason = 'Emergency Administrative Action') => {
    const { currentUser, destinations } = get();
    try {
      const data = await apiPut(`/api/destinations/${spotId}/capacity-override`, { user: currentUser, override_capacity: overrideCap, reason });
      set({
        destinations: destinations.map(d => d.id === spotId ? { ...d, physicalCapacity: overrideCap } : d)
      });
      return { success: true, message: data.message };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error' };
    }
  },

  runPolicySimulation: async (spotId, proposedCap) => {
    const { currentUser } = get();
    try {
      return await apiPost('/api/policy-simulator/simulate', { user: currentUser, target_spot_id: spotId, proposed_cap: proposedCap });
    } catch (e: any) {
      throw e;
    }
  },

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
  
  clearRerouteNotice: () => set({ lastRerouteNotice: null })
});
