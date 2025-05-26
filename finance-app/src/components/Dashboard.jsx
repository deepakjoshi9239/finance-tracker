import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaClipboardList, FaPiggyBank, FaChartPie, FaBell, FaFileAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const monthsArr = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function Dashboard() {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch budgets
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/budget`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const budgets = res.data;
        if (Array.isArray(budgets) && budgets.length > 0) {
          setBudget(budgets[budgets.length - 1]);
        }
      })
      .catch(() => setError('Failed to fetch budget'));

    // Fetch expenses
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to fetch expenses'));
  }, []);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const income = budget?.income || 0;
  const budgetRemaining = income - totalExpenses;

  // Group expenses by month
  const expensesByMonth = {};
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const month = monthsArr[date.getMonth()];
    if (!expensesByMonth[month]) expensesByMonth[month] = 0;
    expensesByMonth[month] += exp.amount || 0;
  });

  // For demo, assume same income for each month (from latest budget)
  const chartData = monthsArr.map(month => ({
    name: month,
    income: income,
    expenses: expensesByMonth[month] || 0
  }));

  return (
    <div className="dashboard container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card title="Monthly Income" amount={`$${income}`} icon={<FaMoneyBillWave />} />
        <Card title="Total Expenses" amount={`$${totalExpenses}`} icon={<FaClipboardList />} />
        <Card title="Savings Goals" amount="$500" icon={<FaPiggyBank />} />
        <Card title="Budget Remaining" amount={`$${budgetRemaining}`} icon={<FaChartPie />} />
        <Card title="Notifications" amount="3 Alerts" icon={<FaBell />} />
        <Card title="Reports" amount="View Reports" icon={<FaFileAlt />} />
      </div>

      {/* Graphs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Financial Overview</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl mb-2">Income vs Expenses (All Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#3b82f6" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, amount, icon }) {
  return (
    <div className="card bg-white shadow-md p-6 rounded-lg flex items-center">
      <div className="icon text-blue-600 text-3xl mr-4">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-lg">{amount}</p>
      </div>
    </div>
  );
}

export default Dashboard;
