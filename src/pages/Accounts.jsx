import React, { useState, useEffect } from 'react';
import { accountsAPI } from '../utils/api';
import {
  Plus,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
  PlusCircle,
  X,
  PiggyBank,
  Briefcase,
  AlertCircle,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CURRENT',
    initialBalance: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await accountsAPI.getAll();
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await accountsAPI.create({
        ...formData,
        initialBalance: parseFloat(formData.initialBalance) || 0
      });

      setShowForm(false);
      setFormData({
        name: '',
        type: 'CURRENT',
        initialBalance: ''
      });
      fetchAccounts();
    } catch (error) {
      console.error('Failed to create account:', error);
      setError(error.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'CURRENT': return CreditCard;
      case 'SAVINGS': return PiggyBank;
      case 'INVESTMENT': return Briefcase;
      case 'CREDIT_CARD': return CreditCard;
      default: return Wallet;
    }
  };

  const getAccountColor = (type) => {
    switch (type) {
      case 'CURRENT': return 'from-indigo-600 to-indigo-500';
      case 'SAVINGS': return 'from-emerald-600 to-emerald-500';
      case 'INVESTMENT': return 'from-amber-600 to-amber-500';
      case 'CREDIT_CARD': return 'from-rose-600 to-rose-500';
      default: return 'from-slate-600 to-slate-500';
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + parseFloat(account.balance || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium">Mapping your assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial <span className="gradient-text">Accounts</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Oversee and organize all your money streams.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Total Balance Card */}
      {accounts.length > 0 && (
        <div className="card bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Consolidated Wealth</p>
              <h2 className="text-5xl font-black tracking-tight mb-2">
                ${getTotalBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  <TrendingUp size={10} />
                  Verified
                </span>
                <p className="text-indigo-300 text-xs font-semibold">Across {accounts.length} active accounts</p>
              </div>
            </div>
            <div className="shrink-0 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <Wallet size={48} className="text-indigo-100/40" />
            </div>
          </div>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => {
          const Icon = getAccountIcon(account.type);
          const colorClass = getAccountColor(account.type);

          return (
            <div key={account.id} className="card group hover:border-indigo-100 transition-all duration-300 p-0 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    {account.is_default && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Primary
                      </span>
                    )}
                    <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {account.type.replace('_', ' ')}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {account.name}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Available Funds</p>
                  <p className={`text-2xl font-black tracking-tight ${parseFloat(account.balance) >= 0 ? 'text-slate-900' : 'text-rose-600'
                    }`}>
                    ${parseFloat(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Linked {new Date(account.created_at).toLocaleDateString()}
                </span>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline hover:translate-x-1 transition-transform">
                  View Transactions →
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Account Card (Empty State) */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="card border-dashed border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex flex-col items-center justify-center p-8 group min-h-[250px]"
          >
            <div className="w-16 h-16 bg-slate-50 group-hover:bg-indigo-100 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition-all mb-4">
              <Plus size={32} />
            </div>
            <p className="font-bold text-slate-500 group-hover:text-indigo-900">Add New Account</p>
            <p className="text-xs text-slate-400 mt-1">Connect banks, cards or wallets</p>
          </button>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="glass-card shadow-2xl max-w-md w-full animate-scale-up border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">New <span className="gradient-text">Account</span></h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-rose-50 text-rose-700 p-4 rounded-2xl mb-6 text-sm font-semibold border border-rose-100">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Account Label</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Personal Savings"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="CURRENT">Checking / Current</option>
                  <option value="SAVINGS">Savings Account</option>
                  <option value="INVESTMENT">Investment Portfolio</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Opening Balance</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    name="initialBalance"
                    value={formData.initialBalance}
                    onChange={handleChange}
                    step="0.01"
                    className="input-field pl-8 focus:ring-4 focus:ring-indigo-50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {submitting ? 'Initializing...' : 'Establish Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary w-full"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;