const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  // In the environment selected country's currency should get set [cite: 11]
  defaultCurrency: { 
    type: String, 
    default: 'INR' // We'll default to INR for simplicity in the MVP
  } 
});

module.exports = mongoose.model('Company', CompanySchema);