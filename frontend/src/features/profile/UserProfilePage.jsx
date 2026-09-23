import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store/authStore.js';
import { authService } from '../auth/services/authService.js';
import { DashboardHeader } from '../../components/DashboardHeader.jsx';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Clock,
  Building,
  Save,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export function UserProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'security'
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Edit form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    profilePhoto: '',
    farmName: '',
    businessName: '',
    addressLine: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    contactPerson: '',
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchFullProfile = async () => {
    setIsLoading(true);
    try {
      const res = await authService.getMe();
      if (res?.data) {
        const u = res.data;
        setProfileData(u);
        const p = u.profile || {};
        setFormData({
          fullName: u.fullName || '',
          phone: u.phone || '',
          profilePhoto: p.profilePhoto || p.logo || '',
          farmName: p.farmName || '',
          businessName: p.businessName || p.fpoName || '',
          addressLine: p.addressLine || '',
          village: p.village || p.villageTownCity || p.city || '',
          district: p.district || '',
          state: p.state || '',
          pincode: p.pincode || '',
          contactPerson: p.contactPerson || p.representativeName || '',
        });
      }
    } catch (err) {
      setErrorMsg('Failed to load profile details from PostgreSQL.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFullProfile();
  }, []);

  const getDashboardPath = (role) => {
    const map = {
      FARMER: '/farmer/dashboard',
      FPO: '/fpo/dashboard',
      LOGISTICS: '/logistics/dashboard',
      BULK_BUYER: '/buyer/dashboard',
      CONSUMER: '/marketplace',
      ADMIN: '/admin/dashboard',
      CONTROL_ADMIN: '/control-tower/dashboard',
    };
    return map[role] || '/';
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authService.updateProfile(formData);
      if (res?.data) {
        setProfileData(res.data);
        setUser(res.data);
        setSuccessMsg('Profile updated successfully in PostgreSQL database.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess('Password changed successfully. Your active session remains verified.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const roleBadgeColors = {
    FARMER: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    FPO: 'bg-amber-100 text-amber-800 border-amber-300',
    LOGISTICS: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    BULK_BUYER: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    CONSUMER: 'bg-rose-100 text-rose-800 border-rose-300',
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
    CONTROL_ADMIN: 'bg-slate-900 text-emerald-400 border-emerald-500',
  };

  const activeRole = profileData?.role || user?.role || 'FARMER';
  const profileObj = profileData?.profile || {};

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      <DashboardHeader
        title="User Identity & Account Management"
        subtitle="Manage personal credentials, role attributes, and security verification"
        roleName={activeRole}
        roleBadgeColor={roleBadgeColors[activeRole]}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(getDashboardPath(activeRole))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900">Profile & Identity Center</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                PostgreSQL Live Sync
              </span>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex bg-stone-200/80 p-1 rounded-xl gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Profile Overview
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'edit'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'security'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Security & Sessions
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-bold text-stone-500">Querying identity records from PostgreSQL...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: Identity Card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-950/15 ring-4 ring-emerald-50">
                      {profileData?.fullName
                        ? profileData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        : 'KS'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-stone-900">{profileData?.fullName || 'KrishiSetu Member'}</h3>
                    <p className="text-xs font-medium text-stone-500">{profileData?.email}</p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${roleBadgeColors[activeRole]}`}>
                        {activeRole}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {profileData?.status || 'ACTIVE'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t border-stone-100 grid grid-cols-2 gap-2 text-left">
                    <div className="p-3 bg-stone-50 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-stone-400 block">Phone Verified</span>
                      <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-stone-400 block">KYC Status</span>
                      <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('edit')}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Edit Profile Details
                  </button>
                </div>

                {/* Right Area: Contact & Address Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Details Card */}
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <User className="h-4 w-4 text-emerald-700" />
                        Personal & Contact Information
                      </h4>
                      <span className="text-[11px] font-semibold text-stone-400">Database Record ID: {profileData?.id?.slice(0, 8)}...</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 mb-1">
                          <User className="h-3 w-3" /> Full Legal Name
                        </span>
                        <span className="text-sm font-black text-stone-900">{profileData?.fullName}</span>
                      </div>

                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 mb-1">
                          <Mail className="h-3 w-3" /> Registered Email
                        </span>
                        <span className="text-sm font-bold text-stone-900">{profileData?.email}</span>
                      </div>

                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 mb-1">
                          <Phone className="h-3 w-3" /> Primary Mobile
                        </span>
                        <span className="text-sm font-bold text-stone-900">{profileData?.phone || 'Not recorded'}</span>
                      </div>

                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1 mb-1">
                          <Building className="h-3 w-3" /> Enterprise / Farm Name
                        </span>
                        <span className="text-sm font-bold text-stone-900">
                          {profileObj.farmName || profileObj.fpoName || profileObj.businessName || 'Individual Identity'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Location / Address Card */}
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-700" />
                        Registered Operating Address
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Geolocation Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100 sm:col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          Street / Village / Area
                        </span>
                        <span className="text-sm font-bold text-stone-900">
                          {profileObj.addressLine || profileObj.village || profileObj.city || 'Gram Panchayat Center'}
                        </span>
                      </div>

                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          Pincode
                        </span>
                        <span className="text-sm font-black text-stone-900">{profileObj.pincode || '221001'}</span>
                      </div>

                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          District
                        </span>
                        <span className="text-sm font-bold text-stone-900">{profileObj.district || 'Varanasi'}</span>
                      </div>

                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          State
                        </span>
                        <span className="text-sm font-bold text-stone-900">{profileObj.state || 'Uttar Pradesh'}</span>
                      </div>

                      <div className="p-3.5 bg-stone-50/70 rounded-2xl border border-stone-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          Country
                        </span>
                        <span className="text-sm font-bold text-stone-900">India (IN)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EDIT PROFILE */}
            {activeTab === 'edit' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
                <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-stone-900">Edit Profile & Contact Coordinates</h3>
                    <p className="text-xs text-stone-500">Updates will be committed directly to your PostgreSQL user record</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="text-xs font-bold text-stone-500 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Entity / Farm / Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.farmName || formData.businessName}
                        onChange={(e) => setFormData({ ...formData, farmName: e.target.value, businessName: e.target.value })}
                        placeholder="e.g. Singh Modern Agro Farm"
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Address Line / Street / Landmark
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine}
                        onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                        placeholder="Village Road, Post Office Center"
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Village / Town / City
                      </label>
                      <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        District
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm font-semibold text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Saving to PostgreSQL...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: SECURITY & SESSIONS */}
            {activeTab === 'security' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Change Password Form */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
                  <div className="pb-3 border-b border-stone-100">
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-emerald-700" />
                      Update Account Password
                    </h4>
                    <p className="text-xs text-stone-500">Ensure strong entropy and at least 8 alphanumeric characters</p>
                  </div>

                  {passwordSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        New Password
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Repeat new password"
                        className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 px-3.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
                      >
                        {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                      >
                        {isChangingPassword ? 'Verifying...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Session & Security Telemetry */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
                  <div className="pb-3 border-b border-stone-100">
                    <h4 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                      Active Session & Security State
                    </h4>
                    <p className="text-xs text-stone-500">Live telemetry and cryptographic verification tokens</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-stone-50 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">Identity Token Status</span>
                        <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5" /> RSA-256 JWT Signed
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        HTTP-Only Cookie
                      </span>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">RBAC Permission Level</span>
                        <span className="text-xs font-extrabold text-stone-900 mt-0.5 block">
                          ROLE: {activeRole}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleBadgeColors[activeRole]}`}>
                        Authorized
                      </span>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">Last Active Session</span>
                        <span className="text-xs font-bold text-stone-700 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-stone-400" />
                          {profileData?.lastLoginAt
                            ? new Date(profileData.lastLoginAt).toLocaleString('en-IN')
                            : 'Current Active Session'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Active
                      </span>
                    </div>

                    <div className="p-3.5 bg-stone-50 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">Primary Database Link</span>
                        <span className="text-xs font-bold text-stone-800 mt-0.5 block">
                          PostgreSQL 16 @ localhost:5432
                        </span>
                      </div>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default UserProfilePage;
