import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import {
  Code,
  Search,
  Heart,
  Github,
  ExternalLink,
  PlusCircle,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

const ProjectShowcasePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const [search, setSearch] = useState('');
  const [tech, setTech] = useState('all');

  // New Project Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubRepo: '',
    liveDemo: '',
    screenshotUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getAll({
        search: search || undefined,
        tech: tech !== 'all' ? tech : undefined,
      });

      if (res?.data) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, tech]);

  const handleLike = async (id) => {
    if (!isAuthenticated) return;
    try {
      const res = await projectService.toggleLike(id);
      setProjects((prev) =>
        prev.map((p) => {
          if (p._id === id) {
            const userId = user?._id || user?.id;
            const updatedLikes = res.liked
              ? [...(p.likes || []), userId]
              : (p.likes || []).filter((l) => (l._id || l) !== userId);
            return { ...p, likes: updatedLikes };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Like toggle failed:', err);
    }
  };

  const handleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await projectService.create(payload);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubRepo: '',
        liveDemo: '',
        screenshotUrl: '',
      });
      fetchProjects();
    } catch (err) {
      console.error('Publish failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
            Collegiate Project Showcase
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Explore software, web applications, and AI systems built by students from campuses worldwide.
          </p>
        </div>

        {isAuthenticated && user?.role === 'student' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
            <PlusCircle size={18} /> Publish Project
          </button>
        )}
      </div>

      {/* Filter Bar */}
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
            placeholder="Search projects by name, description, or stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ minWidth: '160px' }}>
          <select
            className="form-select"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
          >
            <option value="all">All Tech Stacks</option>
            <option value="react">React</option>
            <option value="node">Node.js</option>
            <option value="python">Python</option>
            <option value="ai">AI / ML</option>
            <option value="docker">Docker</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Code size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No showcase projects found
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Be the first to publish your capstone project or open-source app!
          </p>
          {isAuthenticated && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <PlusCircle size={16} /> Publish Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {projects.map((project) => {
            const userId = user?._id || user?.id;
            const hasLiked = project.likes?.some((l) => (l._id || l) === userId);
            const isBookmarked = bookmarkedIds.has(project._id);

            return (
              <div
                key={project._id}
                className="card card-interactive"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <img
                  src={
                    project.screenshotUrl ||
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={project.title}
                  style={{ width: '100%', height: '210px', objectFit: 'cover' }}
                />

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                      <Link
                        to={`/profile/${project.ownerId?._id}`}
                        className="flex items-center gap-2"
                        style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
                      >
                        <img
                          src={project.ownerId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={project.ownerId?.name}
                          style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: '500' }}>{project.ownerId?.name || 'Student Developer'}</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBookmark(project._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: isBookmarked ? 'var(--accent-primary)' : 'var(--text-muted)',
                            padding: '0.2rem',
                          }}
                          title="Bookmark"
                        >
                          <Bookmark size={16} fill={isBookmarked ? 'var(--accent-primary)' : 'none'} />
                        </button>

                        <button
                          onClick={() => handleLike(project._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: hasLiked ? 'var(--error)' : 'var(--text-muted)',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                          }}
                        >
                          <Heart size={16} fill={hasLiked ? 'var(--error)' : 'none'} />
                          <span>{project.likes?.length || 0}</span>
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                      <Link to={`/projects/${project._id}`} style={{ color: 'var(--text-primary)' }}>
                        {project.title}
                      </Link>
                    </h3>

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
                      {project.description}
                    </p>

                    <div className="flex gap-1" style={{ flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {project.technologies?.map((t, idx) => (
                        <span key={idx} className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {project.githubRepo && (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}
                      >
                        <Github size={15} /> Code Repo
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}
                      >
                        <ExternalLink size={15} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Publish Project Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Publish Showcase Project
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Exhibit your software to campus peers, team leaders, and visiting recruiters.
            </p>

            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. EcoTrack – Carbon Footprint Tracker"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Description *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Explain what the project does, the technical architecture, and impact..."
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies Used (comma separated) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="React, Node.js, MongoDB, PyTorch, Tailwind"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/user/repo"
                    value={formData.githubRepo}
                    onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Live Deployment URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://myproject.vercel.app"
                    value={formData.liveDemo}
                    onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Screenshot / Thumbnail Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.screenshotUrl}
                  onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-3 justify-end" style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish to Showcase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcasePage;
