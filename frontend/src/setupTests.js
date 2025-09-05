// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Store original console methods
const originalWarn = console.warn;
const originalError = console.error;

// Global fetch mock setup for all tests
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ isAuthenticated: false }),
    })
);

beforeAll(() => {
    // Suppress React Router Future Flag Warnings
    console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string' && message.includes('React Router Future Flag Warning')) {
            return; // Suppress this specific warning
        }
        originalWarn.apply(console, args);
    };

    // Suppress React act() warnings and AuthContext fetch errors
    console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string') {
            // Suppress act warnings
            if (message.includes('Warning: An update to') && message.includes('was not wrapped in act')) {
                return;
            }
            // Suppress AuthContext fetch errors in tests
            if (message.includes('Error checking auth status:')) {
                return;
            }
        }
        originalError.apply(console, args);
    };
});

beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockClear();
    fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ isAuthenticated: false }),
    });
});

afterAll(() => {
    // Restore original console methods
    console.warn = originalWarn;
    console.error = originalError;
});