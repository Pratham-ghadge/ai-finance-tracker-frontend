import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Loader2, ArrowRight, CheckCircle2, Trophy, Rocket } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const result = await register(formData.name, formData.email, formData.password);
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
      {/* Left Side: Poster & Features */}
      <div className="lg:w-1/2 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/auth-register.png"
            alt="Financial Growth"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>

        {/* Brand Overlay */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-2xl">
              <span className="text-slate-900 font-black italic">AF</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">AI Finance</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Your journey to <span className="text-emerald-400">financial freedom</span> starts here.
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 text-slate-100/80">
              <div className="mt-1 p-2 bg-white/10 rounded-lg backdrop-blur-md text-white">
                <Trophy size={20} />
              </div>
              <p className="font-medium">Ranked #1 for intuitive personalized budgeting algorithms.</p>
            </div>
            <div className="flex items-start gap-4 text-slate-100/80">
              <div className="mt-1 p-2 bg-white/10 rounded-lg backdrop-blur-md text-white">
                <Rocket size={20} />
              </div>
              <p className="font-medium">Get started in under 60 seconds with our streamlined setup tool.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Secured Gateway • 256-bit SSL Protection
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex flex-col bg-slate-50 lg:bg-white px-6 py-12 lg:px-20 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Join 50,000+ users tracking their wealth.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-bold border border-rose-100 animate-shake">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300 text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Destination</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300 text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-xl pl-11 pr-4 py-3.5 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>Secure encryption</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>AI insights</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;