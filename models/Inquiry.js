const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  affiliation: { type: String },
  address: { type: String},
  title: { type: String },
  abstract: { type: String },
  fileName : {type: String},
  status: {type: String, default: "pending"},
  manuscriptPath: { type: String },
  trackingNumber: {type: String},
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inquiry", inquirySchema);
