import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowUpRight, LayoutDashboard, Landmark, LogOut, Menu, Moon, PiggyBank, Receipt, Settings, Sparkles, Sun, UploadCloud, Wallet, X, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Landmark },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/imports', label: 'Imports', icon: UploadCloud },
  { to: '/investments', label: 'Investments', icon: PiggyBank },
  { to: '/analysis', label: 'Analysis', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-app text-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-[1600px] gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* V3 Sidebar Navigation */}
        <aside
          className={`fixed inset-y-6 left-6 z-40 w-80 rounded-[44px] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl transition-all duration-500 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-[120%]'
            }`}
        >
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-lg shadow-indigo-500/20">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">OS Finance</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Wealth v2.0</p>
              </div>
            </Link>
          </div>

          <nav className="mt-14 space-y-3">
            {navigation.map((item) => {
              const NavIcon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                >
                  {({ isActive }) => (
                    <div className={`flex items-center gap-4 rounded-2xl px-6 py-4 text-sm font-bold transition-all ${isActive
                      ? 'bg-slate-900 text-white border border-white/5 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}>
                      <NavIcon size={18} className={isActive ? 'text-cyan-400' : ''} />
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <footer className="mt-auto absolute bottom-8 left-8 right-8">
            <div className="rounded-[32px] bg-slate-900 border border-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                className="w-full py-3 px-4 rounded-xl bg-slate-800 text-xs font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </footer>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden" onClick={() => setOpen(false)} />}

        <div className="min-w-0 flex-1">
          <header className="sticky top-4 z-20 mb-6 flex items-center justify-between rounded-[28px] border border-slate-200/60 bg-white/90 px-5 py-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Autopilot finance</p>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Track income, tax posture, imports, and allocations</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white md:inline-flex" to="/imports">
                Smart sync
                <ArrowUpRight size={16} />
              </Link>
              <button
                className="rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="rounded-2xl border border-slate-200 p-3 lg:hidden" onClick={() => setOpen(true)}>
                <Menu size={18} />
              </button>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
