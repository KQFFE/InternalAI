import { useState, useEffect, useRef } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const passwordInputRef = useRef(null);
  const closeButtonRef = useRef(null); // Ref for the close button
  const triggerRef = useRef(null); // To store the element that opened the modal

  // Use a ref to hold the latest onCancel callback.
  // This prevents the keyboard event listener from being re-added on every render.
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  // Effect for focus management on mount/unmount and hiding background content.
  // This runs only once.
  useEffect(() => {
    // Store the element that opened the modal, to return focus to it later.
    triggerRef.current = document.activeElement;

    // Set initial focus on the first interactive element in the modal.
    // Use a timeout to ensure the browser has rendered the element before focusing.
    setTimeout(() => closeButtonRef.current?.focus(), 0);

    // Hide main content from screen readers.
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('aria-hidden', 'true');
    }

    // Cleanup on unmount.
    return () => {
      var _triggerRef$current;
      // Restore main content for screen readers.
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
      // Return focus to the element that opened the modal.
      const trigger = (_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 ? void 0 : _triggerRef$current;
      // Using requestAnimationFrame ensures the focus is set after the browser has
      // completed its current rendering tasks, which is more robust for all browsers.
      if (trigger) requestAnimationFrame(() => trigger.focus());
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount.

  // Effect for handling keyboard events (ESC and Tab for focus trapping).
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Handle Escape key to close the modal.
      if (event.key === 'Escape' && !loading) {
        event.preventDefault();
        event.stopPropagation();
        onCancelRef.current();
        return;
      }

      // Handle Tab key to trap focus within the modal.
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading]); // This effect is now stable and only depends on the `loading` state.

    const validatePassword = (pwd) => {
        if (!pwd || pwd.trim() === '') return 'Password is required';
        if (pwd.length < 3) return 'Password must be at least 3 characters';
        return null;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for session cookies
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Success - clear form and notify parent
            setPassword('');
            setError('');
            if (onLogin) {
                onLogin(data);
            }
        } else {
            // Login failed - clear password and show error
            setPassword('');
            setError(data.error || 'Login failed. Please check your password.');
        }
    } catch (err) {
        console.error('Login error:', err);
        setPassword(''); // Clear password on any error
        setError('Network error. Please check your connection and try again.');
    } finally {
        setLoading(false);
    };
  };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Clear error when user starts typing
        if (error) {
            setError('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

  return (
    <div className="admin-login-overlay" data-testid="admin-login-overlay">
      <div ref={modalRef} className="admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-heading" data-testid="admin-login-modal" tabIndex="-1">
                <div className="admin-login-header" data-testid="admin-login-header">
                    <h2>Admin Login</h2>
                    {onCancel && (
                        <button
                            ref={closeButtonRef}
                            className="close-button"
                            onClick={onCancel}
                            disabled={loading}
                            aria-label="Close login modal"
              data-testid="close-modal-button"
                        >
                            ×
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form" data-testid="admin-login-form">
                    <div className="form-group" data-testid="form-group">
                        <label htmlFor="admin-password">Password</label>
                        <div className="password-input-container" data-testid="password-input-container">
                            <input
                ref={passwordInputRef}
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter admin password"
                                disabled={loading}
                                autoComplete="current-password"
                                className={error ? 'error' : ''}
                data-testid="admin-password-input"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={togglePasswordVisibility}
                                disabled={loading}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid="toggle-password-visibility-button"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message" role="alert" data-testid="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-actions" data-testid="form-actions">
                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading || !password}
                            data-testid="login-button"
                        >
                            {loading ? (
                                <>
                  <span className="loading-spinner" data-testid="loading-spinner"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>

                        {onCancel && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={onCancel}
                                disabled={loading}
                                data-testid="cancel-button"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="admin-login-footer" data-testid="admin-login-footer">
                    <small>
                        Access restricted to authorized personnel only.
                    </small>
                </div>
        </div>
    </div>
    );
};

export default AdminLogin;
