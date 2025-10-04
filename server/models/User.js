const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // Assign and change roles → Employee, Manager 
  role: { 
    type: String, 
    enum: ['Employee', 'Manager', 'Admin'], 
    required: true 
  },
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company' 
  },
  // Define manager relationships for employees 
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  }
});

module.exports = mongoose.model('User', UserSchema);