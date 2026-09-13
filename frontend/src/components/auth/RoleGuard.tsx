import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { sessionManager } from '../../lib/sessionManager';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { UserRole } from '../../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

/**
 * RoleGuard: Enforces real session-based access control.
 * Redirects unauthenticated users to the login page.
 * No auto-login of demo accounts.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentUser, loginUser } = useCorridorStore();
  const location = useLocation();

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

  // If user already authenticated for this role via store
  if (currentUser.role === targetRole && currentUser.isAuthenticated) {
    return children;
  }

  // Not authenticated — redirect to login page with return URL
  return <Navigate to={`/auth?role=${targetRole}&returnTo=${encodeURIComponent(location.pathname)}`} replace />;
};
