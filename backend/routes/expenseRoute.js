const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/expense');
const { authenticateUser } = require('../middleware/authenticate'); // Custom middleware
const router = express.Router();

// Middleware to authenticate all routes
router.use(authenticateUser);

// **Add a New Expense**
router.post(
  '/',
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    // Validate input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Destructure input data from request body
      const { amount, category, description, date } = req.body;

      // Create a new expense entry with userId from authenticated user
      const newExpense = new Expense({
        amount,
        category,
        description,
        date: date || Date.now(), // Default to now if not provided
        userId: req.user.userId, // Attach authenticated userId
      });

      // Save expense to the database
      const savedExpense = await newExpense.save();

      // Send response with the saved expense
      res.status(201).json(savedExpense);
    } catch (err) {
      console.log(err);
      // Handle server errors
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// **Get All Expenses for the Authenticated User**
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 }); // Use userId

    if (expenses.length === 0) {
      return res.status(200).json({ message: 'No expenses found', expenses: [] });
    }

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', error: err.message });
  }
});

// **Update an Expense**
router.put(
  '/:id',
  [
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('category').optional().notEmpty().withMessage('Category is required'),
    body('description').optional().notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedExpense = await Expense.findOneAndUpdate(
        { _id: id, userId: req.user.userId },
        { $set: req.body },
        { new: true }
      );

      if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found or not authorized' });
      }

      res.status(200).json(updatedExpense);
    } catch (err) {
      res.status(500).json({ message: 'Error updating expense', error: err.message });
    }
  }
);

// **Delete an Expense**
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId: req.user.userId }); // Use userId

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or not authorized' });
    }

    res.status(200).json({ message: 'Expense deleted successfully', deletedExpense }); // Use 200 status
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expense', error: err.message });
  }
});

module.exports = router;
