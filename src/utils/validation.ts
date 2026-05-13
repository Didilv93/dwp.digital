import type { SubmissionData } from '../components/Form/index';

export interface ValidationResult {
  valid: boolean;
  messages: string[];
}

export function validateName(name: string): string | true {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Please enter your name.';
  }

  if (trimmed.length < 2) {
    return 'Name must contain at least 2 characters.';
  }

  return true;
}

export function validateEmail(email: string): string | true {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Please enter your email.';
  }

  if (!pattern.test(email)) {
    return 'Enter a valid email address.';
  }

  return true;
}

export function validateDateOfBirth(dob: string): string | true {
  if (!dob) {
    return 'Please enter your date of birth.';
  }

  const parsed = Number(new Date(dob));
  if (Number.isNaN(parsed)) {
    return 'Date of birth is invalid.';
  }

  const birth = new Date(dob);
  const today = new Date();
  if (birth >= today) {
    return 'Date of birth must be in the past.';
  }

  const age = today.getFullYear() - birth.getFullYear();
  if (age < 12 || age > 120) {
    return 'Age must be between 12 and 120 years.';
  }

  return true;
}

export function validatePhone(phone: string): string | true {
  const cleaned = phone.trim();
  if (!cleaned) {
    return 'Please enter your phone number.';
  }

  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) {
    return 'Phone number must contain between 9 and 15 digits.';
  }

  return true;
}

export function validateForm(data: SubmissionData): ValidationResult {
  const messages: string[] = [];

  const nameCheck = validateName(data.name);
  const emailCheck = validateEmail(data.email);
  const dobCheck = validateDateOfBirth(data.dateOfBirth);
  const phoneCheck = validatePhone(data.phone);

  if (nameCheck !== true) messages.push(nameCheck);
  if (emailCheck !== true) messages.push(emailCheck);
  if (dobCheck !== true) messages.push(dobCheck);
  if (phoneCheck !== true) messages.push(phoneCheck);

  return {
    valid: messages.length === 0,
    messages,
  };
}
