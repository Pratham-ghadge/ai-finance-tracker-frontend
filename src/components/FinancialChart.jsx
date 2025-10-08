import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const EmptyChart = ({ message = "No data available" }) => (
  <div className="flex items-center justify-center h-64 text-gray-500">
    {message}
  </div>
);

export const MonthlyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No transaction data available" />;
  }

  const incomeData = data.filter(item => item.type === 'INCOME');
  const expenseData = data.filter(item => item.type === 'EXPENSE');

  const allMonths = [...new Set(data.map(item => item.month))].sort();
  
  const chartData = {
    labels: allMonths.map(month => {
      const date = new Date(month);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Income',
        data: allMonths.map(month => {
          const income = incomeData.find(item => item.month === month);
          return income ? parseFloat(income.total) : 0;
        }),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: allMonths.map(month => {
          const expense = expenseData.find(item => item.month === month);
          return expense ? parseFloat(expense.total) : 0;
        }),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export const CategoryDoughnutChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No expense data available" />;
  }

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => parseFloat(item.total)),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Expense Categories',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export const BalanceTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyChart message="No trend data available" />;
  }

  const allMonths = [...new Set(data.map(item => item.month))].sort();
  
  const chartData = {
    labels: allMonths.map(month => {
      const date = new Date(month);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Net Balance',
        data: allMonths.map(month => {
          const income = data.find(d => d.month === month && d.type === 'INCOME');
          const expense = data.find(d => d.month === month && d.type === 'EXPENSE');
          const incomeTotal = income ? parseFloat(income.total) : 0;
          const expenseTotal = expense ? parseFloat(expense.total) : 0;
          return incomeTotal - expenseTotal;
        }),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Balance Trend',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};