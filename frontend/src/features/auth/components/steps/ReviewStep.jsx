import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Edit3, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROLE_DEFINITIONS } from './RoleSelectionStep.jsx';

/* ─────────────────────────── component ─────────────────────────── */

export function ReviewStep({
  role,
  accountData,
  profileData,
  onEditSection,
  onSubmit,
  isSubmitting,
}) {
  const [termsAccepted,   setTermsAccepted]   = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsError,      setTermsError]      = useState('');

  const currentRole = ROLE_DEFINITIONS.find((r) => r.key === role) || { title: role, desc: '' };

  const maskedPhone = accountData.phone
    ? `+91 ${accountData.phone.slice(0, 2)}••••••${accountData.phone.slice(-2)}`
    : '';

  const handleSubmit = () => {
    if (!termsAccepted || !privacyAccepted) {
      setTermsError('Please accept both the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setTermsError('');
    onSubmit();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
          Step 4 of 4 • Verification &amp; Review
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          Review Your Information
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Please confirm all details before we generate your secure 6-digit verification code.
        </p>
      </div>

      <div className="space-y-4">

        {/* ── Role Box ── */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Selected Marketplace Role
              </span>
              <h3 className="text-lg font-black text-stone-900">{currentRole.title}</h3>
              <p className="text-xs text-stone-500">{currentRole.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => onEditSection('role')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Change</span>
            </button>
          </div>
        </div>

        {/* ── Account Details Box ── */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <h4 className="text-sm font-bold text-stone-900">Account Credentials</h4>
            <button
              type="button"
              onClick={() => onEditSection('account')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-stone-500 block text-[11px] font-semibold uppercase">Full Name</span>
              <span className="font-semibold text-stone-900">{accountData.fullName}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px] font-semibold uppercase">Email</span>
              <span className="font-semibold text-stone-900">{accountData.email}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px] font-semibold uppercase">Mobile Number</span>
              <span className="font-semibold text-stone-900">{maskedPhone}</span>
            </div>
            <div>
              <span className="text-stone-500 block text-[11px] font-semibold uppercase">Password Status</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Protected &amp; Hashed</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Role Specific Details Box ── */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <h4 className="text-sm font-bold text-stone-900">{currentRole.title} Profile Information</h4>
            <button
              type="button"
              onClick={() => onEditSection('details')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            {role === 'FARMER' && (
              <>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Location</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.village}, {profileData.district}, {profileData.state} – {profileData.pincode}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Land Area</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.totalLandArea} {profileData.landUnit || 'Acre'} ({profileData.farmingType || 'Conventional'})
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Primary Crops</span>
                  <span className="font-semibold text-emerald-800">
                    {Array.isArray(profileData.primaryCrops) ? profileData.primaryCrops.join(', ') : profileData.primaryCrops}
                  </span>
                </div>
              </>
            )}
            {role === 'FPO' && (
              <>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">FPO / Company</span>
                  <span className="font-semibold text-stone-900">{profileData.fpoName} ({profileData.fpoType})</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Registration No</span>
                  <span className="font-semibold text-stone-900">{profileData.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Location</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.cityTownVillage}, {profileData.district}, {profileData.state}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Members &amp; Capacity</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.numberOfFarmers} Farmers • {profileData.aggregationCapacity || 0} MT Storage
                  </span>
                </div>
              </>
            )}
            {role === 'LOGISTICS' && (
              <>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Fleet Agency</span>
                  <span className="font-semibold text-stone-900">{profileData.businessName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Operating Hub</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.city}, {profileData.district}, {profileData.state}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Fleet Capacity</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.numberOfVehicles} Vehicles (Up to {profileData.maxLoadCapacity} Tons)
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Vehicle Types</span>
                  <span className="font-semibold text-stone-900">
                    {Array.isArray(profileData.vehicleTypes) ? profileData.vehicleTypes.join(', ') : profileData.vehicleTypes}
                  </span>
                </div>
              </>
            )}
            {role === 'BULK_BUYER' && (
              <>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Company</span>
                  <span className="font-semibold text-stone-900">{profileData.businessName} ({profileData.businessType})</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Facility Location</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.city}, {profileData.district}, {profileData.state}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Procurement Targets</span>
                  <span className="font-semibold text-stone-900">
                    {Array.isArray(profileData.primaryCrops) ? profileData.primaryCrops.join(', ') : profileData.primaryCrops}
                    {' '}(Avg {profileData.expectedVolume || 0} Tons/{profileData.procurementFrequency || 'Month'})
                  </span>
                </div>
              </>
            )}
            {role === 'CONSUMER' && (
              <>
                <div className="sm:col-span-2">
                  <span className="text-stone-500 block text-[11px] font-semibold uppercase">Delivery Address</span>
                  <span className="font-semibold text-stone-900">
                    {profileData.houseFlat ? `${profileData.houseFlat}, ` : ''}
                    {profileData.streetArea}, {profileData.city}, {profileData.district}, {profileData.state} – {profileData.pincode}
                  </span>
                </div>
                {profileData.deliveryInstructions && (
                  <div className="sm:col-span-2">
                    <span className="text-stone-500 block text-[11px] font-semibold uppercase">Special Instructions</span>
                    <span className="text-stone-700 italic">{profileData.deliveryInstructions}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Security Notice ── */}
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 text-xs text-emerald-900">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            Your credentials and role profile will be stored in PostgreSQL and protected with
            bcrypt encryption. A 6-digit OTP will be sent to your registered mobile number to
            activate your account.
          </p>
        </div>

        {/* ── Terms & Privacy Acceptance ── */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-stone-900 mb-1">Terms &amp; Privacy</h4>

          {/* Terms of Service */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (termsError) setTermsError('');
              }}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-emerald-600 accent-emerald-600 cursor-pointer"
              aria-describedby="terms-desc"
            />
            <span id="terms-desc" className="text-xs text-stone-600 leading-relaxed">
              I agree to the{' '}
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </Link>
            </span>
          </label>

          {/* Privacy Policy */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => {
                setPrivacyAccepted(e.target.checked);
                if (termsError) setTermsError('');
              }}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-emerald-600 accent-emerald-600 cursor-pointer"
              aria-describedby="privacy-desc"
            />
            <span id="privacy-desc" className="text-xs text-stone-600 leading-relaxed">
              I agree to the{' '}
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:text-emerald-900 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Inline acceptance error */}
          {termsError && (
            <p role="alert" className="text-xs text-red-600 font-medium">
              {termsError}
            </p>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-200">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onEditSection('details')}
            className="px-5 py-2.5 rounded-xl border border-stone-300 font-semibold text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Details</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/15 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account &amp; Request OTP</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;
