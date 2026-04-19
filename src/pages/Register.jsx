import { ArrowRight, BadgeIndianRupee } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-auth flex items-center justify-center p-4">
      <div className="auth-shell max-w-6xl w-full grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[40px] shadow-2xl">
        {/* Left Side: Modern Register Form */}
        <section className="bg-white p-10 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Create Account</h2>
              <p className="mt-2 text-slate-500">Join the future of financial intelligence</p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <div className="alert-error py-4 px-6 mb-4">{error}</div>}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                <input
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Email</label>
                <input
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Password</label>
                  <input
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Confirm</label>
                  <input
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-900 focus:ring-2 focus:ring-cyan-500 transition-all outline-none"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full py-4 px-8 rounded-2xl bg-slate-950 text-white font-bold hover:bg-slate-800 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                disabled={loading}
                type="submit"
              >
                {loading ? 'Launching...' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <footer className="mt-8 pt-6 border-t border-slate-100 text-center lg:text-left">
              <p className="text-slate-500 text-sm">
                Already have an account?{' '}
                <Link className="font-bold text-slate-950 hover:underline" to="/login">
                  Sign In
                </Link>
              </p>
            </footer>
          </div>
        </section>

        {/* Right Side: Cinematic Poster */}
        <section
          className="auth-poster relative flex flex-col justify-end p-12 text-white order-1 lg:order-2"
          style={{ backgroundImage: "url('/assets/images/auth-register.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/90 to-transparent" />
          <div className="relative z-10">
            <div className="glass-badge mb-6 border-white/20 bg-white/5">The Next Level</div>
            <h1 className="text-5xl font-bold leading-tight mb-4 text-balance">
              Wealth building, automated.
            </h1>
            <p className="text-lg text-slate-200 max-w-md leading-relaxed">
              Experience the 2.0 ecosystem with smart investments and total tax visibility.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
