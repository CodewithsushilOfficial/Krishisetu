import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { OtpInput } from '../components/OtpInput.jsx';
import { PasswordChecklist } from '../components/PasswordChecklist.jsx';
import { authService } from '../services/authService.js';

export function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(location.state?.identifier || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Identifier is missing. Please restart password recovery.');
      return;
    }
    if (otp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+={}\[\]:;<>,.?/~`|\\-]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage('New password must meet all complexity requirements.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await authService.resetPassword({
        identifier: identifier.trim(),
        otp,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/login', { replace: true });
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-stone-900/5 rounded-3xl border border-stone-200/80">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Reset Your Password
            </h2>
            <p className="mt-1.5 text-xs text-stone-600">
              Enter the OTP sent to <strong>{identifier || 'your account'}</strong> and choose a new password.
            </p>
          </div>

          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 text-center text-xs text-amber-900">
            <span className="font-bold">Dev Note:</span> Mock reset OTP is{' '}
            <code className="rounded bg-amber-200 px-1.5 py-0.5 font-mono font-bold text-amber-950">
              123456
            </code>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Password updated successfully! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!location.state?.identifier && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter email or mobile"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/50 p-2.5 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 text-center">
                6-Digit Recovery OTP
              </label>
              <OtpInput value={otp} onChange={setOtp} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 pl-10 pr-11 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
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
              <PasswordChecklist password={newPassword} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 pl-10 pr-4 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password →</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 text-center border-t border-stone-100">
            <Link
              to="/auth/login"
              className="text-xs font-bold text-stone-600 hover:text-emerald-700 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
