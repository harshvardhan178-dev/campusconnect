import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import opportunityService from '../services/opportunityService';
import teamService from '../services/teamService';
import projectService from '../services/projectService';
import {
  Sparkles,
  Compass,
  Users,
  Code,
  FileText,
  ArrowRight,
  Calendar,
  Briefcase,
  Award,
  CheckCircle2,
  Clock,
  PlusCircle,
  ExternalLink,
  Zap,
  Building,
  MapPin,
  TrendingUp,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  const [opportunities, setOpportunities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compute profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 50;
    let score = 20; // Base signup
    if (user.name) score += 15;
    if (user.college) score += 15;
    if (user.degree) score += 10;
    if (user.bio) score += 10;
    if (user.skills && user.skills.length > 0) score += 15;
    if (user.githubUrl || user.linkedinUrl) score += 15;
    return Math.min(100, score);
  };

  const completionPercent = calculateProfileCompletion();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [oppsRes, teamsRes, projRes] = await Promise.all([
          opportunityService.getAll({ status: 'open' }),
          teamService.getAll({ status: 'recruiting' }),
          projectService.getAll(),
        ]);

        if (oppsRes?.data) setOpportunities(oppsRes.data);
        if (teamsRes?.data) setTeams(teamsRes.data);
        if (projRes?.data) setProjectsCount(projRes.data.length);

        // Fetch applications if student
        if (user?.role === 'student') {
          try {
            const appsRes = await opportunityService.getMyApplications();
            if (appsRes?.data) setMyApplications(appsRes.data);
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <div className="spinner" style={{ width: '42px', height: '42px' }} />
      </div>
    );
  }

  return (
    <div>
      {/* 1. Welcome Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '2.25rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, var(--accent-glow-strong) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1.5rem', position: 'relative' }}>
          <div>
            <div
              className="badge badge-primary"
              style={{
                marginBottom: '0.85rem',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
              }}
            >
              <Sparkles size={14} /> Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}!
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Student Innovation Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', maxWidth: '620px' }}>
              {user?.college ? `${user.college} • ` : ''}Discover curated tech hackathons, collaborate with collegiate developers, and showcase verified software engineering projects.
            </p>
          </div>

          <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
            <Link
              to="/teams/create"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.4rem' }}
            >
              <PlusCircle size={18} /> Create Team
            </Link>
            <Link
              to="/opportunities"
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.4rem' }}
            >
              <Compass size={18} /> Find Hackathons
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--accent-primary)',
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem', color: 'var(--text-primary)' }}>
              {opportunities.length}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Total Opportunities
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--accent-secondary)',
            }}
          >
            <FileText size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem', color: 'var(--text-primary)' }}>
              {myApplications.length}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Applications Submitted
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem', color: 'var(--text-primary)' }}>
              {teams.length}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Active Project Teams
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning)',
            }}
          >
            <Code size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem', color: 'var(--text-primary)' }}>
              {projectsCount}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Projects Published
            </p>
          </div>
        </div>
      </div>

      {/* 3. Profile Completion Banner */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div style={{ flex: '1', minWidth: '240px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Profile Completion
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              {completionPercent}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${completionPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                borderRadius: '9999px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        <Link
          to={`/profile/${user?._id || user?.id}`}
          className="btn btn-outline"
          style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
        >
          Complete Profile
        </Link>
      </div>

      {/* 4. Split Section: Recommended Opportunities & Available Teams */}
      <div className="grid grid-cols-2 gap-8" style={{ marginBottom: '2.5rem' }}>
        {/* Left Column: Recommended Opportunities */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--accent-primary)" /> Recommended Opportunities
            </h3>
            <Link
              to="/opportunities"
              className="flex items-center gap-1"
              style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-primary)' }}
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {opportunities.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No open opportunities right now.</p>
              </div>
            ) : (
              opportunities.slice(0, 3).map((opp) => (
                <div key={opp._id} className="card card-interactive" style={{ padding: '1.35rem' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary">{opp.category}</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Calendar size={13} /> {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                    <Link to={`/opportunities/${opp._id}`} style={{ color: 'var(--text-primary)' }}>
                      {opp.title}
                    </Link>
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                    <Building size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> {opp.organizationName} • {opp.locationType}
                  </p>

                  <div className="flex items-center justify-between" style={{ marginTop: '0.75rem' }}>
                    <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                      {opp.requiredSkills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/opportunities/${opp._id}`}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Available Project Teams */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--accent-secondary)" /> Recruiting Project Teams
            </h3>
            <Link
              to="/teams"
              className="flex items-center gap-1"
              style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-secondary)' }}
            >
              Explore Teams <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {teams.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No teams are recruiting right now.</p>
              </div>
            ) : (
              teams.slice(0, 3).map((team) => (
                <div key={team._id} className="card card-interactive" style={{ padding: '1.35rem' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                    <span className="badge badge-success">
                      {team.openPositions} {team.openPositions === 1 ? 'Slot Open' : 'Slots Open'}
                    </span>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      Lead by {team.leaderId?.name?.split(' ')[0] || 'Leader'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                    <Link to={`/teams/${team._id}`} style={{ color: 'var(--text-primary)' }}>
                      {team.title}
                    </Link>
                  </h4>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.85rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {team.description}
                  </p>

                  <div className="flex items-center justify-between" style={{ marginTop: '0.75rem' }}>
                    <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                      {team.requiredSkills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/teams/${team._id}`}
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      Join Team
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
