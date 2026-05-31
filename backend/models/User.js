import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['freelancer', 'client', 'both'],
    default: 'freelancer',
  },
  skills: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: '',
  },
  university: {
    type: String,
    default: '',
  },
  organization: {
    type: String,
    default: '',
  },
  year: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  isNewUser: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving and enforce role-based fields
UserSchema.pre('save', async function () {
  if (this.role === 'client') {
    this.skills = [];
    this.year = '';
    this.university = '';
  } else if (this.role === 'freelancer') {
    this.organization = '';
  }

  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
