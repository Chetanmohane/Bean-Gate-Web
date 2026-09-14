const mongoose = require('mongoose');

const refCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: String, required: true },
  planType: { type: String, default: "all" }, // "all" | "one-time" | "inst-1" | "inst-2"
  active: { type: Boolean, default: true },
  created: { type: String, required: true }, // Format: YYYY-MM-DD
  uses: { type: Number, default: 0 },
  creator: { type: String } // username of sub-admin or "admin"
});

module.exports = mongoose.model('RefCode', refCodeSchema);
