const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  affiliation: { type: String },
  address: { type: String},
  title: { type: String },
  abstract: { type: String },

  // We'll store the manuscript as a file path or URL
  manuscriptPath: { type: String }, // e.g., '/uploads/manuscript.docx'

  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inquiry", inquirySchema);
