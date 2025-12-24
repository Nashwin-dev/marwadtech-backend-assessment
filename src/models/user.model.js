
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true, // Assessment Requirement: Ensure no duplicate Mobile Numbers
    validate: {
      // Assessment Requirement: Strict validation for Mobile Number
      validator: function(v) {
        // Regex for 10-digit mobile number (common Indian format)
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Security: Don't return password by default in queries
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Assessment Requirement: Passwords must be hashed
// Pre-save middleware: Runs automatically before saving a user
userSchema.pre('save', async function() {
  // If password is not modified, exit function immediately
  if (!this.isModified('password')) return;
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
  

// Helper method to check password validity for Login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// eslint-disable-next-line no-undef
module.exports = mongoose.model('User', userSchema);