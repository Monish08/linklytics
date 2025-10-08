const mongoose = require('mongoose');

const clickLogSchema = new mongoose.Schema({
  shortUrl: { type: mongoose.Schema.Types.ObjectId, ref: 'ShortURL', required: true },
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  ip: String,
  country: String,
  city: String
});

module.exports = mongoose.model('ClickLog', clickLogSchema);