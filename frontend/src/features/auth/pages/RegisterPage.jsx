import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sprout,
  Users,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Globe,
  ChevronDown,
  Check,
  AlertCircle,
} from 'lucide-react';
import { RoleSelectionStep } from '../components/steps/RoleSelectionStep.jsx';
import { CommonAccountStep } from '../components/steps/CommonAccountStep.jsx';
import { FarmerDetailsStep } from '../components/steps/FarmerDetailsStep.jsx';
import { FpoDetailsStep } from '../components/steps/FpoDetailsStep.jsx';
import { LogisticsDetailsStep } from '../components/steps/LogisticsDetailsStep.jsx';
import { BulkBuyerDetailsStep } from '../components/steps/BulkBuyerDetailsStep.jsx';
import { ConsumerDetailsStep } from '../components/steps/ConsumerDetailsStep.jsx';
import { ReviewStep } from '../components/steps/ReviewStep.jsx';
import { OtpVerificationStep } from '../components/steps/OtpVerificationStep.jsx';
import { authService } from '../services/authService.js';
import { useAuthStore } from '../store/authStore.js';
import { getDashboardRouteForRole } from '../utils/roleRoutes.js';

/* ─────────────────────────── constants ─────────────────────────── */

const BENEFITS = [
  { icon: Sprout,      title: 'Better Market Access', desc: 'Get fair prices for your produce'       },
  { icon: Users,       title: 'Direct Connections',   desc: 'Farmers, Buyers, FPOs & more'          },
  { icon: TrendingUp,  title: 'Grow Together',        desc: 'A stronger agricultural ecosystem'     },
  { icon: ShieldCheck, title: 'Sustainable Future',   desc: 'For generations to come'               },
];

const PROGRESS_STEPS = [
  { id: 1, label: 'Role'       },
  { id: 2, label: 'Basic Info' },
  { id: 3, label: 'Details'    },
  { id: 4, label: 'Review'     },
];

