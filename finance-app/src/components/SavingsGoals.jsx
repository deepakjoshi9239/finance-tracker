import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch goals from backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/savings-goals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoals(res.data);
      } catch (err) {
        setError('Failed to fetch savings goals');
      }
    };
    fetchGoals();
  }, []);

  // Add a new goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!goalName || !goalAmount) {
      setError('Please fill out all fields.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/savings-goals`, {
        name: goalName,
        amount: parseFloat(goalAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals([...goals, res.data]);
      setGoalName('');
      setGoalAmount('');
      setSuccess('Goal added!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add goal');
    }
  };

  // Delete a goal
  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/savings-goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(goals.filter(goal => goal._id !== id));
      setSuccess('Goal deleted!');
    } catch (err) {
      setError('Failed to delete goal');
    }
  };

  const totalGoals = goals.reduce((total, goal) => total + (goal.amount || 0), 0);

  return (
    <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-4 text-blue-900">Savings Goals</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl mb-4">Set Your Savings Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Goal Name</label>
            <input
              type="text"
              placeholder="Enter savings goal name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Amount</label>
            <input
              type="number"
              placeholder="Enter goal amount"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800 transition duration-300"
        >
          Add Goal
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl mb-4">Your Savings Goals</h3>
        {goals.length === 0 ? (
          <p>No savings goals set yet.</p>
        ) : (
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li key={goal._id} className="flex justify-between border-b py-2">
                <span>{goal.name}</span>
                <span>${goal.amount.toFixed(2)}</span>
                <button
                  onClick={() => handleDelete(goal._id)}
                  className="ml-4 text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl mb-2">Total Savings Goals</h3>
        <p className="text-2xl font-semibold text-green-600">${totalGoals.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SavingsGoals;
