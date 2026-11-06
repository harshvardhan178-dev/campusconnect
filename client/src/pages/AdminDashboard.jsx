import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import {
  ShieldCheck,
  Users,
  Compass,
  Code,
  FileCheck,
  UserX,
  UserCheck,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, usersRes] = await Promise.all([
        adminService.getMetrics(),
        adminService.getUsers({ limit: 15 }),
      ]);

      if (metricsRes?.data) setData(metricsRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminService.updateUserStatus(userId, { isActive: !currentStatus });
      setActionMsg(`User account status updated.`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
      );
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

  const metrics = data?.metrics || {};

  return (
    <div>
      {/* Top Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: '2rem' }}>Administrator Command Center</h1>
            <span className="badge badge-danger">Restricted Access</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            System-wide operational metrics, user governance, and platform content moderation
          </p>
        </div>

        <button onClick={fetchAdminData} className="btn btn-secondary">
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {actionMsg && (
        <div
          className="card"
          style={{
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontWeight: '600',
          }}
        >
          {actionMsg}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem' }}>{metrics.totalUsers || 0}</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Registered Users ({metrics.totalStudents || 0} Students)
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem' }}>
              {metrics.totalOpportunities || 0}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Active Opportunities
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
            }}
          >
            <Code size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem' }}>{metrics.totalTeams || 0}</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Formed Teams
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning)',
            }}
          >
            <FileCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.1rem' }}>
              {metrics.totalProjects || 0}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Showcase Projects
            </p>
          </div>
        </div>
      </div>

      {/* User Governance Table */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>User Account Moderation</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>User</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>College</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                      alt={u.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <span style={{ fontWeight: '600' }}>{u.name}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-primary">{u.role}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.college || '—'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${u.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                      {u.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleToggleUserStatus(u._id, u.isActive !== false)}
                      className={`btn ${u.isActive !== false ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      {u.isActive !== false ? 'Suspend User' : 'Restore User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
