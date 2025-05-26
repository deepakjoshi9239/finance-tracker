import React, { useState, useEffect } from 'react';
import axios from 'axios';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Reports = () => {
  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [category, setCategory] = useState('all');
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        // Fetch expenses
        const expRes = await axios.get('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
        // Fetch budgets
        const budRes = await axios.get('http://localhost:5000/api/budget', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const budgets = budRes.data;
        if (Array.isArray(budgets) && budgets.length > 0) {
          setBudget(budgets[budgets.length - 1]);
        }
      } catch (err) {
        setError('Failed to fetch data from backend');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Dynamically get unique categories from expenses
  const uniqueCategories = Array.from(
    new Set(expenses.map(exp => exp.category))
  ).filter(Boolean);

  // Filter expenses by selected month and category
  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const expMonth = months[expDate.getMonth()];
    const matchesMonth = expMonth === month;
    const matchesCategory = category === 'all' || exp.category === category;
    return matchesMonth && matchesCategory;
  });

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalIncome = budget?.income || 0;
  const savings = totalIncome - totalExpenses;

  return (
    <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-6 text-blue-900">Financial Reports</h2>

      {/* Report Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl mb-4">Filter Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Select Month</label>
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Select Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl mb-4">Summary for {month}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="text-lg">Total Income</h4>
            <p className="text-2xl font-bold">${totalIncome}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="text-lg">Total Expenses</h4>
            <p className="text-2xl font-bold">${totalExpenses}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="text-lg">Savings</h4>
            <p className="text-2xl font-bold">${savings}</p>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl mb-4">Detailed Reports</h3>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-blue-900 text-white text-left">
                <th className="p-4">Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">No records found.</td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp._id}>
                    <td className="p-4 border-b">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="p-4 border-b">{exp.category}</td>
                    <td className="p-4 border-b">${exp.amount}</td>
                    <td className="p-4 border-b">{exp.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
};

export default Reports;
