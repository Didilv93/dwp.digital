import { describe, it, expect } from 'vitest';
import { validateForm } from './validation';

describe('validateForm', () => {
  it('accepts valid data', () => {
    const result = validateForm({
      name: 'Diego Silva',
      email: 'diego@example.com',
      dateOfBirth: '1990-05-13',
      phone: '+44 7123 456 789',
    });

    expect(result.valid).toBe(true);
    expect(result.messages).toHaveLength(0);
  });

  it('rejects invalid email and empty phone number', () => {
    const result = validateForm({
      name: 'Ana',
      email: 'invalid-email',
      dateOfBirth: '1990-05-13',
      phone: '',
    });

    expect(result.valid).toBe(false);
    expect(result.messages).toContain('Enter a valid email address.');
    expect(result.messages).toContain('Please enter your phone number.');
  });

  it('rejects a future date of birth', () => {
    const futureYear = new Date().getFullYear() + 1;
    const result = validateForm({
      name: 'Maria',
      email: 'maria@example.com',
      dateOfBirth: `${futureYear}-01-01`,
      phone: '+44 7123 456 789',
    });

    expect(result.valid).toBe(false);
    expect(result.messages).toContain('Date of birth must be in the past.');
  });
});
