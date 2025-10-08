import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Accounts from './pages/Accounts';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
};

// Layout Wrapper for protected routes only
const LayoutWrapper = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes - NO LAYOUT */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes - WITH LAYOUT */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Dashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Transactions />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-transaction"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <AddTransaction />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Accounts />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

