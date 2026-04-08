import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  CreditCard,
  BarChart3,
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  Bell
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 hidden lg:block z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 pb-10">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black italic">AF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Finance</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Intelligent tracking</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-8">
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
              <ul className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-600'} />
                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Support & More</p>
              <ul className="space-y-1.5">
                <li>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 group">
                    <Settings size={20} className="group-hover:text-indigo-600" />
                    <span className="font-bold text-sm tracking-tight">Settings</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 mt-auto">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 text-sm truncate">{user?.name}</p>
                <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Header Bar (Mobile & Desktop Status) */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 lg:ml-72 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="lg:hidden text-indigo-600 font-black italic">AF</div>
          <div className="flex-1 lg:flex items-center hidden">
            <div className="relative max-w-md w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Universal search..."
                className="w-full bg-slate-100/50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-semibold focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 min-h-screen">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Internal companion component for Search if needed, but keeping it simple for now
const Search = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default Layout;