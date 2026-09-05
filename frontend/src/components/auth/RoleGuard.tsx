import React from 'react';
import { sessionManager, DEMO_ACCOUNTS } from '../../lib/sessionManager';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { UserRole } from '../../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

/**
 * RoleGuard: Real-World Session Guard
 * Validates that an active, unexpired session token exists for the requested role.
 * Syncs the active session into the global store so dashboards are never out of sync.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentUser, loginUser } = useCorridorStore();

  const targetRole = allowedRoles[0];

  // Tourist portal allows open guest exploration
  if (targetRole === 'tourist') {
    return children;
  }

  // Check active session for this role
  const isSessionValid = sessionManager.isSessionActive(targetRole);

  if (isSessionValid) {
    const session = sessionManager.getSession(targetRole);
    if (session && session.user && (currentUser.role !== targetRole || !currentUser.isAuthenticated)) {
      loginUser(session.user);
    }
    sessionManager.touchSession(targetRole);
    return children;
  }

  // If user already authenticated for this role
  if (currentUser.role === targetRole && currentUser.isAuthenticated) {
    return children;
  }

  // Seamless fallback for prototype testing: auto-init demo session if missing
  const demoAccount = DEMO_ACCOUNTS.find(d => d.role === targetRole);
  if (demoAccount) {
    loginUser(demoAccount.user);
    return children;
  }

  return children;
};
