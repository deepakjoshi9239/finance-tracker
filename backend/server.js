// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const expenseRoute = require('./routes/expenseRoute');
const budgetRoute = require('./routes/budgetRoute');
const authRoute = require('./routes/authRoute');
const savingsGoalRoute = require('./routes/savingsGoalRoute');

dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Use the routes
app.use('/api/expenses', expenseRoute); // For expense-related endpoints
app.use('/api/auth', authRoute);
app.use('/api/budget', budgetRoute); // For budget-related endpoints
app.use('/api/savings-goals', savingsGoalRoute);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
