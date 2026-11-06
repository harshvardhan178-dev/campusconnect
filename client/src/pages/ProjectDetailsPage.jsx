import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import {
  Code,
  Github,
  ExternalLink,
  Heart,
  ArrowLeft,
  Calendar,
  User,
  GraduationCap,
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await projectService.getById(id);
        if (res?.data) {
          setProject(res.data);
        }
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await projectService.toggleLike(id);
      setProject((prev) => {
        const userId = user?._id || user?.id;
        const updatedLikes = res.liked
          ? [...(prev.likes || []), userId]
          : (prev.likes || []).filter((l) => (l._id || l) !== userId);
        return { ...prev, likes: updatedLikes };
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Project not found</h2>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Showcase
        </Link>
      </div>
    );
  }

  const hasLiked =
    isAuthenticated &&
    project.likes?.some((l) => (l._id || l) === (user?._id || user?.id));

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <Link
        to="/projects"
        className="flex items-center gap-1"
        style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '500' }}
      >
        <ArrowLeft size={16} /> Back to Project Showcase
      </Link>

      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
        <img
          src={
            project.screenshotUrl ||
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'
          }
          alt={project.title}
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
        />

        <div style={{ padding: '2.5rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '2.25rem' }}>{project.title}</h1>

            <button
              onClick={handleLike}
              className="btn btn-secondary"
              style={{
                color: hasLiked ? 'var(--danger)' : 'var(--text-secondary)',
                borderColor: hasLiked ? 'var(--danger)' : 'var(--border-subtle)',
              }}
            >
              <Heart size={18} fill={hasLiked ? 'var(--danger)' : 'none'} />
              <span>{project.likes?.length || 0} Likes</span>
            </button>
          </div>

          <div className="flex items-center gap-4" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
            {project.githubRepo && (
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                <Github size={18} /> View GitHub Repository
              </a>
            )}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={18} /> Launch Live Application
              </a>
            )}
          </div>

          {/* Description */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>About the Project</h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Tech Stack & Libraries</h3>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {project.technologies?.map((tech, index) => (
                <span key={index} className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Author Card */}
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              src={project.ownerId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={project.ownerId?.name}
              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Engineered by:</p>
              <Link
                to={`/profile/${project.ownerId?._id}`}
                style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}
              >
                {project.ownerId?.name}
              </Link>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {project.ownerId?.college || 'Student Developer'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
