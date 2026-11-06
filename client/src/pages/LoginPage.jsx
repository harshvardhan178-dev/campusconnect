import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credential autofill for easy live demonstration & college evaluation
  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Sign in to your CampusConnect dashboard
            </p>
          </div>

          {/* Quick Demo Credential Pills */}
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={14} color="var(--primary)" /> DEMO TEST ACCOUNTS (CLICK TO AUTOFILL):
            </div>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillDemo('student@campusconnect.edu')}
                className="badge badge-primary"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('organizer@campusconnect.edu')}
                className="badge badge-warning"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Organizer Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@campusconnect.edu')}
                className="badge badge-danger"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Admin Demo
              </button>
            </div>
          </div>

          {error && (
            <div
              className="flex items-center gap-2"
              style={{
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between">
                <label className="form-label">Password</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner" style={{ width: '18px', height: '18px', borderColor: '#fff', borderTopColor: 'transparent' }} />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn size={18} />
                  <span>Log In</span>
                </div>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary)' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
