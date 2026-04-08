import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';
import {
  MonthlyBarChart,
  CategoryDoughnutChart,
  BalanceTrendChart
} from '../components/FinancialChart';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Calendar,
  PieChart,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    accounts: [],
    monthlyStats: [],
    categoryStats: [],
    monthlyTrends: [],
    totalBalance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const currentMonthIncome = dashboardData.monthlyStats
    ?.find(stat => stat.type === 'INCOME')?.total || 0;
  const currentMonthExpenses = dashboardData.monthlyStats
    ?.find(stat => stat.type === 'EXPENSE')?.total || 0;
  const netSavings = currentMonthIncome - currentMonthExpenses;

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="card group hover:border-indigo-100 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            ${typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </p>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{trend === 'up' ? 'Increase' : 'Decrease'}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium">Crunching your numbers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="glass-card p-10 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Service Interruption</h3>
          <p className="text-slate-600 mb-8">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary w-full">
            Reconnect to Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/transactions" className="btn-secondary">
            View History
          </Link>
          <Link to="/add-transaction" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Add Entry</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Net Worth"
          value={dashboardData.totalBalance || 0}
          icon={Wallet}
          color="from-indigo-600 to-indigo-500"
        />
        <StatCard
          title="Monthly Cash In"
          value={currentMonthIncome}
          icon={TrendingUp}
          color="from-emerald-600 to-emerald-500"
          trend="up"
        />
        <StatCard
          title="Monthly Cash Out"
          value={currentMonthExpenses}
          icon={TrendingDown}
          color="from-rose-600 to-rose-500"
          trend="down"
        />
        <StatCard
          title="Net Savings"
          value={netSavings}
          icon={PiggyBank}
          color="from-amber-500 to-orange-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Accounts & Main Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Trend Chart */}
          <div className="card bg-white h-fit">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Balance Trend
              </h2>
              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Last 12 Months
              </div>
            </div>
            {dashboardData.monthlyTrends?.length > 0 ? (
              <BalanceTrendChart data={dashboardData.monthlyTrends} />
            ) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400">Add transactions to see your balance trend</p>
              </div>
            )}
          </div>

          {/* Accounts Section */}
          <div className="card bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-600" />
                Linked Accounts
              </h2>
              <Link to="/accounts" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                Manage All
              </Link>
            </div>
            {dashboardData.accounts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.accounts.map(account => (
                  <div key={account.id} className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                        <Wallet size={20} />
                      </div>
                      {account.is_default && (
                        <span className="text-[10px] uppercase tracking-widest font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{account.type}</p>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{account.name}</h3>
                    <p className="text-2xl font-black text-slate-900">
                      ${parseFloat(account.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400">No active accounts found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Secondary Chart & Empty States */}
        <div className="space-y-8">
          {/* Category Distribution */}
          <div className="card bg-white h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Distribution
              </h2>
            </div>
            {dashboardData.categoryStats?.length > 0 ? (
              <div className="space-y-8">
                <div className="h-64">
                  <CategoryDoughnutChart data={dashboardData.categoryStats} />
                </div>
                <div className="space-y-3">
                  {dashboardData.categoryStats.slice(0, 4).map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-sm font-medium text-slate-600">{stat.category}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">${stat.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <PieChart className="w-10 h-10 text-slate-200 mb-4" />
                <p className="text-slate-400 px-10">Add categorized expenses to see distribution</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;