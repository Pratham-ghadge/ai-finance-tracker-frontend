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
      const [dbRes, accountsRes] = await Promise.all([
        dashboardAPI.getData(),
        accountsAPI.getAll()
      ]);
      setDashboardData(dbRes.data);
      setAccounts(accountsRes.data.accounts || []);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('System failure while retrieving financial data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Terminal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-rose-50 border-rose-100 p-12 text-center max-w-2xl mx-auto shadow-2xl shadow-rose-100">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Protocol Error</h2>
        <p className="text-slate-600 font-medium mb-8">{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary px-8">Retry Connection</button>
      </div>
    );
  }

  const stats = {
    totalBalance: dashboardData?.totalBalance || 0,
    income: dashboardData?.currentMonthStats?.income || 0,
    expenses: dashboardData?.currentMonthStats?.expenses || 0,
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Terminal Active</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Wealth <span className="text-indigo-600">Console</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/transactions" className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all border border-slate-100">
            View Ledger
          </Link>
          <Link to="/add-transaction" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <Plus size={18} />
            Add Entry
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Liquidity"
          amount={stats.totalBalance}
          icon={Wallet}
          trend="+2.4% vs last cycle"
          color="bg-indigo-600"
        />
        <StatCard
          title="Consolidated Inflow"
          amount={stats.income}
          icon={TrendingUp}
          trend="Positive"
          color="bg-emerald-500"
        />
        <StatCard
          title="Resource Outflow"
          amount={stats.expenses}
          icon={TrendingDown}
          trend="Critical"
          trendType="down"
          color="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trends & Accounts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card bg-white p-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-black text-slate-900">Capital Flow</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">30-day performance baseline</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button className="px-4 py-2 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Trend</button>
                <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Growth</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 55, 30, 85, 45, 90, 60, 75, 50, 65, 80, 55, 70, 95].map((h, i) => (
                <div key={i} className="group relative flex-1 h-full flex flex-col justify-end">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                  <div
                    className="w-full bg-slate-50 rounded-t-lg transition-all duration-700 relative overflow-hidden group-hover:bg-indigo-50"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/10 h-full"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-indigo-600 w-full group-hover:bg-indigo-500" style={{ height: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900">Live Terminals</h2>
              <Link to="/accounts" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Mapping</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.slice(0, 4).map(account => (
                <div key={account.id} className="p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900 font-bold group-hover:scale-110 transition-transform">
                      {account.name.charAt(0)}
                    </div>
                    <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{account.type}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{account.name}</h3>
                  <p className="text-lg font-black text-slate-900">${parseFloat(account.balance).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Insights & Signals */}
        <div className="space-y-8">
          {/* AI Insights Card */}
          <div className="card bg-slate-900 text-white p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-900/40">
                <Zap size={24} className="text-white fill-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-black mb-4">Financial Insight</h3>
              <p className="text-indigo-100/70 font-medium text-sm leading-relaxed mb-8">
                Your spending on <span className="text-white font-bold">Food & Dining</span> is trending 18% higher than average. You could save <span className="text-emerald-400 font-bold">$240</span> this month by optimizing lunch expenses.
              </p>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl">
                Activate Savings Protocol
              </button>
            </div>
          </div>

          <div className="card bg-white p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6">Activity Signals</h2>
            <div className="space-y-6">
              {[
                { label: 'Deposit Detected', time: '2h ago', color: 'bg-emerald-500' },
                { label: 'High Utilization', time: '4h ago', color: 'bg-rose-500' },
                { label: 'New Terminal Added', time: 'Yesterday', color: 'bg-indigo-500' }
              ].map((sig, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`w-2 h-2 rounded-full ${sig.color} mt-2 shadow-lg shadow-slate-200`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{sig.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sig.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 hover:text-slate-600 transition-colors">
              Historical Logs
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/add-transaction')}
        className="fixed bottom-10 right-10 w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 hover:rotate-90 transition-all z-50 group"
      >
        <Plus size={32} />
        <div className="absolute right-20 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-[0.2em] pointer-events-none shadow-xl">
          New Entry
        </div>
      </button>
    </div>
  );
};

export default Dashboard;