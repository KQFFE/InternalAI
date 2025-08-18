// frontend/src/components/AdminLogin.js
import { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (pwd) => {
    if (!pwd || pwd.trim() === '') return 'Password is required';
    if (pwd.length < 3) return 'Password must be at least 3 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Client-side validation
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
    }
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
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <div className="admin-login-header">
          <h2>Admin Login</h2>
          {onCancel && (
            <button 
              className="close-button" 
              onClick={onCancel}
              disabled={loading}
              aria-label="Close login modal"
            >
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="password-input-container">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter admin password"
                disabled={loading}
                autoComplete="current-password"
                autoFocus
                className={error ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="login-button"
              disabled={loading || !password}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
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
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-login-footer">
          <small>
            Access restricted to authorized personnel only.
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;