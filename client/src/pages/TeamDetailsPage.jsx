import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import teamService from '../services/teamService';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Crown,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const TeamDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [error, setError] = useState(null);

  const isLeader = team && (team.leaderId?._id === user?._id || team.leaderId?._id === user?.id);
  const isMember = team && team.members?.some((m) => m._id === user?._id || m._id === user?.id);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const res = await teamService.getById(id);
      if (res?.data) {
        setTeam(res.data);
      }

      // If team leader or admin, fetch pending join requests
      if (
        res?.data &&
        (res.data.leaderId?._id === user?._id || res.data.leaderId?._id === user?.id || user?.role === 'admin')
      ) {
        try {
          const reqRes = await teamService.getRequests(id);
          if (reqRes?.data) {
            setRequests(reqRes.data);
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to load team details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [id, user]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSubmittingRequest(true);
    setError(null);

    try {
      await teamService.sendRequest(id, requestMessage);
      setRequestSuccess(true);
      setRequestMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send join request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleDecision = async (requestId, status) => {
    try {
      await teamService.manageRequest(requestId, status);
      setActionMessage(`Candidate request has been marked as ${status}.`);
      fetchTeamDetails();
    } catch (err) {
      console.error('Failed to decide request:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Team not found</h2>
        <Link to="/teams" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Team Finder
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <Link
        to="/teams"
        className="flex items-center gap-1"
        style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '500' }}
      >
        <ArrowLeft size={16} /> Back to all teams
      </Link>

      {requestSuccess && (
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
          <span>Your join request has been delivered to the team leader!</span>
        </div>
      )}

      {actionMessage && (
        <div
          className="flex items-center gap-2"
          style={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}
        >
          <Sparkles size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Team Info Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span
            className={`badge ${
              team.status === 'recruiting' ? 'badge-success' : 'badge-neutral'
            }`}
            style={{ fontSize: '0.875rem', padding: '0.35rem 0.85rem' }}
          >
            {team.status === 'recruiting'
              ? `${team.openPositions} of ${team.totalPositions} Positions Open`
              : 'Team Recruitment Complete'}
          </span>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Created {new Date(team.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{team.title}</h1>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Project Mission & Goals</h3>
          <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-line' }}>
            {team.description}
          </p>
        </div>

        {/* Required Skills */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Target Technical Stack</h3>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {team.requiredSkills?.map((skill, index) => (
              <span key={index} className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Members List */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
            Confirmed Team Roster ({team.members?.length || 1} / {team.totalPositions})
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {team.members?.map((member) => (
              <div
                key={member._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={member.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${member._id}`}
                      style={{ fontWeight: '600', color: 'var(--text-primary)' }}
                    >
                      {member.name}
                    </Link>
                    {member._id === team.leaderId?._id && (
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                        Leader
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {member.college || 'Collegiate Developer'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leader Requests Management Section */}
      {(isLeader || user?.role === 'admin') && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} color="var(--primary)" /> Incoming Membership Requests ({requests.length})
            </h3>
            {actionMessage && (
              <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                {actionMessage}
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No candidates have applied to join this team yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {requests.map((req) => (
                <div
                  key={req._id}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div className="flex items-center gap-3">
                      <img
                        src={req.studentId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={req.studentId?.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <Link
                          to={`/profile/${req.studentId?._id}`}
                          style={{ fontWeight: '600', color: 'var(--text-primary)' }}
                        >
                          {req.studentId?.name}
                        </Link>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {req.studentId?.college || 'Collegiate Developer'} • Applied on {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          req.status === 'accepted'
                            ? 'badge-success'
                            : req.status === 'rejected'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                        style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}
                      >
                        {req.status}
                      </span>
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleDecision(req._id, 'accepted')}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                            disabled={team.openPositions <= 0}
                          >
                            <CheckCircle2 size={14} /> Accept
                          </button>
                          <button
                            onClick={() => handleDecision(req._id, 'rejected')}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                          >
                            <XCircle size={14} /> Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                    &ldquo;{req.message}&rdquo;
                  </p>

                  {req.studentId?.skills && req.studentId.skills.length > 0 && (
                    <div className="flex gap-1" style={{ marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      {req.studentId.skills.map((s, idx) => (
                        <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Join Request Form for non-members */}
      {isAuthenticated && !isLeader && !isMember && team.status === 'recruiting' && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Interested in Joining this Team?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Send a direct request to the team leader explaining how your technical skills match their project vision.
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

          <form onSubmit={handleSendRequest}>
            <div className="form-group">
              <label className="form-label">Pitch Message *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Hi! I have experience with React and Node.js. I would love to build the authentication and database architecture for your team..."
                required
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submittingRequest}>
              <Send size={16} /> {submittingRequest ? 'Sending Request...' : 'Send Join Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamDetailsPage;
