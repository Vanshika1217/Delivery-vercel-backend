const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: 'partner'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['bike', 'car', 'truck']
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Create geospatial index
partnerSchema.index({ currentLocation: '2dsphere' });

// Hash password before saving
partnerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Generate auth token
partnerSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// Find partner by credentials
partnerSchema.statics.findByCredentials = async (email, password) => {
  const partner = await Partner.findOne({ email });
  if (!partner) {
    throw new Error('Invalid login credentials');
  }
  const isMatch = await bcrypt.compare(password, partner.password);
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }
  return partner;
};

// Check if model exists before creating it
const Partner = mongoose.models.Partner || mongoose.model('Partner', partnerSchema);

module.exports = Partner; 