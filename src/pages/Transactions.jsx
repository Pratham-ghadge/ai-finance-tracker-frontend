import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionsAPI } from '../utils/api';
import { Plus, Search, Filter, Download, ArrowUpCircle, ArrowDownCircle, Calendar, Tag, Wallet, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.page]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      setTransactions(response.data.transactions);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium">Loading your transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Transaction <span className="gradient-text">History</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Keep track of every dollar you spend or earn.</p>
        </div>
        <Link
          to="/add-transaction"
          className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          <span>New Entry</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="card bg-white overflow-visible">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search by description or category..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-12 input-field"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-50 outline-none appearance-none cursor-pointer"
              >
                <option value="">All Streams</option>
                <option value="INCOME">Income Only</option>
                <option value="EXPENSE">Expenses Only</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2">
              <Calendar className="text-slate-400 w-4 h-4 ml-1" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="bg-transparent border-none text-xs font-semibold py-2.5 focus:ring-0 text-slate-600"
              />
              <span className="text-slate-300 mx-1">-</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="bg-transparent border-none text-xs font-semibold py-2.5 focus:ring-0 text-slate-600"
              />
            </div>

            {(filters.search || filters.type || filters.startDate || filters.endDate) && (
              <button
                onClick={clearFilters}
                className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Clear all filters"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card bg-white overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${transaction.type === 'INCOME'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                        }`}>
                        {transaction.type === 'INCOME' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight mb-1">{transaction.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                            <Calendar size={10} />
                            {formatDate(transaction.date)}
                          </span>
                          {transaction.is_recurring && (
                            <span className="text-[8px] font-black py-0.5 px-1.5 bg-indigo-50 text-indigo-600 rounded uppercase">
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Tag size={12} className="text-slate-300" />
                        {transaction.category}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Wallet size={12} className="text-slate-300" />
                        {transaction.account_name}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <p className={`text-lg font-black tracking-tight ${transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </td>
                  <td className="py-5 px-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${transaction.type === 'INCOME'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                      }`}>
                      {transaction.type}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No entries found</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button onClick={clearFilters} className="btn-secondary">
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Improved Pagination */}
        {pagination.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50/50 border-t border-slate-100 gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Record {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} <span className="mx-2 text-slate-200">/</span> Total {pagination.total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100">
                  {pagination.page}
                </span>
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;