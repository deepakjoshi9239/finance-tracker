const express = require('express');
const mongoose = require('mongoose');
const { authenticateUser } = require('../middleware/authenticate');

const router = express.Router();

// Define SavingsGoal schema and model
const savingsGoalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  userId: { type: String, required: true },
}, { timestamps: true });

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema);

// Get all savings goals for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching savings goals', error: err.message });
  }
});

// Add a new savings goal
router.post('/', authenticateUser, async (req, res) => {
  const { name, amount } = req.body;
  if (!name || !amount) {
    return res.status(400).json({ message: 'Name and amount are required' });
  }
  try {
    const goal = new SavingsGoal({
      name,
      amount,
      userId: req.user.userId,
    });
    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(500).json({ message: 'Error saving goal', error: err.message });
  }
});

// Delete a savings goal
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const deleted = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting goal', error: err.message });
  }
});

module.exports = router;