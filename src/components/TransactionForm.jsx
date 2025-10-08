import React, { useState, useEffect } from 'react';
import { transactionsAPI, accountsAPI } from '../utils/api';

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
      
      // Set default account if available
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
      // Prepare data for API - only include recurring fields if isRecurring is true
      const submitData = {
        type: formData.type,
        amount: formData.amount,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        accountId: formData.accountId,
        isRecurring: formData.isRecurring,
        // Only include recurring fields if transaction is recurring
        ...(formData.isRecurring && {
          recurringInterval: formData.recurringInterval,
          nextRecurringDate: formData.nextRecurringDate || null
        })
      };

      console.log('📤 Submitting transaction data:', submitData);
      
      await transactionsAPI.create(submitData);
      onSuccess?.();
      
      // Reset form
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

  // Clear recurring fields when isRecurring is turned off
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
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="EXPENSE"
                checked={formData.type === 'EXPENSE'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-red-600 font-medium">Expense</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="INCOME"
                checked={formData.type === 'INCOME'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-green-600 font-medium">Income</span>
            </label>
          </div>
        </div>

        {/* Amount and Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account
            </label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance || 0).toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Transaction description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Category</option>
              {categories[formData.type]?.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        {/* Recurring Transaction */}
        <div className="border-t pt-4">
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              This is a recurring transaction
            </span>
          </label>

          {formData.isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recurring Interval
                </label>
                <select
                  name="recurringInterval"
                  value={formData.recurringInterval}
                  onChange={handleChange}
                  required={formData.isRecurring}
                  className="input-field"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Recurring Date
                </label>
                <input
                  type="date"
                  name="nextRecurringDate"
                  value={formData.nextRecurringDate}
                  onChange={handleChange}
                  required={formData.isRecurring}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.accountId || !formData.category}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Processing...' : (initialData ? 'Update' : 'Add Transaction')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;