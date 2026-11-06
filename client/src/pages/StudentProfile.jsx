import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import {
  User,
  GraduationCap,
  Github,
  Linkedin,
  Edit3,
  CheckCircle2,
  Camera,
  ExternalLink,
  Code,
} from 'lucide-react';

const StudentProfile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();

  const isOwnProfile = !id || id === currentUser?._id || id === currentUser?.id;
  const targetId = isOwnProfile ? currentUser?._id || currentUser?.id : id;

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    degree: '',
    graduationYear: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    skills: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (targetId) {
          const res = await userService.getProfile(targetId);
          if (res?.user) {
            setProfile(res.user);
            setProjects(res.projects || []);
            setEditForm({
              name: res.user.name || '',
              college: res.user.college || '',
              degree: res.user.degree || '',
              graduationYear: res.user.graduationYear || '',
              bio: res.user.bio || '',
              githubUrl: res.user.githubUrl || '',
              linkedinUrl: res.user.linkedinUrl || '',
              skills: (res.user.skills || []).join(', '),
            });
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetId]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...editForm,
        skills: editForm.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        graduationYear: editForm.graduationYear ? parseInt(editForm.graduationYear) : null,
      };

      const res = await userService.updateProfile(payload);
      if (res?.user) {
        setProfile(res.user);
        updateUser(res.user);
        setIsEditing(false);
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await userService.uploadAvatar(formData);
      if (res?.avatar) {
        setProfile((prev) => ({ ...prev, avatar: res.avatar }));
        updateUser({ avatar: res.avatar });
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {message && (
        <div
          className="flex items-center gap-2"
          style={{
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontWeight: '500',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="flex items-center gap-6" style={{ flexWrap: 'wrap' }}>
            {/* Avatar with Upload Trigger */}
            <div style={{ position: 'relative' }}>
              <img
                src={profile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={profile?.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary-light)',
                }}
              />
              {isOwnProfile && (
                <label
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  title="Upload profile picture"
                >
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex items-center gap-3">
                <h1 style={{ fontSize: '1.75rem' }}>{profile?.name}</h1>
                <span className="badge badge-primary">{profile?.role}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.25rem 0' }}>
                {profile?.college || 'No college specified'}
              </p>
              {profile?.degree && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <GraduationCap size={15} /> {profile?.degree}{' '}
                  {profile?.graduationYear && `(Class of ${profile?.graduationYear})`}
                </p>
              )}
            </div>
          </div>

          {/* Social Links & Edit Button */}
          <div className="flex items-center gap-3">
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <Github size={18} /> GitHub
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <Linkedin size={18} /> LinkedIn
              </a>
            )}

            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem' }}
              >
                <Edit3 size={16} /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && !isEditing && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>About</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              {profile.bio}
            </p>
          </div>
        )}

        {/* Technical Skills Badges */}
        {profile?.skills && profile.skills.length > 0 && !isEditing && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Technical Skills</h4>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary"
                  style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Form Modal/Drawer Area */}
      {isEditing && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderColor: 'var(--primary)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Edit Your Profile Information</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Degree</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. B.Tech Computer Science"
                  value={editForm.degree}
                  onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.graduationYear}
                  onChange={(e) => setEditForm({ ...editForm, graduationYear: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GitHub Profile URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/username"
                  value={editForm.githubUrl}
                  onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                  value={editForm.linkedinUrl}
                  onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Skills (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="React, Node.js, Express, MongoDB, Python, Docker"
                value={editForm.skills}
                onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio (Up to 500 characters)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Tell the community about your interests, project ambitions, and engineering passions..."
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Published Projects Showcase */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={20} color="var(--primary)" /> Published Projects ({projects.length})
          </h3>
        </div>

        {projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No projects showcased yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj._id} className="card">
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{proj.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {proj.description}
                </p>
                <div className="flex gap-1" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {proj.technologies?.map((tech, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {proj.githubRepo && (
                    <a
                      href={proj.githubRepo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <Github size={14} /> Repository
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a
                      href={proj.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <ExternalLink size={14} /> Live App
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
