import React, { useRef, useEffect } from 'react';

export function OtpInput({
  value = '',
  onChange,
  disabled = false,
  hasError = false,
  length = 6,
}) {
  const inputRefs = useRef([]);

  // Split string into array of characters
  const digits = value.split('').slice(0, length);
  while (digits.length < length) digits.push('');

  useEffect(() => {
    // Auto focus first empty input or the first one on mount
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    if (inputRefs.current[targetIndex] && !disabled) {
      inputRefs.current[targetIndex].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const combined = newDigits.join('');
    onChange(combined);

    // Auto advance
    if (char && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move back and clear previous
        inputRefs.current[index - 1].focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const nextFocus = Math.min(pasted.length, length - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[idx] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={`h-12 w-11 sm:h-14 sm:w-13 rounded-xl border text-center text-xl sm:text-2xl font-bold tracking-tight transition-all outline-none ${
            hasError
              ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-600 focus:ring-2 focus:ring-red-200'
              : digits[idx]
              ? 'border-emerald-600 bg-white text-emerald-950 ring-2 ring-emerald-500/20'
              : 'border-stone-300 bg-stone-50 text-stone-900 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
}

export default OtpInput;
