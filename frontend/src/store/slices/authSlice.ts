import type { StateCreator } from 'zustand';
import type { AuthUser, UserRole } from '../../types';
import { sessionManager } from '../../lib/sessionManager';

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

export interface AuthSlice {
  currentUser: AuthUser;
  authModalOpen: boolean;
  authModalTargetRole: UserRole | null;
  role: UserRole;
  
  setAuthModalOpen: (open: boolean, targetRole?: UserRole) => void;
  loginUser: (user: AuthUser, rememberMe?: boolean) => void;
  logoutUser: (roleToLogout?: UserRole) => void;
  updateUserProfile: (profile: Partial<AuthUser>) => void;
  setRole: (role: UserRole) => void;
  requestRoleChange: (targetRole: UserRole) => void;
}

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

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  currentUser: getSavedUser(),
  authModalOpen: false,
  authModalTargetRole: null,
  role: getSavedUser().role,

  setAuthModalOpen: (open, targetRole) => set({ 
    authModalOpen: open, 
    authModalTargetRole: targetRole || null 
  }),

  loginUser: (user, rememberMe = true) => {
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

  setRole: (role) => set({ role }),

  requestRoleChange: (targetRole) => {
    const { currentUser } = get();
    if (targetRole === 'tourist' || targetRole === 'developer') {
      set({ role: targetRole });
      return;
    }
    if (currentUser.role === targetRole && currentUser.isAuthenticated) {
      set({ role: targetRole });
      return;
    }
    set({
      authModalOpen: true,
      authModalTargetRole: targetRole
    });
  }
});
