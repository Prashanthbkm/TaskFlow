import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { TaskProvider } from './contexts/TaskContext.jsx';
import './index.css'; 

// Layout Components
import Layout from './components/layout/Layout.jsx';

// Auth Pages
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Tasks from './pages/tasks/Tasks.jsx';
import Kanban from './pages/tasks/Kanban.jsx';

// Add these imports for the new pages
import Calendar from './pages/tasks/Calendar.jsx';
import Analytics from './pages/tasks/Analytics.jsx';
import Settings from './pages/tasks/Settings.jsx';

// Protected Route
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="kanban" element={<Kanban />} />
              {/* Add the new routes */}
              <Route path="tasks/calendar" element={<Calendar />} />
              <Route path="tasks/analytics" element={<Analytics />} />
              <Route path="tasks/settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;