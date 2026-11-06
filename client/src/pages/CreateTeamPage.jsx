import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import teamService from '../services/teamService';
import { Users, AlertCircle } from 'lucide-react';

const CreateTeamPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    totalPositions: 4,
    visibility: 'public',
    contactDiscordOrSlack: '',
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
        requiredSkills: formData.requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        totalPositions: parseInt(formData.totalPositions) || 4,
      };

      const res = await teamService.create(payload);
      if (res?.data) {
        navigate(`/teams/${res.data._id}`);
      } else {
        navigate('/teams');
      }
    } catch (err) {
      setError(err.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Create a Project Team</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Start recruiting students with complementary skills for your hackathon idea or capstone project
          </p>
        </div>

        {error && (
          <div
            className="flex items-center gap-2"
            style={{
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project / Team Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. AI-Powered Healthcare Diagnostic System"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Total Team Size (including yourself) *</label>
              <input
                type="number"
                name="totalPositions"
                className="form-input"
                min={2}
                max={10}
                required
                value={formData.totalPositions}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                You will be team leader + {formData.totalPositions - 1} open recruitment slots
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Team Visibility</label>
              <select
                name="visibility"
                className="form-select"
                value={formData.visibility}
                onChange={handleChange}
              >
                <option value="public">Public (Visible on Team Finder Feed)</option>
                <option value="private">Private (Invite Link Only)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Technical Skills (comma separated) *</label>
            <input
              type="text"
              name="requiredSkills"
              className="form-input"
              placeholder="e.g. PyTorch, React, Node.js, UI/UX Design, Docker"
              required
              value={formData.requiredSkills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Handle / Community Link</label>
            <input
              type="text"
              name="contactDiscordOrSlack"
              className="form-input"
              placeholder="e.g. discord.gg/team-room or @username"
              value={formData.contactDiscordOrSlack}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Mission & Team Goals *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={5}
              placeholder="Describe what you are building, the problem it solves, which hackathon you are competing in, and what specific responsibilities open roles will have..."
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 justify-end" style={{ marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/teams')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Team...' : 'Form Team & Open Recruitment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamPage;
