import '@testing-library/jest-dom';

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
    className: 'mocked-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
    className: 'mocked-geist-mono',
  }),
}));
