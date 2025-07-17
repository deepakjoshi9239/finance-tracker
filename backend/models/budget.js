const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  income: { type: Number, required: true },
  rent: Number,
  food: Number,
  entertainment: Number,
  utilities: Number,
  transportation: Number,
  month: { type: String, required: true }, // <-- Add this line
  userId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);