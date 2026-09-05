import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { UserRole } from '../../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

/**
 * RoleGuard: Enforces strict portal isolation.
 * If the current user does not hold an authorized role for the requested route namespace,
 * access is blocked outright and redirected to the Portal Selection screen.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentUser, setAuthModalOpen } = useCorridorStore();

  const hasAccess = 
    allowedRoles.includes(currentUser.role) && 
    (currentUser.role === 'tourist' || currentUser.isAuthenticated);

  if (!hasAccess) {
    // If user attempted to reach an authority or provider route without auth,
    // trigger auth modal for that role and redirect to the portal selection screen
    const targetRole = allowedRoles[0];
    if (targetRole === 'authority' || targetRole === 'provider') {
      setTimeout(() => {
        setAuthModalOpen(true, targetRole);
      }, 50);
    }
    return <Navigate to="/" replace />;
  }

  return children;
};
