import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  CheckCircle,
  Clock,
  ExternalLink,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';

const NotificationsPage = () => {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Notification Inbox</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time updates regarding your team requests, applications, and announcements
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button onClick={markAllAsRead} className="btn btn-secondary">
            <CheckCircle size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Bell size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Inbox is completely clear</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            You will be notified whenever someone requests to join your team or updates an application status.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="card flex items-center justify-between"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: notif.isRead ? 'var(--bg-surface)' : 'var(--primary-light)',
                borderColor: notif.isRead ? 'var(--border-subtle)' : '#c7d2fe',
              }}
            >
              <div className="flex items-center gap-4" style={{ flex: 1 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: notif.isRead ? 'var(--bg-subtle)' : '#fff',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {notif.type === 'team_request' ? (
                    <Users size={20} />
                  ) : notif.type === 'application_update' ? (
                    <Compass size={20} />
                  ) : (
                    <Sparkles size={20} />
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                    {notif.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {notif.link && (
                  <Link
                    to={notif.link}
                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    View <ExternalLink size={14} />
                  </Link>
                )}

                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    title="Mark Read"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
