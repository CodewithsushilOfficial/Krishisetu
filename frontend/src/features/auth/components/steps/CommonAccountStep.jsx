import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Phone, User, ArrowLeft } from 'lucide-react';
import { PasswordChecklist } from '../PasswordChecklist.jsx';

export function CommonAccountStep({ data, onUpdate, onNext, onBack, roleName }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.fullName || data.fullName.trim().length < 2) {
      errs.fullName = 'Full Name must be at least 2 characters';
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    const cleanPhone = (data.phone || '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+={}\[\]:;<>,.?/~`|\\-]).{8,}$/;
    if (!data.password || !passwordRegex.test(data.password)) {
      errs.password = 'Password must meet all complexity requirements';
    }
    if (data.password !== data.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
          Step 2 of 5 • Account Credentials
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          Create Your {roleName || 'KrishiSetu'} Account
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Enter your basic contact details to establish your secure identity.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Ramesh Patel"
              value={data.fullName || ''}
              onChange={(e) => {
                onUpdate({ fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: null });
              }}
              className={`w-full rounded-xl border bg-stone-50/50 py-2.5 pl-10 pr-4 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                  : 'border-stone-300 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
          </div>
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              placeholder="e.g. ramesh.farmer@krishisetu.in"
              value={data.email || ''}
              onChange={(e) => {
                onUpdate({ email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              className={`w-full rounded-xl border bg-stone-50/50 py-2.5 pl-10 pr-4 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 ${
                errors.email
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                  : 'border-stone-300 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Mobile Number (+91) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Mobile Number (India) <span className="text-red-500">*</span>
          </label>
          <div className="relative flex rounded-xl border border-stone-300 bg-stone-50/50 overflow-hidden focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
            <span className="inline-flex items-center px-3.5 border-r border-stone-200 text-stone-500 text-xs font-bold bg-stone-100/80">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              value={data.phone || ''}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                onUpdate({ phone: clean });
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              className="w-full py-2.5 px-3.5 text-sm text-stone-900 outline-none bg-transparent placeholder:text-stone-400"
            />
          </div>
          {errors.phone ? (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          ) : (
            <p className="mt-1 text-[11px] text-stone-500">We will verify this number via SMS OTP.</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create strong password"
              value={data.password || ''}
              onChange={(e) => {
                onUpdate({ password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              className={`w-full rounded-xl border bg-stone-50/50 py-2.5 pl-10 pr-11 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 ${
                errors.password
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                  : 'border-stone-300 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-stone-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordChecklist password={data.password || ''} />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={data.confirmPassword || ''}
              onChange={(e) => {
                onUpdate({ confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              className={`w-full rounded-xl border bg-stone-50/50 py-2.5 pl-10 pr-11 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:bg-white focus:ring-2 ${
                errors.confirmPassword
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                  : 'border-stone-300 focus:border-emerald-600 focus:ring-emerald-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-stone-600"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-stone-300 font-semibold text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Change Role</span>
          </button>
          <button
            type="submit"
            className="px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/10 active:scale-[0.98]"
          >
            Continue to Details →
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommonAccountStep;
