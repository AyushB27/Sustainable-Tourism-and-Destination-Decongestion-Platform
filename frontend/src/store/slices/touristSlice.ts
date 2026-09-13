import type { StateCreator } from 'zustand';
import type { CorridorStore } from '../useCorridorStore';
import type { CheckIn, TripPlan, GreenPass, DestinationCategory } from '../../types';
import { apiGet, apiPost, apiDelete } from '../../lib/api';

export const INITIAL_CHECKINS: CheckIn[] = [
  { id: 'chk-01', spot_id: 'LON', spot_name: 'Lonavala & Khandala', rating: 5, user_label: 'Expressway Motorist', comment: 'Bumper-to-bumper queue extending 3km back from Khandala exit. Bhushi dam steps packed wall-to-wall.', timestamp: '15 mins ago', geofence_verified: true },
  { id: 'chk-02', spot_id: 'LON', spot_name: 'Lonavala & Khandala', rating: 4, user_label: 'Family Traveler', comment: 'Heavy monsoon drizzle and fog. Parking completely saturated near Tiger Leap.', timestamp: '42 mins ago', geofence_verified: true },
  { id: 'chk-03', spot_id: 'MAT', spot_name: 'Matheran Eco-Zone', rating: 2, user_label: 'Eco Walker', comment: 'Air is crisp and 100% clean. Zero engine fumes, lovely pony ride along Charlotte lake trail.', timestamp: '25 mins ago', geofence_verified: true },
  { id: 'chk-04', spot_id: 'ALB', spot_name: 'Alibaug Coastal Hub', rating: 5, user_label: 'Ferry Passenger', comment: 'Mandwa water terminal passenger turnaround delay at 75 mins. Long queue for auto-rickshaws.', timestamp: '30 mins ago', geofence_verified: true },
  { id: 'chk-05', spot_id: 'BHA', spot_name: 'Bhandardara Serene Haven', rating: 1, user_label: 'Nature Camper', comment: 'Tranquil Arthur lake with glass-like water. Barely 20 people around Umbrella Falls! Perfect escape.', timestamp: '1 hr ago', geofence_verified: true },
  { id: 'chk-06', spot_id: 'MAH', spot_name: 'Mahabaleshwar Plateau', rating: 5, user_label: 'Weekend Visitor', comment: 'Pasarni ghat has continuous crawl. Venna lake boating ticket counter line is over 45 minutes.', timestamp: '20 mins ago', geofence_verified: true },
  { id: 'chk-07', spot_id: 'TAP', spot_name: 'Tapola & Koyna Backwaters', rating: 1, user_label: 'Kayaker', comment: 'Scenic reservoir with zero congestion. Relaxing boat ride and fresh strawberries without the crowds.', timestamp: '2 hrs ago', geofence_verified: true }
];

export const INITIAL_TRIP_PLANS: TripPlan[] = [
  {
    id: 'trip-sah-101',
    user_id: 'CITIZEN-GUEST-01',
    destinations: ['BHA', 'MAT'],
    dates: { start: '2026-09-12', end: '2026-09-14' },
    budget_band: '₹₹',
    group_type: 'friends',
    itinerary: [
      { dayNumber: 1, date: '2026-09-12', destinationId: 'BHA', destinationName: 'Bhandardara Serene Haven', morningActivity: 'Early morning scenic drive via Igatpuri; sunrise stop at Wilson Dam.', afternoonActivity: 'Lakeside picnic and Arthur lake row-boating away from tourists.', eveningActivity: 'Firefly trail night walk & camp dinner by the water.', recommendedLodging: 'MTDC Resort Bhandardara (Verified Eco-Partner)', estimatedCrowdLevel: 'OPTIMAL', transitTip: 'Take NH-160 to avoid heavy Mumbai-Pune expressway choke.' },
      { dayNumber: 2, date: '2026-09-13', destinationId: 'MAT', destinationName: 'Matheran Eco-Zone', morningActivity: 'Drive to Dasturi park base; walk or pony ride up Charlotte lake.', afternoonActivity: 'Panoramic vistas from Echo Point and Louisa Point clifftops.', eveningActivity: 'Sunset at Panorama Point; heritage marketplace street dinner.', recommendedLodging: 'The Verandah in the Forest (Heritage Bungalow)', estimatedCrowdLevel: 'OPTIMAL', transitTip: 'Vehicles must park at Dasturi Point for zero-pollution zone.' }
    ],
    totalCo2SavedKg: 24.8,
    created_at: '2026-09-04T10:00:00Z'
  }
];

export const INITIAL_GREEN_PASSES: GreenPass[] = [
  { id: 'gp-pass-8821', user_id: 'CITIZEN-GUEST-01', trip_plan_id: 'trip-sah-101', original_spot_id: 'LON', original_spot_name: 'Lonavala & Khandala', twin_spot_id: 'BHA', twin_spot_name: 'Bhandardara Serene Haven', distance_delta_km: 82, co2_saved_kg: 18.5, geofence_verified: true, issued_at: '2026-09-04T10:15:00Z', code: 'GREEN-YATRA-BHA-25', status: 'active', discountPct: 25, operatorName: 'Sahyadri Rural Tourism Collective' }
];

export interface TouristSlice {
  categoryFilter: 'ALL' | DestinationCategory;
  userPreferences: [number, number, number, number];
  selectedTimeSlot: string;
  checkIns: CheckIn[];
  tripPlans: TripPlan[];
  greenPasses: GreenPass[];
  
