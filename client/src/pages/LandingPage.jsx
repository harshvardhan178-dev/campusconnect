import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, Code, ArrowRight, CheckCircle2, Sparkles, Award, Shield, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', transition: 'background-color 0.25s ease' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(ellipse at top, var(--accent-glow) 0%, var(--bg-primary) 70%)',
          padding: '6rem 0 5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '880px' }}>
          <div
            className="badge badge-primary"
            style={{
              padding: '0.45rem 1.15rem',
              fontSize: '0.85rem',
              marginBottom: '1.75rem',
              display: 'inline-flex',
            }}
          >
            <Sparkles size={16} /> The #1 Collegiate Opportunity & Team Discovery Platform
          </div>

          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
            }}
          >
            Discover Opportunities. Build Teams.{' '}
            <span style={{ color: 'var(--accent-primary)' }}>Showcase Your Code.</span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
            }}
          >
            CampusConnect bridges the gap between ambitious students, hackathon teammates, internships,
            and software showcases. Never work on a project alone again.
          </p>

          <div className="flex items-center justify-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}
            >
              Get Started for Free <ArrowRight size={18} />
            </Link>
            <Link
              to="/opportunities"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}
            >
              Explore Opportunities
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div
            className="grid grid-cols-3 gap-6"
            style={{
              marginTop: '4.5rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div>
              <h3 style={{ fontSize: '2.25rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                500+
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Active Opportunities
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.25rem', color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>
                1,200+
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Collaborative Teams
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.25rem', color: 'var(--success)', marginBottom: '0.25rem' }}>
                95%
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Hackathon Match Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Breakdown */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Built for Modern Collegiate Engineers
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              A single platform designed specifically to replace messy chat groups and scattered
              job portals with structured networking.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent-glow)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Opportunity Discovery
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Filter curated internships, collegiate hackathons, workshops, and coding challenges by
                required tech stack, location, and upcoming deadlines.
              </p>
              <Link to="/opportunities" className="flex items-center gap-1" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                Browse Feed <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--accent-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Team Finder Engine
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Form hackathon teams by specifying technical needs (e.g. React + PyTorch), open position counters,
                and accept candidate pitches with one click.
              </p>
              <Link to="/teams" className="flex items-center gap-1" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                Find Teammates <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="card card-interactive">
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Code size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Project Showcase
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                Publish capstone projects and open-source demos. Display GitHub repositories, live demo links,
                and receive community peer endorsements.
              </p>
              <Link to="/projects" className="flex items-center gap-1" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                Explore Showcase <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Personas */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Tailored for Every Campus Role
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Dedicated workflows customized for students, club organizers, and faculty administrators.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                For Students
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Apply with resume & SOP
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Recruit project teammates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Verified skill endorsements
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
                For Organizers
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Post hackathons & internships
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Review student applicant resumes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Update application status
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--warning)' }}>
                For Administrators
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Campus-wide metrics & telemetry
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Moderation & user management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="var(--success)" /> Content safety controls
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
