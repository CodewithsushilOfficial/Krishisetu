import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout.jsx';
import { LOGISTICS_NAV_ITEMS } from '../../../components/layout/DashboardSidebar.jsx';

export { LOGISTICS_NAV_ITEMS };

export function LogisticsLayout({ title, subtitle, headerExtra, children }) {
  return (
    <DashboardLayout
      role="LOGISTICS"
      title={title}
      subtitle={subtitle}
      headerExtra={headerExtra}
      hideProfileCompletion={true}
    >
      {children}
    </DashboardLayout>
  );
}

export default LogisticsLayout;
