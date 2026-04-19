import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#425466',
        boxWidth: 14,
      },
    },
  },
};

const EmptyState = ({ message }) => (
  <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-200 text-sm text-slate-500">
    {message}
  </div>
);

export const MonthlyExpenseBarChart = ({ data }) => {
  if (!data?.length) {
    return <EmptyState message="Add transactions to see monthly income and expense trends." />;
  }

  return (
    <div className="h-80">
      <Bar
        data={{
          labels: data.map((item) => item.month),
          datasets: [
            {
              label: 'Income',
              data: data.map((item) => item.income),
              backgroundColor: '#0f766e',
              borderRadius: 10,
            },
            {
              label: 'Expense',
              data: data.map((item) => item.expense),
              backgroundColor: '#e76f51',
              borderRadius: 10,
            },
          ],
        }}
        options={{
          ...baseOptions,
          scales: {
            y: {
              ticks: {
                callback: (value) => `Rs ${value}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export const CategoryPieChart = ({ data }) => {
  if (!data?.length) {
    return <EmptyState message="Expense categories will appear after you add expenses." />;
  }

  return (
    <div className="h-80">
      <Doughnut
        data={{
          labels: data.map((item) => item.category),
          datasets: [
            {
              data: data.map((item) => item.total),
              backgroundColor: ['#0f766e', '#ff7f51', '#118ab2', '#ef476f', '#ffd166', '#06d6a0', '#425466'],
              borderWidth: 0,
            },
          ],
        }}
        options={baseOptions}
      />
    </div>
  );
};

export const SpendingTrendLine = ({ data }) => {
  if (!data?.length) {
    return <EmptyState message="Spending trends will appear when you have a few months of data." />;
  }

  return (
    <div className="h-80">
      <Line
        data={{
          labels: data.map((item) => item.month),
          datasets: [
            {
              label: 'Net savings',
              data: data.map((item) => item.income - item.expense),
              borderColor: '#082032',
              backgroundColor: 'rgba(17, 138, 178, 0.12)',
              fill: true,
              tension: 0.3,
            },
          ],
        }}
        options={{
          ...baseOptions,
          scales: {
            y: {
              ticks: {
                callback: (value) => `Rs ${value}`,
              },
            },
          },
        }}
      />
    </div>
  );
};
