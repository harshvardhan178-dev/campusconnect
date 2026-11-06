import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import opportunityService from '../services/opportunityService';
import { PlusCircle, AlertCircle } from 'lucide-react';

const CreateOpportunityPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'hackathon',
    locationType: 'remote',
    location: 'Online',
    organizationName: '',
    deadline: '',
    requiredSkills: '',
    rewardOrStipend: '$5,000 Cash Pool & Mentorship',
    applyLink: '',
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
        deadline: new Date(formData.deadline),
      };

      const res = await opportunityService.create(payload);
      if (res?.data) {
        navigate(`/opportunities/${res.data._id}`);
      } else {
        navigate('/opportunities');
      }
    } catch (err) {
      setError(err.message || 'Failed to publish opportunity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>Post New Student Opportunity</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Publish an internship, hackathon, workshop, or competition to collegiate students
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
            <label className="form-label">Opportunity Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. National Collegiate AI Hackathon 2026"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="hackathon">Hackathon</option>
                <option value="internship">Internship</option>
                <option value="workshop">Workshop</option>
                <option value="competition">Coding Competition</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Organization / Company Name *</label>
              <input
                type="text"
                name="organizationName"
                className="form-input"
                placeholder="e.g. Google Cloud Student Chapter"
                required
                value={formData.organizationName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Work Mode / Type *</label>
              <select
                name="locationType"
                className="form-select"
                value={formData.locationType}
                onChange={handleChange}
              >
                <option value="remote">Remote / Virtual</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location / City</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. San Francisco or Online"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline *</label>
              <input
                type="date"
                name="deadline"
                className="form-input"
                required
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (comma separated) *</label>
            <input
              type="text"
              name="requiredSkills"
              className="form-input"
              placeholder="React, Python, Machine Learning, Docker, Node.js"
              required
              value={formData.requiredSkills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reward / Stipend / Compensation</label>
            <input
              type="text"
              name="rewardOrStipend"
              className="form-input"
              placeholder="e.g. $10,000 Cash Pool or $3,000/mo stipend"
              value={formData.rewardOrStipend}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Opportunity Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows={6}
              placeholder="Describe the opportunity objectives, guidelines, timeline, judging criteria, eligibility, and perks..."
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 justify-end" style={{ marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/opportunities')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunityPage;
