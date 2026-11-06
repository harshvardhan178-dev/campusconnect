import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCheck, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    college: '',
    degree: '',
    graduationYear: 2026,
    skills: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        graduationYear: parseInt(formData.graduationYear) || 2026,
      };

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Your Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Join CampusConnect to discover opportunities & find teammates
            </p>
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
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Alex Rivera"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (College or Personal) *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="alex@university.edu"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password * (Min 6 characters)</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Register As</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student (Looking for Opportunities & Teams)</option>
                <option value="organizer">Opportunity Organizer (Posting Hackathons & Jobs)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">College / University Name</label>
              <input
                type="text"
                name="college"
                className="form-input"
                placeholder="e.g. Apex Institute of Technology"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            {formData.role === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      className="form-input"
                      placeholder="e.g. B.Tech CS"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Graduation Year</label>
                    <input
                      type="number"
                      name="graduationYear"
                      className="form-input"
                      value={formData.graduationYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Technical Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    className="form-input"
                    placeholder="React, Node.js, Python, Figma"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner" style={{ width: '18px', height: '18px', borderColor: '#fff', borderTopColor: 'transparent' }} />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserCheck size={18} />
                  <span>Register Account</span>
                </div>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: '600', color: 'var(--primary)' }}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
