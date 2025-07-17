import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaClipboardList, FaPiggyBank, FaChartPie, FaBell, FaFileAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const monthsArr = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function Dashboard() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [savingsGoal, setSavingsGoal] = useState(0);

  // Fetch budgets, expenses, and savings goal when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/budget`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBudgets(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to fetch budget'));

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setExpenses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to fetch expenses'));

    // Fetch savings goal
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/savings-goal`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSavingsGoal(res.data.amount || 0))
      .catch(() => setSavingsGoal(0));
  }, []);

  // Update savings goal in backend when changed
  const handleSavingsGoalChange = async (e) => {
    const newGoal = Number(e.target.value);
    setSavingsGoal(newGoal);
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/savings-goal`, { amount: newGoal }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      setError('Failed to update savings goal');
    }
  };

  // Group expenses by month
  const expensesByMonth = {};
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const month = monthsArr[date.getMonth()];
    if (!expensesByMonth[month]) expensesByMonth[month] = 0;
    expensesByMonth[month] += exp.amount || 0;
  });

  // Map each month to its income from budgets
  const incomeByMonth = {};
  budgets.forEach(budget => {
    incomeByMonth[budget.month] = budget.income;
  });

  // Calculate totals for cards (current month or latest budget)
  const latestBudget = budgets[budgets.length - 1] || {};
  const income = latestBudget.income || 0;
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const budgetRemaining = income - totalExpenses;

  // Build chart data dynamically
  const chartData = monthsArr.map(month => ({
    name: month,
    income: incomeByMonth[month] || 0,
    expenses: expensesByMonth[month] || 0
  }));

  // Calculate under-budget months dynamically
  const underBudgetMonths = monthsArr.filter(month => {
    const monthIncome = incomeByMonth[month] || 0;
    return monthIncome > 0 && (expensesByMonth[month] || 0) <= monthIncome;
  });

  return (
    <div className="dashboard container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card title="Monthly Income" amount={`$${income}`} icon={<FaMoneyBillWave />} />
        <Card title="Total Expenses" amount={`$${totalExpenses}`} icon={<FaClipboardList />} />
        <Card
          title="Savings Goals"
          amount={
            <span>
              $
              <input
                type="number"
                value={savingsGoal}
                onChange={handleSavingsGoalChange}
                className="w-20 px-1 py-0.5 border rounded text-blue-900 font-semibold text-center"
                min={0}
              />
            </span>
          }
          icon={<FaPiggyBank />}
        />
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

      {/* Under Budget Badges Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 text-green-700">🏅 Under Budget Badges</h2>
        {Object.values(incomeByMonth).every(val => val === 0) ? (
          <p className="text-gray-500">Set your budget to start earning badges!</p>
        ) : underBudgetMonths.length === 0 ? (
          <p className="text-gray-500">No under-budget months yet. Keep trying!</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {underBudgetMonths.map(month => (
              <span
                key={month}
                className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold text-sm"
              >
                🏅 {month}
              </span>
            ))}
          </div>
        )}
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
