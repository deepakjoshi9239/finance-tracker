import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Budgeting() {
  const [income, setIncome] = useState('');
  const [rent, setRent] = useState('');
  const [food, setFood] = useState('');
  const [entertainment, setEntertainment] = useState('');
  const [utilities, setUtilities] = useState('');
  const [transportation, setTransportation] = useState('');
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [error, setError] = useState('');

  // Fetch existing budget on component mount
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/budget`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Handle array response, use the latest budget if available
        const budgets = response.data;
        if (Array.isArray(budgets) && budgets.length > 0) {
          const latest = budgets[budgets.length - 1];
          setIncome(latest.income);
          setRent(latest.rent);
          setFood(latest.food);
          setEntertainment(latest.entertainment);
          setUtilities(latest.utilities);
          setTransportation(latest.transportation);
          setBudgetSummary({
            ...latest,
            totalExpenses:
              (latest.rent || 0) +
              (latest.food || 0) +
              (latest.entertainment || 0) +
              (latest.utilities || 0) +
              (latest.transportation || 0),
            remainingBalance:
              (latest.income || 0) -
              ((latest.rent || 0) +
                (latest.food || 0) +
                (latest.entertainment || 0) +
                (latest.utilities || 0) +
                (latest.transportation || 0)),
          });
        } else {
          setBudgetSummary(null);
        }
      } catch (err) {
        setError('Error fetching budget. Please log in again.');
        console.error('Error fetching budget:', err.message);
      }
    };
    fetchBudget();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const budgetData = {
      income: parseFloat(income) || 0,
      rent: parseFloat(rent) || 0,
      food: parseFloat(food) || 0,
      entertainment: parseFloat(entertainment) || 0,
      utilities: parseFloat(utilities) || 0,
      transportation: parseFloat(transportation) || 0,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/budget`, budgetData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the budget summary with the response data
      const latest = response.data;
      setBudgetSummary({
        ...latest,
        totalExpenses:
          (latest.rent || 0) +
          (latest.food || 0) +
          (latest.entertainment || 0) +
          (latest.utilities || 0) +
          (latest.transportation || 0),
        remainingBalance:
          (latest.income || 0) -
          ((latest.rent || 0) +
            (latest.food || 0) +
            (latest.entertainment || 0) +
            (latest.utilities || 0) +
            (latest.transportation || 0)),
      });

      setError('');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save budget. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="budgeting container p-8 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6 text-blue-900 font-bold text-center">Budgeting Tools</h2>

      {/* Display Error Message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Income Input */}
        <div>
          <label className="block mb-1 font-semibold">Income</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your income"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Rent Input */}
        <div>
          <label className="block mb-1 font-semibold">Rent</label>
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            placeholder="Enter rent budget"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Food Input */}
        <div>
          <label className="block mb-1 font-semibold">Food</label>
          <input
            type="number"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="Enter food budget"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Entertainment Input */}
        <div>
          <label className="block mb-1 font-semibold">Entertainment</label>
          <input
            type="number"
            value={entertainment}
            onChange={(e) => setEntertainment(e.target.value)}
            placeholder="Enter entertainment budget"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Utilities Input */}
        <div>
          <label className="block mb-1 font-semibold">Utilities</label>
          <input
            type="number"
            value={utilities}
            onChange={(e) => setUtilities(e.target.value)}
            placeholder="Enter utilities budget"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Transportation Input */}
        <div>
          <label className="block mb-1 font-semibold">Transportation</label>
          <input
            type="number"
            value={transportation}
            onChange={(e) => setTransportation(e.target.value)}
            placeholder="Enter transportation budget"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="col-span-2 mt-4 bg-blue-900 text-white p-3 rounded-md hover:bg-blue-800 transition duration-300"
        >
          Save Budget
        </button>
      </form>

      {/* Budget Summary Section */}
      {budgetSummary && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">Budget Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Total Income:</span>
            <span className="font-semibold text-gray-700">${budgetSummary.income}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Expenses:</span>
            <span className="font-semibold text-gray-700">${budgetSummary.totalExpenses}</span>
          </div>
          <div className="flex justify-between">
            <span>Remaining Balance:</span>
            <span
              className={`font-semibold ${
                budgetSummary.remainingBalance >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              ${budgetSummary.remainingBalance}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgeting;
