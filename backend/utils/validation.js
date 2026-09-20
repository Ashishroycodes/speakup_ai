/**
 * Input validation utilities for SpeakUp Authentication & Profiles
 */

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: 'Password is required.'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long.'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must include at least one uppercase letter.'
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must include at least one lowercase letter.'
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must include at least one number.'
    };
  }

  return { isValid: true, message: 'Password is strong.' };
}

export function sanitizeString(input, maxLength = 255) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}
