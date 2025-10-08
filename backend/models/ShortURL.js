const mongoose = require('mongoose');

const shortURLSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  customAlias: { type: String, unique: true, sparse: true },  // Sparse allows multiple nulls
  clicks: { type: Number, default: 0 },
  password: String,
  maxClicks: { type: Number, default: 0 },
  expireAt: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShortURL', shortURLSchema);