/* ─────────────────────────── component ─────────────────────────── */

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const initialRole = searchParams.get('role') || '';
  const initialStep = initialRole ? 2 : 1;

  const [currentStep,  setCurrentStep]  = useState(initialStep);
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const [accountData, setAccountData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [profileData,  setProfileData]  = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError,     setApiError]     = useState('');

  // Keep role query param in sync so back/forward works
  useEffect(() => {
    if (selectedRole) setSearchParams({ role: selectedRole }, { replace: true });
  }, [selectedRole, setSearchParams]);

  const handleUpdateAccount = (fields) => {
    setAccountData((prev) => ({ ...prev, ...fields }));
    if (apiError) setApiError('');
  };

  const handleUpdateProfile = (fields) => {
    setProfileData((prev) => ({ ...prev, ...fields }));
    if (apiError) setApiError('');
  };

  const handleSubmitRegistration = async () => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const payloadProfile = { ...profileData };
      // Normalise comma-separated strings → arrays (matches backend Zod transform)
      for (const key of ['primaryCrops', 'secondaryCrops', 'vehicleTypes', 'serviceAreas', 'operatingDistricts']) {
        if (typeof payloadProfile[key] === 'string') {
          payloadProfile[key] = payloadProfile[key].split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      await authService.register({ role: selectedRole, account: accountData, profile: payloadProfile });
      setCurrentStep(5);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please verify your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSuccess = (data) => {
    setAuth({ user: data.user, accessToken: data.accessToken, role: data.role });
    navigate(getDashboardRouteForRole(data.role), { replace: true });
  };

  // The progress indicator shows steps 1-4; step 5 (OTP) has its own UI
  const progressStep = Math.min(currentStep, 4);

  /* ─── render ─── */
  return (
    /*
     * Same shell as LoginPage: fills viewport, centers the card, breathing room via p-4.
     */
    <div className="h-screen w-full overflow-hidden bg-green-50 flex items-center justify-center p-4 lg:p-6">

      {/*
       * Auth card — same two-column grid as LoginPage.
       * Left branding: 44% | Right registration: 56%
       */}
      <div className="relative w-full max-w-5xl h-full overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl border border-green-100/50 bg-white grid grid-cols-1 lg:grid-cols-[44%_56%]">

        {/* ══════════ LEFT BRANDING PANEL ══════════ */}
        {/* Identical structure to LoginPage — same visual family */}
        <div className="hidden lg:flex flex-col h-full overflow-hidden bg-[#f4fbf4]">

          {/* Top text block — grows, clips overflow so it never pushes image out */}
          <div className="flex-1 min-h-0 overflow-hidden px-8 pt-8 pb-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-1">
              <img
                src="/assets/logo.png"
                alt="KrishiSetu"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="hidden h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white"
                aria-hidden="true"
              >
                <Sprout className="h-5 w-5" />
              </div>
            </Link>
            <p className="text-[11px] text-green-700/70 font-medium mb-6">
              Connecting Farmers to a Better Tomorrow
            </p>

            {/* Hero heading */}
            <h1 className="text-2xl xl:text-3xl font-black text-green-950 leading-tight tracking-tight mb-3">
              Empowering<br />
              Farmers<br />
              Building<br />
              Brighter Futures
            </h1>

            {/* Description */}
            <p className="text-xs text-green-900/55 leading-relaxed max-w-xs mb-5">
              Join KrishiSetu and be part of a sustainable agricultural
              ecosystem. Connect, trade, and grow together.
            </p>

            {/* Benefits list */}
            <ul className="space-y-2.5">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-900">{title}</p>
                    <p className="text-[11px] text-green-700/55 leading-none mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Farm image — fixed height, never shrinks */}
          <div className="flex-shrink-0 relative h-44 xl:h-52">
            <img
              src="/assets/farm-landscape.jpg"
              alt="Green Indian farmland at sunrise"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Gradient fade into panel background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f4fbf4] via-transparent to-green-950/75" />
            {/* Overlay text */}
            <div className="absolute bottom-4 left-7">
              <p className="text-base font-bold italic text-white drop-shadow leading-snug">
                For a<br />Greener Tomorrow
              </p>
              <Leaf className="h-3.5 w-3.5 text-green-300 mt-1 drop-shadow" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT REGISTRATION PANEL ══════════ */}
        {/*
         * Full height, vertically scrolls if the step content is taller than the viewport.
         * Three sections: fixed top-bar → fixed page header + progress → scrollable step content.
         */}
        <div className="h-full flex flex-col bg-white overflow-hidden">

          {/* ── Top bar: language selector + sign-in link ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-7 pt-5 pb-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer"
              aria-label="Change language"
            >
              <Globe className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
              <span>English</span>
              <ChevronDown className="h-3 w-3 text-gray-400" aria-hidden="true" />
            </button>
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="font-semibold text-green-700 hover:text-green-800 hover:underline transition-colors"
              >
                Sign In →
              </Link>
            </p>
          </div>

          {/* ── Page heading ── */}
          <div className="flex-shrink-0 px-7 sm:px-10 pt-1 pb-3">
            {/* Mobile-only logo (left panel hidden on mobile) */}
            <div className="lg:hidden flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-green-700 flex items-center justify-center text-white">
                <Sprout className="h-4 w-4" />
              </div>
              <span className="text-base font-black tracking-tight text-gray-900">
                Krishi<span className="text-green-700">Setu</span>
              </span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
              Create Your Account
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Join KrishiSetu and start your journey today.
            </p>
          </div>

          {/* ── Progress indicator (hidden during OTP step) ── */}
          {currentStep <= 4 && (
            <div
              className="flex-shrink-0 px-7 sm:px-10 pb-4"
              role="progressbar"
              aria-label={`Step ${progressStep} of 4`}
              aria-valuenow={progressStep}
              aria-valuemin={1}
              aria-valuemax={4}
            >
              <div className="flex items-center">
                {PROGRESS_STEPS.map((step, idx) => {
                  const isCompleted = progressStep > step.id;
                  const isCurrent   = progressStep === step.id;
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                            isCompleted
                              ? 'bg-green-600 text-white'
                              : isCurrent
                              ? 'bg-green-700 text-white ring-4 ring-green-100'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          aria-label={`Step ${step.id}: ${step.label}${isCompleted ? ' (complete)' : isCurrent ? ' (current)' : ''}`}
                        >
                          {isCompleted
                            ? <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />
                            : step.id
                          }
                        </div>
                        <span
                          className={`text-[10px] font-semibold hidden sm:inline ${
                            isCurrent   ? 'text-green-800 font-bold'
                            : isCompleted ? 'text-gray-500'
                            : 'text-gray-300'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {idx < PROGRESS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                            progressStep > step.id ? 'bg-green-500' : 'bg-gray-150'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── API error banner ── */}
          {apiError && (
            <div
              role="alert"
              className="flex-shrink-0 mx-7 sm:mx-10 mb-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 animate-in fade-in duration-200"
            >
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{apiError}</span>
            </div>
          )}

          {/* ── Scrollable step content ── */}
          <div className="flex-1 min-h-0 overflow-y-auto px-7 sm:px-10 pb-8">

            {/* STEP 1 — Role Selection (inline, compact) */}
            {currentStep === 1 && (
              <RoleSelectionStep
                selectedRole={selectedRole}
                onSelectRole={(r) => {
                  setSelectedRole(r);
                  setProfileData({});
                  setCurrentStep(2);
                }}
              />
            )}

            {/* STEP 2 — Basic Account Info */}
            {currentStep === 2 && (
              <CommonAccountStep
                data={accountData}
                onUpdate={handleUpdateAccount}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
                roleName={selectedRole}
              />
            )}

            {/* STEP 3 — Role-Specific Details */}
            {currentStep === 3 && (
              <>
                {selectedRole === 'FARMER' && (
                  <FarmerDetailsStep
                    data={profileData}
                    onUpdate={handleUpdateProfile}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
                {selectedRole === 'FPO' && (
                  <FpoDetailsStep
                    data={profileData}
                    onUpdate={handleUpdateProfile}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
                {selectedRole === 'LOGISTICS' && (
                  <LogisticsDetailsStep
                    data={profileData}
                    onUpdate={handleUpdateProfile}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
                {selectedRole === 'BULK_BUYER' && (
                  <BulkBuyerDetailsStep
                    data={profileData}
                    onUpdate={handleUpdateProfile}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
                {selectedRole === 'CONSUMER' && (
                  <ConsumerDetailsStep
                    data={profileData}
                    onUpdate={handleUpdateProfile}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
              </>
            )}

            {/* STEP 4 — Review + Terms + Submit */}
            {currentStep === 4 && (
              <ReviewStep
                role={selectedRole}
                accountData={accountData}
                profileData={profileData}
                onEditSection={(section) => {
                  if (section === 'role')    setCurrentStep(1);
                  else if (section === 'account') setCurrentStep(2);
                  else                       setCurrentStep(3);
                }}
                onSubmit={handleSubmitRegistration}
                isSubmitting={isSubmitting}
              />
            )}

            {/* STEP 5 — OTP Verification */}
            {currentStep === 5 && (
              <OtpVerificationStep
                identifier={accountData.phone}
                purpose="REGISTRATION"
                onSuccess={handleVerificationSuccess}
                roleName={selectedRole}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
