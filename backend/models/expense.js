const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
});

module.exports = mongoose.model('Expense', expenseSchema);
