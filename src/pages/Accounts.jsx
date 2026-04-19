import { useEffect, useState } from 'react';
import { accountsAPI } from '../utils/api';

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const initialForm = {
  name: '',
  type: 'BANK',
  initialBalance: '',
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAll();
      setAccounts(response.data.accounts || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to fetch accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await accountsAPI.update(editingId, {
          name: formData.name,
          type: formData.type,
          balance: Number(formData.initialBalance || 0),
        });
      } else {
        await accountsAPI.create({
          name: formData.name,
          type: formData.type,
          initialBalance: Number(formData.initialBalance || 0),
        });
      }
      resetForm();
      fetchAccounts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save the account.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (account) => {
    setEditingId(account.id);
    setFormData({
      name: account.name,
      type: account.type,
      initialBalance: account.balance,
    });
  };

  const handleDelete = async (id) => {
    try {
      await accountsAPI.remove(id);
      if (editingId === id) {
        resetForm();
      }
      fetchAccounts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete the account.');
    }
  };

  if (loading) {
    return <div className="panel animate-pulse">Loading accounts...</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
      <section className="panel">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{editingId ? 'Update account' : 'Create account'}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Manage bank, wallet, and cash balances</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="alert-error">{error}</div>}
          <label className="field">
            <span>Account name</span>
            <input className="input" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label className="field">
            <span>Type</span>
            <select className="input" value={formData.type} onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}>
              <option value="BANK">Bank</option>
              <option value="WALLET">Wallet</option>
              <option value="CASH">Cash</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="INVESTMENT">Investment</option>
            </select>
          </label>
          <label className="field">
            <span>{editingId ? 'Current balance' : 'Opening balance'}</span>
            <input className="input" type="number" step="0.01" value={formData.initialBalance} onChange={(event) => setFormData((current) => ({ ...current, initialBalance: event.target.value }))} />
          </label>
          <div className="flex gap-3">
            <button className="btn-primary flex-1 justify-center" disabled={submitting} type="submit">
              {submitting ? 'Saving...' : editingId ? 'Update account' : 'Create account'}
            </button>
            {editingId && (
              <button className="btn-secondary flex-1 justify-center" onClick={resetForm} type="button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {accounts.length ? (
          accounts.map((account) => (
            <article className="panel" key={account.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{account.type}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{account.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">Last updated {new Date(account.updatedAt).toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-3xl font-semibold text-slate-900 dark:text-white">{currency(account.balance)}</p>
                  <p className="text-sm text-slate-500">Tracked balance</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="btn-secondary" onClick={() => startEdit(account)} type="button">
                  Edit balance
                </button>
                <button className="btn-danger" onClick={() => handleDelete(account.id)} type="button">
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="panel text-sm text-slate-500">No accounts yet. Create one to start tracking expenses and imports.</div>
        )}
      </section>
    </div>
  );
};

export default Accounts;
