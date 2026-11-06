import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// All 16 Application Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailsPage from './pages/OpportunityDetailsPage';
import CreateOpportunityPage from './pages/CreateOpportunityPage';
import TeamFinderPage from './pages/TeamFinderPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import CreateTeamPage from './pages/CreateTeamPage';
import ProjectShowcasePage from './pages/ProjectShowcasePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Authenticated Application & Module Routes */}
          <Route element={<DashboardLayout />}>
            {/* Student Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Profile */}
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Opportunities Module */}
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/opportunities/:id" element={<OpportunityDetailsPage />} />
            <Route
              path="/opportunities/create"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <CreateOpportunityPage />
                </ProtectedRoute>
              }
            />

            {/* Team Finder Module */}
            <Route path="/teams" element={<TeamFinderPage />} />
            <Route path="/teams/:id" element={<TeamDetailsPage />} />
            <Route
              path="/teams/create"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CreateTeamPage />
                </ProtectedRoute>
              }
            />

            {/* Project Showcase Module */}
            <Route path="/projects" element={<ProjectShowcasePage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />

            {/* Notifications Module */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Console Module */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);
}

export default App;
