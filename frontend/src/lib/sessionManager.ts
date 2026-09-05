import type { AuthUser, UserRole } from '../types';

export interface PortalSession {
  id: string;
  token: string;
  role: UserRole;
  user: AuthUser;
  loginTime: number;
  expiresAt: number; // epoch ms
  lastActivity: number;
  rememberMe: boolean;
  portalNamespace: 'tourist' | 'authority' | 'provider' | 'developer';
}

export interface DemoAccount {
  role: UserRole;
  email: string;
  password: string;
  user: AuthUser;
  label: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'tourist',
    email: 'aarav.traveler@gmail.com',
    password: 'traveler2026',
    label: 'Aarav Sharma',
    description: 'Eco-Tourist & Green Pass Holder',
    user: {
      id: 'USR-TOURIST-01',
      name: 'Aarav Sharma',
      role: 'tourist',
      designation: 'Verified Eco-Tourist',
      department: 'Sustainable Travel Community',
      badgeNumber: 'ECO-PASS-2026-77',
      isAuthenticated: true,
      homeCity: 'Mumbai',
      homeState: 'Maharashtra',
      travelStyleVector: [0.9, 0.7, 0.6, 0.85],
      interests: ['Waterfalls', 'Hill Treks', 'Heritage Forts', 'Local Food']
    }
  },
  {
    role: 'authority',
    email: 'patil.dm@ecoroute.ops',
    password: 'officer2026',
    label: 'Dr. Rajeshwar Patil',
    description: 'District Operations Chief • Pune',
    user: {
      id: 'AUTH-PUNE-01',
      name: 'Dr. Rajeshwar Patil',
      role: 'authority',
      designation: 'District Operations Chief',
      department: 'Disaster Management & Corridor Cell',
      badgeNumber: 'OPS-MH-2026-94',
      jurisdiction: {
        type: 'state',
        value: 'Western Ghats Corridor'
      },
      isAuthenticated: true
    }
  },
  {
    role: 'provider',
    email: 'contact@matheran-homestays.com',
    password: 'partner2026',
    label: 'Matheran Eco-Resort',
    description: 'Hospitality Partner • Matheran',
    user: {
      id: 'PROV-MATHERAN-01',
      name: 'Matheran Eco-Resort & Homestays',
      role: 'provider',
      designation: 'Verified Hospitality Operator',
      department: 'Eco-Tourism Hospitality Network',
      badgeNumber: 'ACC-2026-883',
      isAuthenticated: true
    }
  },
  {
    role: 'developer',
    email: 'dev@ecoroute.internal',
    password: 'dev2026',
    label: 'Lead Systems Engineer',
    description: 'Corridor Telemetry & Diagnostics',
    user: {
      id: 'DEV-LEAD-01',
      name: 'Corridor Systems Engineer',
      role: 'developer',
      designation: 'Telemetry & Pipeline Architect',
      department: 'Infrastructure Diagnostics',
      badgeNumber: 'DEV-ROOT-2026',
      isAuthenticated: true
    }
  }
];

const SESSION_PREFIX = 'ecoroute_session_';
const ACTIVE_ROLE_KEY = 'ecoroute_active_portal_role';

// Generate a realistic mock JWT bearer token
const generateMockToken = (userId: string, role: UserRole): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    role,
    iss: 'https://api.ecoroute.app',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7 // 7 days
  }));
  const signature = btoa(`sig_${userId}_${Date.now()}`).substring(0, 24);
  return `${header}.${payload}.${signature}`;
};

export const sessionManager = {
  /**
   * Create a new session for a specific role and persist to localStorage
   */
  createSession: (role: UserRole, user: AuthUser, rememberMe = true): PortalSession => {
    const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const now = Date.now();
    const session: PortalSession = {
      id: `sess_${role}_${now}`,
      token: generateMockToken(user.id, role),
      role,
      user: { ...user, isAuthenticated: true },
      loginTime: now,
      expiresAt: now + durationMs,
      lastActivity: now,
      rememberMe,
      portalNamespace: role === 'authority' ? 'authority' : role === 'provider' ? 'provider' : role === 'developer' ? 'developer' : 'tourist'
    };

    try {
      localStorage.setItem(`${SESSION_PREFIX}${role}`, JSON.stringify(session));
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    } catch {
      // Storage error fallback
    }

    return session;
  },

  /**
   * Retrieve the active session for a specific role
   */
  getSession: (role: UserRole): PortalSession | null => {
    try {
      const raw = localStorage.getItem(`${SESSION_PREFIX}${role}`);
      if (!raw) return null;
      const session: PortalSession = JSON.parse(raw);

      // Check if session has expired
      if (Date.now() > session.expiresAt) {
        sessionManager.clearSession(role);
        return null;
      }

      return session;
    } catch {
      return null;
    }
  },

  /**
   * Verify if a role has an active, valid session
   */
  isSessionActive: (role: UserRole): boolean => {
    const session = sessionManager.getSession(role);
    return session !== null && session.user.isAuthenticated;
  },

  /**
   * Update the last activity timestamp for an active session
   */
  touchSession: (role: UserRole): void => {
    const session = sessionManager.getSession(role);
    if (!session) return;
    session.lastActivity = Date.now();
    try {
      localStorage.setItem(`${SESSION_PREFIX}${role}`, JSON.stringify(session));
    } catch {
      // ignore
    }
  },

  /**
   * Clear session for a specific role
   */
  clearSession: (role: UserRole): void => {
    try {
      localStorage.removeItem(`${SESSION_PREFIX}${role}`);
      if (localStorage.getItem(ACTIVE_ROLE_KEY) === role) {
        localStorage.removeItem(ACTIVE_ROLE_KEY);
      }
    } catch {
      // ignore
    }
  },

  /**
   * Clear all sessions across all dashboard types
   */
  clearAllSessions: () => {
    const roles: UserRole[] = ['tourist', 'authority', 'provider', 'developer'];
    roles.forEach(role => {
      try {
        localStorage.removeItem(`${SESSION_PREFIX}${role}`);
      } catch {
        // ignore
      }
    });
    try {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Get all active sessions currently alive in localStorage
   */
  getAllActiveSessions: (): Partial<Record<UserRole, PortalSession>> => {
    const roles: UserRole[] = ['tourist', 'authority', 'provider', 'developer'];
    const active: Partial<Record<UserRole, PortalSession>> = {};
    roles.forEach(role => {
      const sess = sessionManager.getSession(role);
      if (sess) active[role] = sess;
    });
    return active;
  },

  /**
   * Get currently active role
   */
  getActiveRole: (): UserRole => {
    try {
      const saved = localStorage.getItem(ACTIVE_ROLE_KEY);
      if (saved && ['tourist', 'authority', 'provider', 'developer'].includes(saved)) {
        return saved as UserRole;
      }
    } catch {
      // ignore
    }
    return 'tourist';
  },

  /**
   * Set currently active role
   */
  setActiveRole: (role: UserRole): void => {
    try {
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    } catch {
      // ignore
    }
  }
};
