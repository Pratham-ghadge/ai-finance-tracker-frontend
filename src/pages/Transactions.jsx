import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { transactionsAPI } from '../utils/api';

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ type: '', search: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await transactionsAPI.getAll({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        });
        setTransactions(response.data.transactions || []);
        setPagination((current) => ({
          ...current,
          ...response.data.pagination,
        }));
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters, pagination.page, pagination.limit]);

  const deleteTransaction = async (id) => {
    try {
      await transactionsAPI.remove(id);
      const response = await transactionsAPI.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setTransactions(response.data.transactions || []);
      setPagination((current) => ({
        ...current,
        ...response.data.pagination,
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete the transaction.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="hero-panel">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Transactions</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Search imported and manual money movement in one ledger</h1>
        </div>
        <Link className="btn-primary" to="/add-transaction">
          Add fallback entry
        </Link>
      </section>

      <section className="panel">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="field">
            <span>Search</span>
            <input className="input" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Description or category" />
          </label>
          <label className="field">
            <span>Type</span>
            <select className="input" value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
              <option value="">All</option>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </label>
          <label className="field">
            <span>Start date</span>
            <input className="input" type="date" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} />
          </label>
          <label className="field">
            <span>End date</span>
            <input className="input" type="date" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} />
          </label>
        </div>
      </section>

      {error && <div className="alert-error">{error}</div>}

      <section className="panel overflow-hidden">
        {loading ? (
          <div className="animate-pulse text-sm text-slate-500">Loading transactions...</div>
        ) : transactions.length ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4 lg:flex-row lg:items-center lg:justify-between" key={transaction.id}>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                    {transaction.type} • {transaction.source}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{transaction.description}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {transaction.category} • {transaction.account?.name || 'Unknown account'} • {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-3 text-left lg:text-right">
                  <p className={`text-2xl font-semibold ${transaction.type === 'INCOME' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {currency(transaction.amount)}
                  </p>
                  <button className="btn-danger justify-center lg:ml-auto" onClick={() => deleteTransaction(transaction.id)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No transactions match the current filters.</p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
          <p className="text-slate-500">
            Page {pagination.page} of {pagination.totalPages || 1}
          </p>
          <div className="flex gap-3">
            <button className="btn-secondary" disabled={pagination.page <= 1} onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))} type="button">
              Previous
            </button>
            <button
              className="btn-secondary"
              disabled={pagination.page >= (pagination.totalPages || 1)}
              onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transactions;
