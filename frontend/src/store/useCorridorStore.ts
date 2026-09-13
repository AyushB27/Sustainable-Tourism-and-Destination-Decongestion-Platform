import { create } from 'zustand';
import type { AuthSlice } from './slices/authSlice';
import type { TouristSlice } from './slices/touristSlice';
import type { AuthoritySlice } from './slices/authoritySlice';
import type { GlobalSlice } from './slices/globalSlice';

import { createAuthSlice } from './slices/authSlice';
import { createTouristSlice } from './slices/touristSlice';
import { createAuthoritySlice } from './slices/authoritySlice';
import { createGlobalSlice } from './slices/globalSlice';

export type CorridorStore = AuthSlice & TouristSlice & AuthoritySlice & GlobalSlice;

export const useCorridorStore = create<CorridorStore>((set, get, api) => ({
  ...createAuthSlice(set, get, api),
  ...createTouristSlice(set, get, api),
  ...createAuthoritySlice(set, get, api),
  ...createGlobalSlice(set, get, api),
}));

export { DEFAULT_CITIZEN_USER } from './slices/authSlice';
export { INITIAL_CHECKINS, INITIAL_TRIP_PLANS, INITIAL_GREEN_PASSES } from './slices/touristSlice';
export type { PresetScenario } from './slices/globalSlice';
