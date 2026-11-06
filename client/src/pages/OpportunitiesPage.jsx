import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import opportunityService from '../services/opportunityService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Calendar,
  MapPin,
  Bookmark,
  Briefcase,
  ArrowRight,
  PlusCircle,
  Building,
  CheckCircle2,
} from 'lucide-react';

const OpportunitiesPage = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkAlert, setBookmarkAlert] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [locationType, setLocationType] = useState('all');

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'internship', label: 'Internships' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'competition', label: 'Competitions' },
  ];

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await opportunityService.getAll({
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        locationType: locationType !== 'all' ? locationType : undefined,
      });

      if (res?.data) {
        setOpportunities(res.data);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOpportunities();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, locationType]);

  const handleBookmark = async (id, title) => {
    try {
      await userService.toggleBookmarkOpportunity(id);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      setBookmarkAlert(`Bookmark updated for "${title}"`);
      setTimeout(() => setBookmarkAlert(null), 3000);
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
            Opportunity Discovery Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Discover tech internships, hackathons, workshops, and algorithmic coding challenges.
          </p>
        </div>

        {user?.role === 'organizer' && (
          <Link to="/opportunities/create" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem' }}>
            <PlusCircle size={18} /> Post Opportunity
          </Link>
        )}
      </div>

      {bookmarkAlert && (
        <div
          className="flex items-center gap-2"
          style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            border: '1px solid var(--success-border)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{bookmarkAlert}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {categories.map((tab) => {
          const isSelected = category === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
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
        {/* Search Input */}
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
            placeholder="Search by title, organization, or required tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Location Filter */}
        <div style={{ minWidth: '160px' }}>
          <select
            className="form-select"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-Site</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Briefcase size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No opportunities found
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <div key={opp._id} className="card card-interactive flex flex-col justify-between" style={{ padding: '1.75rem' }}>
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                  <span
                    className={`badge ${
                      opp.category === 'hackathon'
                        ? 'badge-primary'
                        : opp.category === 'internship'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}
                  >
                    {opp.category}
                  </span>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} /> Deadline: {new Date(opp.deadline).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                  <Link to={`/opportunities/${opp._id}`} style={{ color: 'var(--text-primary)' }}>
                    {opp.title}
                  </Link>
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={14} /> {opp.organizationName} • {opp.locationType} ({opp.location})
                </p>

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
                  {opp.description}
                </p>

                {/* Skills Required */}
                <div className="flex gap-1" style={{ flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {opp.requiredSkills?.map((skill, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      {skill}
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
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  {opp.rewardOrStipend}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBookmark(opp._id, opp.title)}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.65rem' }}
                    title="Bookmark Opportunity"
                  >
                    <Bookmark
                      size={16}
                      fill={bookmarkedIds.has(opp._id) ? 'var(--accent-primary)' : 'none'}
                      color={bookmarkedIds.has(opp._id) ? 'var(--accent-primary)' : 'currentColor'}
                    />
                  </button>

                  <Link
                    to={`/opportunities/${opp._id}`}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    Apply Now <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;
