import React, { useState, useEffect } from 'react';
import { OtpInput } from '../OtpInput.jsx';
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService.js';

export function OtpVerificationStep({
  identifier,
  purpose = 'REGISTRATION',
  onSuccess,
  roleName = '',
}) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Countdown timer for 30s resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const response = await authService.verifyOtp({
        identifier,
        otp,
        purpose,
      });

      setSuccessMessage('Account verified and activated successfully!');
      setTimeout(() => {
        onSuccess(response.data);
      }, 900);
    } catch (err) {
      setErrorMessage(
        err.message || 'Verification failed. Please check the code and try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-submit when 6 digits are reached
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage('');
    try {
      await authService.sendOtp(identifier, purpose);
      setCooldown(30);
      setSuccessMessage('A fresh verification code has been dispatched.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center mb-6">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
          Step 5 of 5 • Final Verification
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          Verify Mobile Number
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-600">
          Enter the 6-digit code dispatched to{' '}
          <strong className="text-stone-900">+91 {identifier}</strong>
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        {/* Development Helper Badge */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-center text-xs text-amber-900">
          <span className="font-bold">Phase 1 Development Mode:</span> Mock OTP is{' '}
          <code className="rounded bg-amber-200/80 px-2 py-0.5 font-mono font-bold text-amber-950">
            123456
          </code>
        </div>

        {/* 6-box OTP Input */}
        <div>
          <OtpInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (errorMessage) setErrorMessage('');
            }}
            disabled={isVerifying}
            hasError={Boolean(errorMessage)}
          />

          {errorMessage && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-600 font-medium animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Verify Button */}
        <button
          type="button"
          disabled={otp.length !== 6 || isVerifying}
          onClick={handleVerify}
          className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {isVerifying ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Verifying & Activating...</span>
            </>
          ) : (
            <span>Verify & Enter KrishiSetu →</span>
          )}
        </button>

        {/* Resend Cooldown Section */}
        <div className="pt-2 text-center text-xs text-stone-600 border-t border-stone-100 flex flex-col items-center gap-1">
          <span>Didn't receive the SMS code?</span>
          {cooldown > 0 ? (
            <span className="font-semibold text-stone-400">
              Resend available in <span className="text-emerald-700">{cooldown}s</span>
            </span>
          ) : (
            <button
              type="button"
              disabled={isResending}
              onClick={handleResend}
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend OTP</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtpVerificationStep;
