import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, KeyRound } from 'lucide-react';
import { authService } from '../services/authService.js';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email or mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await authService.forgotPassword(identifier.trim());
      // Navigate to reset password page with identifier state
      navigate('/auth/reset-password', {
        state: { identifier: identifier.trim() },
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-stone-900/5 rounded-3xl border border-stone-200/80">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Forgot Password
            </h2>
            <p className="mt-1.5 text-xs text-stone-600">
              Enter your registered mobile or email to receive a 6-digit recovery code.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Registered Email or Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="name@email.com or 10-digit mobile"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/50 py-2.5 pl-10 pr-4 text-sm text-stone-900 outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <span>Send Reset Code →</span>
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

export default ForgotPasswordPage;
