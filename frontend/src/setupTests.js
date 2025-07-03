// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Added code to suppress React Router Future Flag Warnings
const originalWarn = console.warn;

beforeAll(() => {
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('React Router Future Flag Warning')) {
      return; // Suppress this specific warning
    }
    originalWarn.apply(console, args);
  };
});

afterAll(() => {
  console.warn = originalWarn; // Restore original console.warn
});