import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '3rem 0 2rem',
        marginTop: 'auto',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Campus<span style={{ color: 'var(--accent-primary)' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The collegiate opportunity discovery, hackathon teammate recruitment, and verified portfolio platform.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Explore</h4>
            <div className="flex flex-col gap-2" style={{ fontSize: '0.875rem' }}>
              <Link to="/opportunities" style={{ color: 'var(--text-secondary)' }}>Internships</Link>
              <Link to="/opportunities" style={{ color: 'var(--text-secondary)' }}>Hackathons</Link>
              <Link to="/teams" style={{ color: 'var(--text-secondary)' }}>Project Teams</Link>
              <Link to="/projects" style={{ color: 'var(--text-secondary)' }}>Project Showcase</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Community</h4>
            <div className="flex flex-col gap-2" style={{ fontSize: '0.875rem' }}>
              <Link to="/teams/create" style={{ color: 'var(--text-secondary)' }}>Create Team</Link>
              <Link to="/opportunities/create" style={{ color: 'var(--text-secondary)' }}>Post Opportunity</Link>
              <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}>Student Hub</Link>
              <Link to="/notifications" style={{ color: 'var(--text-secondary)' }}>Alerts & Activity</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Architecture</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Built with React 18, Node.js, Express, and MongoDB Atlas.
            </p>
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">MERN Stack</span>
              <span className="badge badge-success">Atlas Live</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <p>© {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed for ambitious collegiate developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
