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
  AlertCircle
} from 'lucide-react';

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

  // Safe data access with fallbacks
  const currentMonthIncome = dashboardData.monthlyStats
    ?.find(stat => stat.type === 'INCOME')?.total || 0;
  const currentMonthExpenses = dashboardData.monthlyStats
    ?.find(stat => stat.type === 'EXPENSE')?.total || 0;
  const netSavings = currentMonthIncome - currentMonthExpenses;

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${typeof value === 'number' ? value.toFixed(2) : '0.00'}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? '+' : '-'}${Math.abs(change).toFixed(2)}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${
          title === 'Total Balance' ? 'bg-blue-100' :
          title === 'Monthly Income' ? 'bg-green-100' :
          title === 'Monthly Expenses' ? 'bg-red-100' : 'bg-purple-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            title === 'Total Balance' ? 'text-blue-600' :
            title === 'Monthly Income' ? 'text-green-600' :
            title === 'Monthly Expenses' ? 'text-red-600' : 'text-purple-600'
          }`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your financial overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={dashboardData.totalBalance || 0}
          icon={Wallet}
        />
        <StatCard
          title="Monthly Income"
          value={currentMonthIncome}
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Monthly Expenses"
          value={currentMonthExpenses}
          icon={TrendingDown}
          trend="down"
        />
        <StatCard
          title="Net Savings"
          value={netSavings}
          icon={PiggyBank}
          trend={netSavings >= 0 ? 'up' : 'down'}
        />
      </div>

      {/* Accounts Overview */}
      {dashboardData.accounts && dashboardData.accounts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            Your Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.accounts.map(account => (
              <div key={account.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{account.type?.toLowerCase() || 'account'}</p>
                  </div>
                  {account.is_default && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">
                  ${parseFloat(account.balance || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses */}
        {dashboardData.monthlyTrends && dashboardData.monthlyTrends.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Monthly Overview
            </h2>
            <MonthlyBarChart data={dashboardData.monthlyTrends} />
          </div>
        )}

        {/* Expense Categories */}
        {dashboardData.categoryStats && dashboardData.categoryStats.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Expense Distribution
            </h2>
            <CategoryDoughnutChart data={dashboardData.categoryStats} />
          </div>
        )}
      </div>

      {/* Balance Trend */}
      {dashboardData.monthlyTrends && dashboardData.monthlyTrends.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Balance Trend</h2>
          <BalanceTrendChart data={dashboardData.monthlyTrends} />
        </div>
      )}

      {/* Empty State */}
      {(!dashboardData.accounts || dashboardData.accounts.length === 0) && 
       (!dashboardData.monthlyTrends || dashboardData.monthlyTrends.length === 0) && (
        <div className="card text-center py-12">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to FinanceTracker!</h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first account and adding transactions.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/accounts"
              className="btn-primary"
            >
              Create Account
            </a>
            <a
              href="/add-transaction"
              className="btn-secondary"
            >
              Add Transaction
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;