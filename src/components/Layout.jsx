import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  CreditCard,
  PlusCircle,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/add-transaction', icon: PlusCircle, label: 'Add Entry' },
    { path: '/accounts', icon: BarChart3, label: 'Accounts' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-100 z-50 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 pb-10 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-200 group-hover:scale-110 transition-transform">
                <span className="text-white font-black italic">AF</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">AI Finance</h1>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Wealth Terminal</p>
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-10">
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Operations</p>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === item.path
                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'group-hover:text-indigo-600'} />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">System</p>
              <ul className="space-y-2">
                <li>
                  <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-slate-500 hover:bg-slate-50 hover:text-slate-900 group">
                    <Settings size={20} className="group-hover:text-indigo-600" />
                    <span className="font-bold text-sm tracking-tight">Configuration</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* User Section */}
          <div className="p-6">
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black shadow-sm shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 text-sm truncate">{user?.name}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <header className="sticky top-0 z-40 lg:ml-80 bg-white/70 backdrop-blur-xl border-b border-white/20 px-4 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-xl">
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center relative group max-w-sm">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Universal Search..."
                className="w-80 bg-slate-100/50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                ⌘K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-12 h-12 flex items-center justify-center text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm group">
              <Bell size={20} className="group-hover:animate-swing" />
              <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="w-[1px] h-6 bg-slate-200 mx-1 hidden lg:block"></div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm lg:flex hidden">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 lg:ml-80 min-h-screen">
          <div className="max-w-[1400px] mx-auto p-4 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;