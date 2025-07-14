import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages (we'll create these next)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import RiskList from './pages/risk/RiskList';
import RiskForm from './pages/risk/RiskForm';
import RiskDetail from './pages/risk/RiskDetail';
import ControlList from './pages/control/ControlList';
import ControlForm from './pages/control/ControlForm';
import RiskMatrix from './pages/RiskMatrix';
import MyItems from './pages/MyItems';
import Assessments from './pages/Assessments';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Risk Management Routes */}
        <Route path="risks" element={<RiskList />} />
        <Route path="risks/new" element={<RiskForm />} />
        <Route path="risks/add" element={<RiskForm />} />
        <Route path="risks/:id" element={<RiskDetail />} />
        <Route path="risks/:id/edit" element={<RiskForm />} />
        
        {/* Control Management Routes */}
        <Route path="controls" element={<ControlList />} />
        <Route path="controls/new" element={<ControlForm />} />
        <Route path="controls/add" element={<ControlForm />} />
        <Route path="controls/:id/edit" element={<ControlForm />} />
        
        {/* Other Protected Routes */}
        <Route path="risk-matrix" element={<RiskMatrix />} />
        <Route path="my-items" element={<MyItems />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        
        {/* L2 Only Routes */}
        <Route path="assessments" element={
          <ProtectedRoute roles={['L2']}>
            <Assessments />
          </ProtectedRoute>
        } />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;