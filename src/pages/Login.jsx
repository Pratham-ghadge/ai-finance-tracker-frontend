import { ArrowRight, BadgeIndianRupee } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center p-6 lg:p-12">
      <div className="auth-shell max-w-7xl w-full grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[56px] shadow-[0_64px_128px_-12px_rgba(0,0,0,0.5)]">
        {/* Cinematic Branding Segment */}
        <section
          className="auth-poster relative flex flex-col justify-between p-16 text-white"
          style={{ backgroundImage: "url('/assets/images/auth-login.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/40 to-cyan-500/20" />

          <header className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-950 shadow-xl">
                <BadgeIndianRupee size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter">Finance OS</span>
            </div>
          </header>

          <footer className="relative z-10 max-w-sm">
            <div className="mb-6 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-300">
              The Next Evolution
            </div>
            <h1 className="text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Invest in <span className="text-cyan-300">Certainty.</span>
            </h1>
            <p className="text-slate-200/80 leading-relaxed font-medium">
              Join the elite workspace for rule-based wealth tracking and automated family budgeting.
            </p>
          </footer>
        </section>

        {/* Minimalist Access Segment */}
        <section className="bg-white p-12 lg:p-24 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-14">
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-3">Sign In</h2>
              <p className="text-slate-500 font-medium">Access your institutional command center</p>
            </header>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold">{error}</div>}

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Institutional Email</label>
                <input
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-8 py-5 text-slate-900 focus:bg-white focus:border-cyan-500 transition-all outline-none font-bold placeholder:text-slate-300"
                  type="email"
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Secure Password</label>
                <input
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-8 py-5 text-slate-900 focus:bg-white focus:border-cyan-500 transition-all outline-none font-bold placeholder:text-slate-300"
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </div>

              <button
                className="w-full py-5 px-10 rounded-2xl bg-slate-950 text-white font-black hover:bg-slate-800 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-10 shadow-2xl shadow-slate-950/20"
                disabled={loading}
                type="submit"
              >
                {loading ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            <footer className="mt-14 pt-10 border-t border-slate-100">
              <p className="text-slate-400 font-medium text-sm">
                New to OS Finance?{' '}
                <Link className="font-black text-slate-950 hover:text-cyan-600 transition-colors underline decoration-2 underline-offset-4" to="/register">
                  Create Private Account
                </Link>
              </p>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
