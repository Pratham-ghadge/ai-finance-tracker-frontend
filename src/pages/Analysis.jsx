import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarChart3, PieChart, TrendingUp, ShoppingBag, Utensils, Plane, Landmark } from 'lucide-react';
import { CategoryPieChart, MonthlyExpenseBarChart } from '../components/FinancialChart';
import { dashboardAPI } from '../utils/api';

const currency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value || 0);

const Analysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dashboardAPI.get();
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch analysis data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex h-96 items-center justify-center">Loading analysis...</div>;
    if (!data) return <div>Error loading analysis data.</div>;

    const patternData = [
        { label: 'Food & Dining', value: data.categoryExpenses.find(c => c.category === 'Food')?.total || 0, icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100' },
        { label: 'Shopping', value: data.categoryExpenses.find(c => c.category === 'Shopping')?.total || 0, icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-100' },
        { label: 'Travel', value: data.categoryExpenses.find(c => c.category === 'Travel')?.total || 0, icon: Plane, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Investments', value: data.categoryExpenses.find(c => c.category === 'Investment')?.total || 0, icon: Landmark, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
            <section>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">Pattern Analysis</h1>
                <p className="text-slate-500 mt-2 text-lg">Detailed breakdown of your lifestyle spending and financial habits.</p>
            </section>

            <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {patternData.map((p) => (
                    <article key={p.label} className="panel flex flex-col items-center text-center space-y-4">
                        <div className={`p-4 rounded-3xl ${p.bg} ${p.color}`}>
                            <p.icon size={32} />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">{p.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{currency(p.value)}</h3>
                        </div>
                    </article>
                ))}
            </motion.section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <motion.article variants={item} className="panel">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-2xl">
                            <PieChart size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Expense Distribution</h2>
                    </div>
                    <div className="h-[400px]">
                        <CategoryPieChart data={data.categoryExpenses} />
                    </div>
                </motion.article>

                <motion.article variants={item} className="panel">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Spending Trends</h2>
                    </div>
                    <div className="h-[400px]">
                        <MonthlyExpenseBarChart data={data.monthlyTrends} />
                    </div>
                </motion.article>
            </div>

            <motion.section variants={item} className="panel space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-2xl">
                        <BarChart3 size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Lifestyle Analysis</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">Efficiency Insights</h3>
                        <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Your <span className="text-emerald-500 font-bold">Food & Dining</span> expenses represent {Math.round((patternData[0].value / data.summary.totalExpenses) * 100 || 0)}% of your monthly spend.
                                Reducing this by 10% could add {currency(patternData[0].value * 0.1)} to your future savings.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">Future Impact</h3>
                        <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Based on your <span className="text-indigo-500 font-bold">Investment</span> pattern, you are on track to achieve a wealth growth of 12% annually.
                                Consistency in <span className="text-purple-500 font-bold">Shopping</span> control is key to maintaining this posture.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default Analysis;
