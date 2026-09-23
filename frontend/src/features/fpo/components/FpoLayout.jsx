import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout.jsx';
import { FPO_NAV_ITEMS } from '../../../components/layout/DashboardSidebar.jsx';

export { FPO_NAV_ITEMS };

export function FpoLayout({ title, subtitle, headerExtra, children }) {
  return (
    <DashboardLayout
      role="FPO"
      title={title}
      subtitle={subtitle}
      headerExtra={headerExtra}
      hideProfileCompletion={true}
    >
      {children}
    </DashboardLayout>
  );
}

export default FpoLayout;
