import React from 'react';
import { Navigate } from 'react-router-dom';

/*
 * The role-selection step is now integrated into RegisterPage (Step 1).
 * This standalone page simply redirects to the unified registration flow.
 */
export function RoleSelectionPage() {
  return <Navigate to="/auth/register" replace />;
}

export default RoleSelectionPage;
