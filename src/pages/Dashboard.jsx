import { BadgeIndianRupee, BrainCircuit, Landmark, PieChart, Sparkles, UploadCloud, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryPieChart, MonthlyExpenseBarChart, SpendingTrendLine } from '../components/FinancialChart';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    summary: {},
    accounts: [],
    recentTransactions: [],
    monthlyTrends: [],
    categoryExpenses: [],
    sourceBreakdown: [],
    topMerchants: [],
    taxSummary: {},
    investmentInsights: {},
    sync: {},
  });
  const [syncing, setSyncing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.get();
      setData(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await dashboardAPI.sync();
      await fetchDashboard();
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-12 w-12 animate-spin text-cyan-500" />
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Initializing OS Finance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  const summaryCards = [
    { label: 'Net worth snapshot', value: currency(data.summary.totalBalance), tone: 'mint' },
    { label: 'Income this month', value: currency(data.summary.totalIncome), tone: 'sky' },
    { label: 'Expenses this month', value: currency(data.summary.totalExpenses), tone: 'rose' },
    { label: 'Automation rate', value: `${data.summary.automationRate || 0}%`, tone: 'slate' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <motion.section variants={item} className="relative overflow-hidden rounded-[44px] bg-slate-950 p-10 lg:p-16 text-white shadow-2xl dark:border dark:border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent_40%)]" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
            Intelligent Control
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Wealth <span className="text-cyan-400 opacity-90">Simplified.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
            A minimalist, rule-based ecosystem to monitor your net worth, tax readiness, and family's resilience through automated intelligence.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              disabled={syncing}
              className="flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-950 hover:bg-slate-100 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
              onClick={handleSync}
            >
              {syncing ? <RefreshCw className="animate-spin" size={20} /> : <UploadCloud size={20} />}
              {syncing ? 'Syncing...' : 'Sync Accounts'}
            </button>
            <Link className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all" to="/investments">
              <PieChart size={20} />
              View Allocations
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section variants={item} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article className="panel p-8 group hover:scale-[1.02] transition-all duration-300 cursor-default" key={card.label}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4">{card.label}</p>
            <h2 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight group-hover:text-cyan-600 transition-colors">{card.value}</h2>
          </article>
        ))}
      </motion.section>

      <motion.section variants={item} className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <article className="panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Cashflow analytics</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Monthly income vs expense</h3>
            </div>
          </div>
          <MonthlyExpenseBarChart data={data.monthlyTrends} />
        </article>

        <section className="grid gap-6 xl:grid-cols-1">
          <article className="panel">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-rose-100 dark:bg-rose-900/30 p-3 text-rose-700 dark:text-rose-400">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Family Resilience</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Monthly Category Budgets</h3>
              </div>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Food & Dining', spent: (data.summary.totalExpenses || 0) * 0.4, limit: 15000, color: 'bg-emerald-500' },
                { label: 'Children Education', spent: (data.summary.totalExpenses || 0) * 0.15, limit: user?.familyDetails?.educationBudget || 10000, color: 'bg-cyan-500' },
                { label: 'Future Savings', spent: data.summary.netSavings > 0 ? data.summary.netSavings : 0, limit: user?.familyDetails?.savingsTarget || 20000, color: 'bg-indigo-500' },
                { label: 'Emergency Reserve', spent: data.summary.totalBalance || 0, limit: data.investmentInsights.emergencyFundTarget || 50000, color: 'bg-amber-500' },
              ].map((budget) => (
                <div key={budget.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{budget.label}</span>
                    <span className="text-slate-500">{currency(budget.spent)} / {currency(budget.limit)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full ${budget.color} transition-all duration-1000`}
                      style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </motion.section>

      <motion.section variants={item} className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="panel">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 p-3 text-cyan-800 dark:text-cyan-400">
              <BrainCircuit size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Automation status</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Import intelligence</h3>
            </div>
          </div>
          <p className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
            {data.sync.status || 'AI engine is monitoring payment SMS and bank exports for automatic categorization.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {(data.sync.supportedImports || ['Bank SMS', 'UPI Alerts', 'CSV Exports']).map((item) => (
              <span className="chip" key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-700 dark:text-emerald-400">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Investment posture</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{data.investmentInsights.profile || 'Balanced'} profile</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Monthly surplus</p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{currency(data.investmentInsights.monthlySurplus)}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Monthly Target</p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{currency(data.investmentInsights.suggestedMonthlyInvestment)}</p>
            </div>
          </div>
        </article>
      </motion.section>

      <motion.section variants={item} className="grid gap-6 xl:grid-cols-2">
        <article className="panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Recent transactions</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Latest income and expenses</h3>
            </div>
            <Link className="btn-secondary" to="/transactions">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentTransactions.length ? (
              data.recentTransactions.map((transaction) => (
                <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between" key={transaction.id}>
                  <div>
                    <p className="font-medium dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-slate-500">
                      {transaction.category} • {transaction.account?.name || 'Unknown account'} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${transaction.type === 'INCOME' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {currency(transaction.amount)}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{transaction.source}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No transactions yet.</p>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-700 dark:text-amber-400">
              <BadgeIndianRupee size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Income tax estimate</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Annual tax snapshot</h3>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Old regime</p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{currency(data.taxSummary.estimatedOldRegimeTax)}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">New regime</p>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{currency(data.taxSummary.estimatedNewRegimeTax)}</p>
            </div>
          </div>
          <div className="mt-5 rounded-3xl border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50 dark:bg-cyan-900/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-800 dark:text-cyan-400">Suggested regime</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{data.taxSummary.betterRegime || 'NEW'} looks optimal.</p>
          </div>
        </article>
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;
