import { useEffect, useState } from 'react';
import { accountsAPI, transactionsAPI } from '../utils/api';

const expenseCategories = ['Food', 'Travel', 'Bills', 'Shopping', 'Groceries', 'Health', 'Entertainment', 'Education', 'Rent', 'Utilities', 'Insurance', 'Others'];
const incomeCategories = ['Salary', 'Freelance', 'Bonus', 'Investment', 'Refund', 'Other Income'];

const defaultDate = new Date().toISOString().split('T')[0];
const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const TransactionForm = ({ onSuccess }) => {
  const [accounts, setAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: 'Food',
    date: defaultDate,
    accountId: '',
    description: '',
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountsAPI.getAll();
        const nextAccounts = response.data.accounts || [];
        setAccounts(nextAccounts);
        setFormData((current) => ({
          ...current,
          accountId: current.accountId || nextAccounts[0]?.id || '',
        }));
      } catch {
        setError('Create an account before adding transactions.');
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      category: current.type === 'INCOME' ? 'Salary' : 'Food',
    }));
  }, [formData.type]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await transactionsAPI.create({
        ...formData,
        amount: Number(formData.amount),
      });
      onSuccess?.();
      setFormData((current) => ({
        ...current,
        amount: '',
        description: '',
        date: defaultDate,
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save the transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = formData.type === 'INCOME' ? incomeCategories : expenseCategories;

  return (
    <form className="panel space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={`chip ${formData.type === 'EXPENSE' ? 'chip-active-expense' : ''}`}
          onClick={() => setFormData((current) => ({ ...current, type: 'EXPENSE' }))}
        >
          Expense
        </button>
        <button
          type="button"
          className={`chip ${formData.type === 'INCOME' ? 'chip-active-income' : ''}`}
          onClick={() => setFormData((current) => ({ ...current, type: 'INCOME' }))}
        >
          Income
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          <span>Amount</span>
          <input className="input" name="amount" type="number" min="0.01" step="0.01" value={formData.amount} onChange={handleChange} required />
        </label>
        <label className="field">
          <span>Date</span>
          <input className="input" name="date" type="date" value={formData.date} onChange={handleChange} required />
        </label>
        <label className="field">
          <span>Category</span>
          <select className="input" name="category" value={formData.category} onChange={handleChange} required>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Account</span>
          <select className="input" name="accountId" value={formData.accountId} onChange={handleChange} required>
            <option value="">Select account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({currency(account.balance)})
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Description</span>
        <textarea className="input min-h-28" name="description" value={formData.description} onChange={handleChange} placeholder="Dinner with friends, salary credit, rent payment..." required />
      </label>

      <button className="btn-primary w-full justify-center" disabled={submitting || !accounts.length} type="submit">
        {submitting ? 'Saving...' : 'Save transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
