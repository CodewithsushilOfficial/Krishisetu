import React, { useState, useEffect } from 'react';
import FpoLayout from '../components/FpoLayout.jsx';
import fpoService from '../services/fpoService.js';
import { UserCheck, UserPlus, Shield, Mail, Phone, X, CheckCircle2, AlertCircle } from 'lucide-react';

export function FpoStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'FPO_FIELD_OFFICER',
  });

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await fpoService.getStaff();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setStaff(list);
    } catch (err) {
      console.error('Failed to load staff list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleInviteStaff = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage('');
      await fpoService.inviteStaff(formData);
      setMessage('Staff member invited successfully!');
      setShowModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'FPO_FIELD_OFFICER',
      });
      await loadStaff();
    } catch (err) {
      alert('Failed to invite staff: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'FPO_MANAGER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Operations Manager</span>;
      case 'FPO_ACCOUNTANT':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">Accountant</span>;
      case 'FPO_PROCUREMENT_MANAGER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Procurement Head</span>;
      case 'FPO_LOGISTICS_MANAGER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Logistics Manager</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">Field Officer</span>;
    }
  };

  return (
    <FpoLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                FPO Staff & Role-Based Access Control (RBAC)
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Manage internal operational staff, assign administrative privileges, and monitor delegation audit logs.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#107c41] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Team Member</span>
          </button>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Staff Table */}
        <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs">
          {loading ? (
            <div className="p-10 text-center text-stone-400 text-xs">Loading staff directory...</div>
          ) : staff.length === 0 ? (
            <div className="p-10 text-center text-stone-400 text-xs">No staff members enrolled.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#f8faf9] text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200/80">
                  <tr>
                    <th className="py-3 px-4">Team Member</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {staff.map((member) => (
                    <tr key={member.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {member.user?.fullName || member.fullName || 'Staff Member'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-medium">
                        {member.user?.email || member.email || 'staff@suryodayfpo.org'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-mono">
                        {member.user?.phone || member.phone || '+91 9280000456'}
                      </td>
                      <td className="py-3.5 px-4">
                        {getRoleBadge(member.role)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-emerald-700" />
                  Invite Operational Staff Member
                </h3>
                <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleInviteStaff} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alok Verma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alok.verma@suryodayfpo.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 928000000457"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">Assigned Operational Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#f8faf9] border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  >
                    <option value="FPO_MANAGER">Operations Manager</option>
                    <option value="FPO_ACCOUNTANT">Accountant</option>
                    <option value="FPO_PROCUREMENT_MANAGER">Procurement Head</option>
                    <option value="FPO_LOGISTICS_MANAGER">Logistics Manager</option>
                    <option value="FPO_FIELD_OFFICER">Field Officer</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-[#107c41] hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {submitting ? 'Inviting...' : 'Send Access Invite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FpoLayout>
  );
}

export default FpoStaffPage;
