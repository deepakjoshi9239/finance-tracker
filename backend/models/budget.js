const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    income: { type: Number, required: true },
    rent: { type: Number, required: true },
    food: { type: Number, required: true },
    entertainment: { type: Number, required: true },
    utilities: { type: Number, required: true },
    transportation: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
});

module.exports = mongoose.model('Budget', budgetSchema);
