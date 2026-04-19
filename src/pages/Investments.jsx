import { ArrowRight, CircleGauge, ShieldPlus, Sparkles, TrendingUp, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { investmentsAPI } from '../utils/api';

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Investments = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [marketPrices, setMarketPrices] = useState({
    RELIANCE: 2950.45,
    TCS: 4120.30,
    INFY: 1540.15,
    HDFCBANK: 1680.90,
    ICICIBANK: 1120.55
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await investmentsAPI.getAll();
        setData(response.data.suggestions);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load investment suggestions.');
      }
    };

    fetchSuggestions();

    const interval = setInterval(() => {
      setMarketPrices(prev => ({
        ...prev,
        RELIANCE: prev.RELIANCE + (Math.random() - 0.5) * 5,
        TCS: prev.TCS + (Math.random() - 0.5) * 8,
        INFY: prev.INFY + (Math.random() - 0.5) * 3,
        HDFCBANK: prev.HDFCBANK + (Math.random() - 0.5) * 4,
        ICICIBANK: prev.ICICIBANK + (Math.random() - 0.5) * 2,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (!data) {
    return <div className="panel animate-pulse">Loading investment guidance...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="hero-panel">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Investments</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">A rule-based investment plan shaped by your tracked cash flow</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            This page now adapts to the user profile instead of showing generic static suggestions.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="metric-card metric-mint">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Profile</p>
          <p className="mt-4 text-3xl font-semibold">{data.profile}</p>
        </article>
        <article className="metric-card metric-sky">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Monthly surplus</p>
          <p className="mt-4 text-3xl font-semibold">{currency(data.monthlySurplus)}</p>
        </article>
        <article className="metric-card metric-rose">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Monthly investable</p>
          <p className="mt-4 text-3xl font-semibold">{currency(data.suggestedMonthlyInvestment)}</p>
        </article>
        <article className="metric-card metric-slate">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Tax-efficient room</p>
          <p className="mt-4 text-3xl font-semibold">{currency(data.taxEfficientCapacity)}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 p-3 text-cyan-800 dark:text-cyan-400">
              <WalletCards size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Suggested allocation</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">How to split new money</h2>
            </div>
          </div>

          <div className="space-y-4">
            {data.allocations.map((item) => (
              <article className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5" key={item.name}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                    <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                  <div className="rounded-full bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-950 dark:text-white">
                    {item.percentage}%
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/30 p-3 text-amber-700 dark:text-amber-400">
              <CircleGauge size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Safety checks</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Readiness before risk</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Emergency fund target</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{currency(data.emergencyFundTarget)}</p>
            </div>
            <div className="rounded-[28px] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Current gap</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{currency(data.emergencyFundGap)}</p>
            </div>
            <div className="rounded-[28px] border border-emerald-100 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5 text-sm text-slate-700 dark:text-slate-300">
              {data.disclaimer}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 p-3 text-indigo-700 dark:text-indigo-400">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Market Intelligence</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Recommended Blue-chip Stocks</h2>
            </div>
          </div>

          <div className="mb-6 overflow-hidden rounded-2xl bg-slate-900 p-4">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {Object.entries(marketPrices).map(([symbol, price]) => (
                <div key={symbol} className="inline-flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">{symbol}</span>
                  <span className="text-sm font-mono font-bold text-white">{price.toFixed(2)}</span>
                  <span className={`text-[10px] ${Math.random() > 0.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.random() > 0.5 ? '▲' : '▼'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {(data.bestStocks || []).map((stock) => (
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between" key={stock.symbol}>
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{stock.name} ({stock.symbol})</p>
                  <p className="text-sm text-slate-500">{stock.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block">Top Pick</p>
                  <p className="mt-1 text-[11px] text-slate-400 max-w-[200px] leading-tight">{stock.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-700 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Growth Pathways</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Best SIP Recommendations</h2>
            </div>
          </div>
          <div className="space-y-3">
            {(data.bestSips || []).map((sip) => (
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4" key={sip.name}>
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{sip.name}</p>
                  <p className="text-sm text-slate-500">{sip.type}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold px-3 py-1 rounded-full ${sip.risk === 'High' || sip.risk === 'Very High' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {sip.risk} Risk
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="panel">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-3 text-emerald-700 dark:text-emerald-400">
              <ShieldPlus size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Action plan</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">What to do next</h2>
            </div>
          </div>

          <div className="space-y-3">
            {data.actionPlan.map((item) => (
              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-4" key={item}>
                <ArrowRight size={16} className="mt-1 text-cyan-700 dark:text-cyan-400" />
                <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Why this changed</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Adaptive Financial Logic</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
            The investment feature now uses tracked income, expenses, account balances, and tax deduction usage to generate a cleaner planning view. It is still educational logic, not a broker connection or regulated advisory engine.
          </p>
        </article>
      </section>
    </div>
  );
};

export default Investments;
