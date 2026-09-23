import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Sprout,
  Users,
  TrendingUp,
  ShieldCheck,
  Globe,
  ChevronDown,
  ShoppingCart,
  Truck,
  Settings,
  Leaf,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { getDashboardRouteForRole, ROLE_DASHBOARD_ROUTES } from '../utils/roleRoutes.js';

/* ─────────────────────────── constants ─────────────────────────── */

const BENEFITS = [
  { icon: Sprout,      title: 'Better Market Access', desc: 'Get fair prices for your produce'     },
  { icon: Users,       title: 'Direct Connections',   desc: 'Farmers, Buyers, FPOs & more'        },
  { icon: TrendingUp,  title: 'Grow Together',        desc: 'A stronger agricultural ecosystem'   },
  { icon: ShieldCheck, title: 'Sustainable Future',   desc: 'For generations to come'             },
];

const DEMO_ACCOUNTS = [
  { role: 'FARMER',     label: 'Farmer',    icon: Sprout,       email: 'farmer001@krishisetu.demo'    },
  { role: 'FPO',        label: 'FPO',       icon: Users,        email: 'fpo001@krishisetu.demo'       },
  { role: 'BULK_BUYER', label: 'Buyer',     icon: ShoppingCart, email: 'buyer001@krishisetu.demo'     },
  { role: 'LOGISTICS',  label: 'Logistics', icon: Truck,        email: 'logistics001@krishisetu.demo' },
  { role: 'ADMIN',      label: 'Admin',     icon: Settings,     email: 'demo.admin1@krishisetu.demo'  },
];

/* ─────────────────────────── component ─────────────────────────── */

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login    = useAuthStore((state) => state.login);

  const [identifier,   setIdentifier]   = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [loadingDemo,  setLoadingDemo]  = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname;

  const resolveDestination = (role) => {
    const canonical = getDashboardRouteForRole(role);
    const isCrossRole =
      from &&
      Object.entries(ROLE_DASHBOARD_ROUTES).some(
        ([r, route]) => r !== role && (from === route || from.startsWith(route + '/'))
      );
    return from && !isCrossRole ? from : canonical;
  };

  const performLogin = async (id, pw, demoRole = null) => {
    if (demoRole) setLoadingDemo(demoRole);
    else setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await login({ identifier: id.trim(), password: pw });
      if (response?.pendingVerification) {
        navigate('/auth/register?role=FARMER', {
          state: { identifier: response.data?.identifier },
        });
        return;
      }
      const role = response?.data?.role || response?.data?.user?.role;
      navigate(resolveDestination(role), { replace: true });
    } catch (err) {
      setErrorMessage(
        err.message || 'Invalid email or password. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
      setLoadingDemo(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter your email or mobile and password.');
      return;
    }
    performLogin(identifier, password);
  };

  const handleDemoLogin = (acc) =>
    performLogin(acc.email, 'Demo@12345', acc.role);

  const anyLoading = isLoading || loadingDemo !== null;

  /* ─── render ─── */
  return (
    /*
     * Outer shell: fills exactly the viewport — h-screen, no overflow.
     * p-4 gives breathing room so the card never touches the edges.
     */
    <div className="h-screen w-full overflow-hidden bg-green-50 flex items-center justify-center p-4 lg:p-6">

      {/*
       * Auth card: h-full = viewport minus padding.
       * Two-column grid on desktop, single column on mobile (left panel hides on xs).
       */}
      <div className="relative w-full max-w-5xl h-full overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl border border-green-100/50 bg-white grid grid-cols-1 lg:grid-cols-[44%_56%]">

        {/* ══════════ LEFT BRANDING PANEL ══════════ */}
        {/*
         * flex-col: top-content grows and clips, image is fixed-height at bottom.
         * Hidden below lg so mobile gets the full-width form.
         */}
        <div className="hidden lg:flex flex-col h-full overflow-hidden bg-[#f4fbf4]">

          {/* Top text content — grows, clips overflow so it never pushes image out */}
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

            {/* Hero */}
            <h1 className="text-2xl xl:text-3xl font-black text-green-950 leading-tight tracking-tight mb-3">
              Stronger<br />
              Farmers<br />
              Brighter<br />
              Tomorrows
            </h1>

            {/* Description */}
            <p className="text-xs text-green-900/55 leading-relaxed max-w-xs mb-5">
              KrishiSetu bridges the gap between farmers,
              buyers, and opportunities for a sustainable
              agricultural future.
            </p>

            {/* Benefits */}
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

          {/* Farm image — fixed height, never shrinks below this */}
          <div className="flex-shrink-0 relative h-44 xl:h-52">
            <img
              src="/assets/farm-landscape.jpg"
              alt="Green Indian farmland at sunrise"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Top gradient fades into panel bg */}
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

        {/* ══════════ RIGHT LOGIN PANEL ══════════ */}
        {/*
         * overflow-y-auto: if viewport is very short (< 580px) the form scrolls
         * internally instead of breaking the layout.
         */}
        <div className="h-full overflow-y-auto bg-white flex flex-col">

          {/* Sticky language selector inside the right panel */}
          <div className="flex-shrink-0 flex justify-end px-7 pt-5 pb-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer"
              aria-label="Change language"
            >
              <Globe className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
              <span>English</span>
              <ChevronDown className="h-3 w-3 text-gray-400" aria-hidden="true" />
            </button>
          </div>

          {/* Form wrapper — flex-1 centers the form vertically on tall viewports */}
          <div className="flex-1 flex flex-col justify-center px-7 sm:px-10 pb-6">
            <div className="w-full max-w-sm mx-auto space-y-4">

              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Sign in to continue to your KrishiSetu account.
                </p>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 animate-in fade-in duration-200"
                >
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">

                {/* Email */}
                <div>
                  <label htmlFor="login-identifier" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </span>
                    <input
                      id="login-identifier"
                      name="identifier"
                      type="text"
                      autoComplete="username"
                      required
                      disabled={anyLoading}
                      placeholder="Enter your email address"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </span>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      disabled={anyLoading}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                        : <Eye    className="h-4 w-4" aria-hidden="true" />
                      }
                    </button>
                  </div>
                </div>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={anyLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-green-700 hover:bg-green-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-green-900/15 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* OR divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Quick Demo Login */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2.5">
                  Quick Demo Login{' '}
                  <span className="font-normal text-gray-400 text-xs">(Optional)</span>
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon;
                    const isThisLoading = loadingDemo === acc.role;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        disabled={anyLoading}
                        onClick={() => handleDemoLogin(acc)}
                        title={`Demo login as ${acc.label}`}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-1 hover:border-green-400 hover:bg-green-50 active:scale-[0.97] transition-all group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <div className="h-7 w-7 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                          {isThisLoading ? (
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-green-300 border-t-green-700" aria-hidden="true" />
                          ) : (
                            <Icon className="h-3 w-3 text-green-700" aria-hidden="true" />
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-gray-600 group-hover:text-green-800 transition-colors leading-none text-center">
                          {acc.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Create account */}
              <div className="text-center pt-1">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/role-selection"
                    className="font-semibold text-green-700 hover:text-green-800 hover:underline transition-colors"
                  >
                    Create Account →
                  </Link>
                </p>
              </div>

              {/* Legal */}
              <p className="text-center text-[11px] text-gray-400 leading-relaxed">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-green-700 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-green-700 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
