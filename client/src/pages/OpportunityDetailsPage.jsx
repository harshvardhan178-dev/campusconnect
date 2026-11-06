import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import opportunityService from '../services/opportunityService';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Building,
  Award,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileText,
  User,
  ArrowLeft,
} from 'lucide-react';

const OpportunityDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Application form state
  const [resumeLink, setResumeLink] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwnerOrAdmin =
    opportunity && (opportunity.organizerId?._id === user?._id || user?.role === 'admin');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await opportunityService.getById(id);
        if (res?.data) {
          setOpportunity(res.data);
        }

        // If organizer owner or admin, fetch applications
        if (
          res?.data &&
          (res.data.organizerId?._id === user?._id ||
            res.data.organizerId?._id === user?.id ||
            user?.role === 'admin')
        ) {
          try {
            const appsRes = await opportunityService.getApplications(id);
            if (appsRes?.data) {
              setApplications(appsRes.data);
            }
          } catch (e) {
            console.error('Failed to load applications:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load opportunity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await opportunityService.apply(id, {
        resumeLink,
        statementOfPurpose,
        portfolioLink,
      });
      setAppliedSuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await opportunityService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Opportunity not found</h2>
        <Link to="/opportunities" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <Link
        to="/opportunities"
        className="flex items-center gap-1"
        style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '500' }}
      >
        <ArrowLeft size={16} /> Back to all opportunities
      </Link>

      {appliedSuccess && (
        <div
          className="flex items-center gap-2"
          style={{
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={20} />
          <span>Your application has been successfully submitted to {opportunity.organizationName}!</span>
        </div>
      )}

      {/* Main Opportunity Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.875rem', padding: '0.35rem 0.85rem' }}>
            {opportunity.category}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={15} /> Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
          </span>
        </div>

        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', lineHeight: 1.25 }}>
          {opportunity.title}
        </h1>

        <div className="flex items-center gap-6" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <span className="flex items-center gap-1">
            <Building size={16} /> {opportunity.organizationName}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {opportunity.locationType} ({opportunity.location})
          </span>
          <span className="flex items-center gap-1" style={{ color: 'var(--primary)', fontWeight: '600' }}>
            <Award size={16} /> {opportunity.rewardOrStipend}
          </span>
        </div>

        {/* Detailed Description */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Detailed Overview</h3>
          <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-line' }}>
            {opportunity.description}
          </p>
        </div>

        {/* Required Technical Skills */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Desired Skills & Technologies</h3>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {opportunity.requiredSkills?.map((skill, index) => (
              <span key={index} className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Application Action Button */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Posted by Organizer:</p>
            <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{opportunity.organizerId?.name || opportunity.organizationName}</p>
          </div>

          {isAuthenticated ? (
            user?.role === 'student' ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              >
                <Send size={18} /> Apply for Opportunity
              </button>
            ) : (
              <span className="badge badge-neutral" style={{ padding: '0.5rem 1rem' }}>
                Logged in as {user?.role} (Student account required to apply)
              </span>
            )
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              Log in to Apply
            </Link>
          )}
        </div>
      </div>

      {/* Organizer Applications Review Section */}
      {(opportunity.organizerId?._id === user?._id ||
        opportunity.organizerId?._id === user?.id ||
        user?.role === 'admin') && (
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>
                Received Applications ({applications.length})
              </h3>
            </div>

            {applications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No candidates have applied for this opportunity yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      className="flex items-center justify-between"
                      style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            app.studentId?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                          }
                          alt={app.studentId?.name}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <Link
                            to={`/profile/${app.studentId?._id}`}
                            style={{ fontWeight: '600', color: 'var(--text-primary)' }}
                          >
                            {app.studentId?.name}
                          </Link>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {app.studentId?.college || 'Student'} • {app.studentId?.degree} (Class of {app.studentId?.graduationYear || '2026'})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          Status:
                        </span>
                        <select
                          className="form-input"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.825rem', width: 'auto' }}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          <option value="applied">Applied</option>
                          <option value="under_review">Under Review</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {app.statementOfPurpose && (
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-main)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '0.75rem',
                        }}
                      >
                        &ldquo;{app.statementOfPurpose}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                      <div className="flex items-center gap-4">
                        {app.resumeLink && (
                          <a
                            href={app.resumeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            View Resume
                          </a>
                        )}
                        {app.portfolioLink && (
                          <a
                            href={app.portfolioLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            Portfolio / GitHub
                          </a>
                        )}
                      </div>

                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Submitted {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Apply for Opportunity</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Submitting application to <strong>{opportunity.title}</strong>
            </p>

            {error && (
              <div
                className="flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Resume Link (Google Drive / Dropbox / PDF URL) *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://drive.google.com/your-resume.pdf"
                  required
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio / GitHub Profile URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/yourname"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statement of Purpose / Introduction</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Highlight your relevant experience, technical projects, and why you are excited about this opportunity..."
                  value={statementOfPurpose}
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end" style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetailsPage;
