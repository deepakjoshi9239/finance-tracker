// backend/routes/budgetRoute.js

const express = require('express');
const Budget = require('../models/budget');
const { authenticateUser } = require('../middleware/authenticate');
const router = express.Router();

// Authenticate all routes
router.use(authenticateUser);

// **Create a Budget**
// **Create a Budget**
router.post('/', async (req, res) => {
  const { income, rent, food, entertainment, utilities, transportation, month } = req.body; // <-- Add month
  const userId = req.user.userId;

  if (!income || !month) {
    return res.status(400).json({ message: 'Income and month are required' });
  }

  try {
    const newBudget = new Budget({
      income,
      rent,
      food,
      entertainment,
      utilities,
      transportation,
      month, // <-- Save month
      userId,
    });

    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Error creating budget', error: error.message });
  }
});

// **Get All Budgets for the Authenticated User**
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.userId }).sort({ createdAt: 1 });
    res.status(200).json(budgets); // Frontend expects an array
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Error fetching budgets', error: error.message });
  }
});

// **Get a Single Budget by ID**
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findById(id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ message: 'Error fetching budget', error: error.message });
  }
});

// **Update a Budget**
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    if (budget.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Error updating budget', error: error.message });
  }
});

// **Delete a Budget**
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    if (budget.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await Budget.findByIdAndDelete(id);
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Error deleting budget', error: error.message });
  }
});

module.exports = router;
