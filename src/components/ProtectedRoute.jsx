import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-app px-6 py-10">
        <div className="mx-auto max-w-4xl animate-pulse rounded-3xl border border-white/60 bg-white/70 p-10 shadow-soft">
          <div className="h-8 w-56 rounded-full bg-slate-200" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-3xl bg-slate-100" />
            <div className="h-40 rounded-3xl bg-slate-100" />
            <div className="h-40 rounded-3xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
