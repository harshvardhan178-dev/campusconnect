import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard,
  Compass,
  Users,
  Code,
  FileText,
  Bookmark,
  Bell,
  User,
  Settings,
  PlusCircle,
  ShieldCheck,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/opportunities', label: 'Explore Opportunities', icon: Compass },
    { to: '/teams', label: 'Find Teammates', icon: Users },
    { to: '/projects', label: 'Project Showcase', icon: Code },
    { to: '/dashboard#applications', label: 'My Applications', icon: FileText },
    { to: '/teams?my=true', label: 'My Teams', icon: Users },
    { to: '/opportunities?bookmarked=true', label: 'Bookmarks', icon: Bookmark },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: `/profile/${user?._id || user?.id}`, label: 'My Profile', icon: User },
    { to: `/profile/${user?._id || user?.id}#settings`, label: 'Settings', icon: Settings },
  ];

  const navItemClass = ({ isActive }) =>
    `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: collapsed ? '80px' : '260px',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          minHeight: 'calc(100vh - 68px)',
          padding: '1.25rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s ease',
          position: 'relative',
          zIndex: 95,
        }}
      >
        <div>
          {/* Collapse Toggle (Desktop) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              padding: '0 0.5rem 1rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1rem',
            }}
          >
            {!collapsed && (
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Navigation
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="desktop-collapse-btn"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={closeMobileSidebar}
                  className={navItemClass}
                  title={collapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge > 0 && (
                    <span
                      style={{
                        backgroundColor: 'var(--error)',
                        color: '#fff',
                        borderRadius: '9999px',
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.45rem',
                        fontWeight: '700',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Actions / Shortcuts */}
          <div style={{ marginTop: '1.75rem' }}>
            {!collapsed && (
              <div
                style={{
                  padding: '0 0.5rem 0.5rem',
                  fontSize: '0.725rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Quick Actions
              </div>
            )}

            <div className="flex flex-col gap-1">
              <NavLink
                to="/teams/create"
                onClick={closeMobileSidebar}
                title={collapsed ? 'Create Team' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--accent-primary)',
                  backgroundColor: 'var(--accent-glow)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                <PlusCircle size={17} style={{ flexShrink: 0 }} />
                {!collapsed && <span>Create Team</span>}
              </NavLink>

              {user?.role === 'organizer' && (
                <NavLink
                  to="/opportunities/create"
                  onClick={closeMobileSidebar}
                  title={collapsed ? 'Post Opportunity' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--accent-secondary)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                  }}
                >
                  <FolderPlus size={17} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>Post Opportunity</span>}
                </NavLink>
              )}

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileSidebar}
                  title={collapsed ? 'Admin Console' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--warning)',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                  }}
                >
                  <ShieldCheck size={17} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>Admin Console</span>}
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Bottom User Card / Status */}
        {!collapsed && user && (
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              marginTop: '1rem',
            }}
          >
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success)',
                  boxShadow: '0 0 6px var(--success)',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Atlas Live Sync
              </span>
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.2rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.college || 'Campus Member'}
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
