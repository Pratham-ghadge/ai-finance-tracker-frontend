import React, { useState, useEffect } from 'react';
import { transactionsAPI, accountsAPI } from '../utils/api';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  AlignLeft,
  Tag,
  Calendar,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

const TransactionForm = ({ onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    accountId: '',
    isRecurring: false,
    recurringInterval: 'MONTHLY',
    nextRecurringDate: ''
  });

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = {
    INCOME: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other Income'],
    EXPENSE: [
      'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
      'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'
    ]
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAll();
      setAccounts(response.data.accounts);

      if (response.data.accounts.length > 0 && !formData.accountId) {
        setFormData(prev => ({
          ...prev,
          accountId: response.data.accounts[0].id
        }));
      }
    } catch (error) {
      setError('Failed to load accounts');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        type: formData.type,
        amount: formData.amount,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        accountId: formData.accountId,
        isRecurring: formData.isRecurring,
        ...(formData.isRecurring && {
          recurringInterval: formData.recurringInterval,
          nextRecurringDate: formData.nextRecurringDate || null
        })
      };

      await transactionsAPI.create(submitData);
      onSuccess?.();

      if (!initialData) {
        setFormData({
          type: 'EXPENSE',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          category: '',
          accountId: accounts[0]?.id || '',
          isRecurring: false,
          recurringInterval: 'MONTHLY',
          nextRecurringDate: ''
        });
      }
    } catch (error) {
      console.error('❌ Transaction submission error:', error);
      setError(error.response?.data?.error || error.response?.data?.details || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formData.isRecurring) {
      setFormData(prev => ({
        ...prev,
        recurringInterval: 'MONTHLY',
        nextRecurringDate: ''
      }));
    }
  }, [formData.isRecurring]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 text-rose-700 p-4 rounded-2xl mb-8 text-sm font-semibold border border-rose-100 animate-shake">
          <AlertCircle size={18} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type Toggle */}
        <div className="p-1.5 bg-slate-100 rounded-2xl flex items-center gap-1.5 max-w-sm mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE', category: '' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${formData.type === 'EXPENSE'
                ? 'bg-white text-rose-600 shadow-md scale-[1.02]'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <ArrowDownCircle size={18} />
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME', category: '' }))}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${formData.type === 'INCOME'
                ? 'bg-white text-emerald-600 shadow-md scale-[1.02]'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <ArrowUpCircle size={18} />
            Income
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Info Section */}
          <div className="space-y-6">
            <div className="card bg-white space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value (USD)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    required
                    className="input-field pl-12 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-50/50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Label</label>
                <div className="relative group">
                  <AlignLeft className="absolute left-4 top-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="input-field pl-12 resize-none pt-3 font-medium text-slate-600"
                    placeholder="What was this for?"
                  />
                </div>
              </div>
            </div>

            <div className="card bg-white space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Source Account</label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  required
                  className="input-field cursor-pointer font-bold text-slate-700"
                >
                  <option value="">Choose your account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} (Balance: ${parseFloat(account.balance || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expense Classification</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input-field pl-12 cursor-pointer font-bold text-slate-700 appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories[formData.type]?.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Timing & Extras Section */}
          <div className="space-y-6">
            <div className="card bg-white space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Execution Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="input-field pl-12 font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="card bg-white">
              <label className="flex items-center gap-3 cursor-pointer group mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.isRecurring ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'
                  }`}>
                  <RefreshCcw size={20} className={formData.isRecurring ? 'animate-spin-slow' : ''} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 leading-tight">Automation</p>
                  <p className="text-xs font-medium text-slate-500">Enable recurring schedule</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>

              {formData.isRecurring && (
                <div className="space-y-5 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-slide-down">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Cycle</label>
                    <select
                      name="recurringInterval"
                      value={formData.recurringInterval}
                      onChange={handleChange}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-200 transition-all cursor-pointer"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Run Date</label>
                    <input
                      type="date"
                      name="nextRecurringDate"
                      value={formData.nextRecurringDate}
                      onChange={handleChange}
                      required={formData.isRecurring}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !formData.accountId || !formData.category}
              className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:grayscale disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Finalizing Record...
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} />
                  {initialData ? 'Commit Changes' : 'Record Transaction'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              Take me back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;