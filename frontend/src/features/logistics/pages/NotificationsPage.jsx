import React, { useState } from 'react';
import { Bell, CheckCheck, Package, CreditCard, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { LogisticsLayout } from '../components/LogisticsLayout.jsx';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'PAYMENT',
      title: 'Payment Credited to Escrow',
      message: '₹14,200 for Trip TR-KSF001 has been deposited into Escrow. Release upon Delivery OTP.',
      time: '15 mins ago',
      unread: true,
      icon: CreditCard,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 2,
      type: 'LOAD',
      title: 'New High Payout Load Available',
      message: 'Suryoday FPO posted an 8 Ton Potato consignment from Varanasi to Lucknow (₹18,500).',
      time: '1 hour ago',
      unread: true,
      icon: Package,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      id: 3,
      type: 'MAINTENANCE',
      title: 'Periodic Maintenance Due',
      message: 'Vehicle UP65XX1234 has logged 48,900 km. Scheduled 50,000 km oil service due.',
      time: '3 hours ago',
      unread: false,
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      id: 4,
      type: 'ROUTE',
      title: 'NH 731 Highway Clearance',
      message: 'Jaunpur bypass traffic clearance completed. Travel time reduced by 20 minutes.',
      time: 'Yesterday',
      unread: false,
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700',
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">Operational Alerts & Notifications</h1>
              <p className="text-xs text-stone-500">Live system updates, load matching notifications, and Escrow clearing alerts</p>
            </div>
          </div>
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs divide-y divide-stone-100 overflow-hidden">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition-colors ${
                  n.unread ? 'bg-emerald-50/30' : 'hover:bg-stone-50/60'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${n.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900">{n.title}</h4>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
                {n.unread && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </LogisticsLayout>
  );
}

export default NotificationsPage;
