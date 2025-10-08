import React, { useState, useEffect } from 'react';
import { accountsAPI } from '../utils/api';
import { Plus, CreditCard, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

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
      fetchAccounts(); // Refresh the list
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
      case 'SAVINGS': return TrendingUp;
      case 'INVESTMENT': return TrendingUp;
      default: return Wallet;
    }
  };

  const getAccountColor = (type) => {
    switch (type) {
      case 'CURRENT': return 'blue';
      case 'SAVINGS': return 'green';
      case 'INVESTMENT': return 'purple';
      default: return 'gray';
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + parseFloat(account.balance || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-2">Manage your financial accounts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Total Balance Card */}
      {accounts.length > 0 && (
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100">Total Balance</p>
              <p className="text-3xl font-bold mt-1">${getTotalBalance().toFixed(2)}</p>
              <p className="text-blue-100 text-sm mt-2">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
            </div>
            <Wallet className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      )}

      {/* Add Account Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Account</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., Main Bank Account"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="CURRENT">Current Account</option>
                  <option value="SAVINGS">Savings Account</option>
                  <option value="INVESTMENT">Investment Account</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Balance
                </label>
                <input
                  type="number"
                  name="initialBalance"
                  value={formData.initialBalance}
                  onChange={handleChange}
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => {
          const Icon = getAccountIcon(account.type);
          const color = getAccountColor(account.type);
          
          return (
            <div key={account.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {account.type.toLowerCase().replace('_', ' ')} account
                    </p>
                  </div>
                </div>
                {account.is_default && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Balance</span>
                  <span className={`text-lg font-bold ${
                    parseFloat(account.balance) >= 0 ? 'text-gray-900' : 'text-red-600'
                  }`}>
                    ${parseFloat(account.balance || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">
                    {new Date(account.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {accounts.length === 0 && !loading && (
        <div className="card text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first account to start tracking your finances
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Accounts;