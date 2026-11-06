import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamService from '../services/teamService';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';

const TeamFinderPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [status, setStatus] = useState('all');

  const popularSkills = ['All Skills', 'React', 'Node.js', 'Python', 'Machine Learning', 'UI/UX', 'Cloud'];

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await teamService.getAll({
        search: search || undefined,
        skill: skill && skill !== 'All Skills' ? skill : undefined,
        status: status !== 'all' ? status : undefined,
      });

      if (res?.data) {
        setTeams(res.data);
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTeams();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, skill, status]);

  return (
    <div>
      {/* Top Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
            Project Team Finder
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Find compatible teammates with complementary skills for hackathons and academic capstones.
          </p>
        </div>

        {isAuthenticated && user?.role === 'student' && (
          <Link to="/teams/create" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
            <PlusCircle size={18} /> Create Project Team
          </Link>
        )}
      </div>

      {/* Skill Quick Pills */}
      <div className="flex gap-2" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {popularSkills.map((s) => {
          const isSelected = (!skill && s === 'All Skills') || skill === s;
          return (
            <button
              key={s}
              onClick={() => setSkill(s === 'All Skills' ? '' : s)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isSelected ? 'var(--accent-secondary)' : 'var(--border-color)',
                backgroundColor: isSelected ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search teams by project title, description, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ minWidth: '160px' }}>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="recruiting">Recruiting Members</option>
            <option value="full">Team Full</option>
          </select>
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : teams.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Users size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No project teams found
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Be the first to create a team and start recruiting campus collaborators!
          </p>
          <Link to="/teams/create" className="btn btn-primary">
            <PlusCircle size={16} /> Create Team Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="card card-interactive flex flex-col justify-between"
              style={{ padding: '1.75rem' }}
            >
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                  <span
                    className={`badge ${
                      team.status === 'recruiting' ? 'badge-success' : 'badge-neutral'
                    }`}
                  >
                    {team.status === 'recruiting'
                      ? `${team.openPositions} Slots Open`
                      : 'Team Full'}
                  </span>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Total: {team.totalPositions} Members
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  <Link to={`/teams/${team._id}`} style={{ color: 'var(--text-primary)' }}>
                    {team.title}
                  </Link>
                </h3>

                {/* Leader Profile Badge */}
                <div className="flex items-center gap-2" style={{ marginBottom: '0.85rem' }}>
                  <img
                    src={
                      team.leaderId?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={team.leaderId?.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Led by{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {team.leaderId?.name || 'Student Lead'}
                    </strong>
                    {team.leaderId?.college ? ` • ${team.leaderId.college}` : ''}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {team.description}
                </p>

                {/* Tech Stack Required */}
                <div className="flex gap-1" style={{ flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {team.requiredSkills?.map((skillItem, idx) => (
                    <span key={idx} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      {skillItem}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '-4px',
                    }}
                  >
                    {team.members?.slice(0, 3).map((m, idx) => (
                      <img
                        key={idx}
                        src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt=""
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: '2px solid var(--bg-card)',
                          marginLeft: idx > 0 ? '-6px' : '0',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {team.members?.length || 1} joined
                  </span>
                </div>

                <Link
                  to={`/teams/${team._id}`}
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  Join Request <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamFinderPage;