  setCategoryFilter: (cat: 'ALL' | DestinationCategory) => void;
  setUserPreferences: (prefs: [number, number, number, number]) => void;
  togglePreferenceTag: (tag: 'scenic' | 'budget' | 'adventure' | 'family') => void;
  setSelectedTimeSlot: (slot: string) => void;
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'timestamp'>) => void;
  addTripPlan: (plan: TripPlan) => void;
  saveTripPlan: (plan: TripPlan) => Promise<boolean>;
  fetchUserTrips: () => Promise<void>;
  deleteTripPlan: (id: string) => Promise<void>;
  addGreenPass: (pass: GreenPass) => void;
  redeemGreenPass: (code: string) => void;
}

export const createTouristSlice: StateCreator<CorridorStore, [], [], TouristSlice> = (set, get) => ({
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

  checkIns: INITIAL_CHECKINS,
  addCheckIn: (checkInData) => {
    const newCheckIn: CheckIn = {
      ...checkInData,
      id: `chk-${Date.now()}`,
      timestamp: 'Just now'
    };
    set({ checkIns: [newCheckIn, ...get().checkIns] });
  },

  tripPlans: (() => {
    try {
      const saved = localStorage.getItem('ecoroute_saved_trips');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TRIP_PLANS;
  })(),
  
  addTripPlan: (plan) => {
    const updated = [plan, ...get().tripPlans];
    set({ tripPlans: updated });
    try { localStorage.setItem('ecoroute_saved_trips', JSON.stringify(updated)); } catch {}
  },
  
  saveTripPlan: async (plan) => {
    const { currentUser } = get();
    const updated = [plan, ...get().tripPlans.filter(p => p.id !== plan.id)];
    set({ tripPlans: updated });
    try { localStorage.setItem('ecoroute_saved_trips', JSON.stringify(updated)); } catch {}

    try {
      await apiPost('/api/trips/save', {
        id: plan.id,
        user_id: currentUser.id || 'CITIZEN-GUEST-01',
        destination_id: plan.destinationId,
        destination_name: plan.destinationName,
        start_date: plan.startDate,
        duration_days: plan.days?.length || 2,
        travel_style: 'scenic',
        transport_mode: plan.transportMode || 'green_transit',
        accommodation_type: plan.accommodationType || 'homestay',
        total_carbon_kg: plan.carbonFootprintKg,
        carbon_avoided_kg: plan.carbonAvoidedKg || 38.5,
        environmental_score: plan.environmentalScore || 85,
        social_score: plan.socialScore || 80,
        economic_score: plan.economicScore || 90,
        overall_sustainability_score: plan.sustainabilityScore || 85,
        itinerary_days: plan.days || []
      });
      return true;
    } catch (error) {
      console.warn('Backend API error during saveTripPlan.', error);
      return true;
    }
  },
  
  fetchUserTrips: async () => {
    try {
      const { currentUser } = get();
      const res = await apiGet(`/api/trips?user_id=${currentUser.id || 'CITIZEN-GUEST-01'}`);
      if (res && res.trips && Array.isArray(res.trips) && res.trips.length > 0) {
        const mappedTrips: TripPlan[] = res.trips.map((t: any) => ({
          id: t.id,
          user_id: t.user_id || 'CITIZEN-GUEST-01',
          destinationId: t.destination_id,
          destinationName: t.destination_name,
          destinations: [t.destination_id],
          startDate: t.start_date,
          endDate: t.start_date,
          dates: { start: t.start_date, end: t.start_date },
          budget_band: '₹₹',
          budgetBand: '₹₹',
          group_type: 'family',
          groupType: 'family',
          carbonFootprintKg: t.total_carbon_kg,
          sustainabilityScore: t.overall_sustainability_score,
          carbonAvoidedKg: t.carbon_avoided_kg,
          totalCo2SavedKg: t.carbon_avoided_kg,
          environmentalScore: t.environmental_score,
          socialScore: t.social_score,
          economicScore: t.economic_score,
          transportMode: t.transport_mode,
          accommodationType: t.accommodation_type,
          itinerary: t.itinerary_days || [],
          days: t.itinerary_days || []
        }));
        set({ tripPlans: mappedTrips });
        try { localStorage.setItem('ecoroute_saved_trips', JSON.stringify(mappedTrips)); } catch {}
      }
    } catch (error) {
      console.warn('Backend API error during fetchUserTrips.', error);
    }
  },
  
  deleteTripPlan: async (id) => {
    const { currentUser } = get();
    const updated = get().tripPlans.filter(p => p.id !== id);
    set({ tripPlans: updated });
    try { localStorage.setItem('ecoroute_saved_trips', JSON.stringify(updated)); } catch {}
    try {
      await apiDelete(`/api/trips/${id}?user_id=${currentUser.id || 'CITIZEN-GUEST-01'}`);
    } catch (error) {
      console.warn('Backend API error during deleteTripPlan.', error);
    }
  },

  greenPasses: (() => {
    try {
      const stored = localStorage.getItem('ecoroute_green_passes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_GREEN_PASSES;
  })(),
  addGreenPass: (pass) => {
    const updated = [pass, ...get().greenPasses];
    set({ greenPasses: updated });
    try { localStorage.setItem('ecoroute_green_passes', JSON.stringify(updated)); } catch {}
  },
  redeemGreenPass: (code) => {
    const updated = get().greenPasses.map(p =>
      p.code === code ? { ...p, status: 'redeemed' as const } : p
    );
    set({ greenPasses: updated });
    try { localStorage.setItem('ecoroute_green_passes', JSON.stringify(updated)); } catch {}
  }
});
