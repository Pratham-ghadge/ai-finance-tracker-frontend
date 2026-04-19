import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import Accounts from './pages/Accounts';
import AddTransaction from './pages/AddTransaction';
import Dashboard from './pages/Dashboard';
import Imports from './pages/Imports';
import Investments from './pages/Investments';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Analysis from './pages/Analysis';
import Transactions from './pages/Transactions';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return user ? <Navigate replace to="/dashboard" /> : children;
};

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
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
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/accounts" element={<ProtectedLayout><Accounts /></ProtectedLayout>} />
            <Route path="/transactions" element={<ProtectedLayout><Transactions /></ProtectedLayout>} />
            <Route path="/add-transaction" element={<ProtectedLayout><AddTransaction /></ProtectedLayout>} />
            <Route path="/imports" element={<ProtectedLayout><Imports /></ProtectedLayout>} />
            <Route path="/investments" element={<ProtectedLayout><Investments /></ProtectedLayout>} />
            <Route path="/analysis" element={<ProtectedLayout><Analysis /></ProtectedLayout>} />
            <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
