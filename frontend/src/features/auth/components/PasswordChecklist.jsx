import React from 'react';
import { Check, X } from 'lucide-react';

export function PasswordChecklist({ password = '' }) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#^()_+={}\[\]:;<>,.?/~`|\\-]/.test(password);

  const checks = [
    { label: 'At least 8 characters', met: hasLength },
    { label: 'One uppercase letter (A-Z)', met: hasUpper },
    { label: 'One lowercase letter (a-z)', met: hasLower },
    { label: 'One number (0-9)', met: hasNumber },
    { label: 'One special symbol (!@#$...)', met: hasSpecial },
  ];

  const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (score <= 2) return { text: 'Weak', color: 'bg-red-500', textColor: 'text-red-600' };
    if (score <= 4) return { text: 'Good', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { text: 'Strong', color: 'bg-emerald-600', textColor: 'text-emerald-700' };
  };

  const strength = getStrengthLabel();

  if (!password) return null;

  return (
    <div className="mt-2.5 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3.5 text-xs text-stone-700">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-stone-600">Password Strength:</span>
        <span className={`font-bold ${strength.textColor}`}>{strength.text}</span>
      </div>

      {/* Strength Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200 mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <div
            key={lvl}
            className={`h-full flex-1 transition-all duration-300 ${
              lvl <= score ? strength.color : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {check.met ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 stroke-[3]" />
            ) : (
              <X className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            )}
            <span className={check.met ? 'text-emerald-950 font-medium' : 'text-stone-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PasswordChecklist;
