import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar
        toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        sidebarOpen={mobileSidebarOpen}
      />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar
          isMobileOpen={mobileSidebarOpen}
          closeMobileSidebar={() => setMobileSidebarOpen(false)}
        />
        <main
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-primary)',
            padding: '2rem',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 68px)',
            transition: 'background-color 0.25s ease',
          }}
        >
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
