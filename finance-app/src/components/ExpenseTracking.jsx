import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');

  // Fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You are not logged in. Please log in again.');
        setExpenses([]);
        return;
      }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setErrorMessage('Error fetching expenses. Please log in again.');
      setExpenses([]);
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate) {
      setErrorMessage('Please fill out all fields.');
      setSuccessMessage('');
      return;
    }

    const newExpense = {
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      description: expenseName,
      date: expenseDate,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`, newExpense, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch expenses after adding
      await fetchExpenses();
      setExpenseName('');
      setExpenseAmount('');
      setExpenseCategory('');
      setExpenseDate('');
      setErrorMessage('');
      setSuccessMessage('Expense added successfully!');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Failed to add expense. Please try again.'
      );
      setSuccessMessage('');
    }
  };

  // Delete an expense
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchExpenses();
      setSuccessMessage('Expense deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to delete expense.');
      setSuccessMessage('');
    }
  };

  // Start editing an expense
  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditName(expense.description);
    setEditAmount(expense.amount);
    setEditCategory(expense.category);
    setEditDate(expense.date?.slice(0, 10));
  };

  // Save edited expense
  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/${id}`, {
        description: editName,
        amount: parseFloat(editAmount),
        category: editCategory,
        date: editDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchExpenses();
      setEditingId(null);
      setSuccessMessage('Expense updated successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to update expense.');
      setSuccessMessage('');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditAmount('');
    setEditCategory('');
    setEditDate('');
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + (expense.amount || 0), 0);

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-lg shadow-xl max-w-4xl">
      <h2 className="text-4xl mb-6 font-bold text-indigo-700 text-center">Expense Tracker</h2>

      {/* Display Error or Success Messages */}
      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-2">Expense Name</label>
            <input
              type="text"
              placeholder="Enter expense description"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-2">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-2">Category</label>
            <input
              type="text"
              placeholder="Enter expense category"
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-2">Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-indigo-600 text-white text-lg font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 w-full md:w-auto"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Your Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center">No expenses recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <li
                key={expense._id}
                className="py-4 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-gray-100 px-4 rounded-lg transition duration-300"
              >
                {editingId === expense._id ? (
                  <div className="flex flex-col md:flex-row md:items-center w-full gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 mr-2 mb-2 md:mb-0"
                    />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="border rounded px-2 mr-2 mb-2 md:mb-0"
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="border rounded px-2 mr-2 mb-2 md:mb-0"
                    />
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="border rounded px-2 mr-2 mb-2 md:mb-0"
                    />
                    <button
                      onClick={() => handleEdit(expense._id)}
                      className="text-green-600 hover:underline mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center w-full gap-2">
                    <span className="flex-1">{expense.description}</span>
                    <span className="flex-1 text-green-600 font-semibold">${expense.amount?.toFixed(2)}</span>
                    <span className="flex-1">{expense.category}</span>
                    <span className="flex-1">{expense.date?.slice(0, 10)}</span>
                    <button
                      onClick={() => startEdit(expense)}
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="ml-2 text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Total Expenses */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Total Expenses</h3>
        <p className="text-3xl font-bold text-indigo-700">${totalExpenses.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ExpenseTracking;
