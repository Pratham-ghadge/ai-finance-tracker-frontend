import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row animate-fade-in">
      {/* Left Side: Poster & Brand Message */}
      <div className="lg:w-1/2 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/auth-login.png"
            alt="Financial Dashboard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/90 via-indigo-900/60 to-transparent"></div>
        </div>

        {/* Brand Overlay */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-2xl">
              <span className="text-indigo-600 font-black italic">AF</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">AI Finance</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Master your wealth with <span className="text-indigo-300">intelligence.</span>
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 text-indigo-100/80">
              <div className="mt-1 p-2 bg-white/10 rounded-lg backdrop-blur-md">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <p className="font-medium">Military-grade encryption for all your financial sensitive data.</p>
            </div>
            <div className="flex items-start gap-4 text-indigo-100/80">
              <div className="mt-1 p-2 bg-white/10 rounded-lg backdrop-blur-md">
                <Globe size={20} className="text-white" />
              </div>
              <p className="font-medium">Connect multiple accounts across any global banking institution.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-indigo-200/50 text-xs font-bold uppercase tracking-widest">
          © 2025 AI Finance Tracker • Trusted by 50k+ Users
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col bg-slate-50 lg:bg-white px-6 py-12 lg:px-24 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-3">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Please enter your credentials to access your terminal.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold border border-rose-100 animate-shake">
              <div className="w-2 h-full bg-rose-500 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Pin</label>
                <a href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
              >
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            &copy; 2026 AI Finance Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;