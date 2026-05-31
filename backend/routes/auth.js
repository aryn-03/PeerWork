import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );
};

// Set cookie and send response helper
const sendTokenCookie = (user, statusCode, res) => {
  const token = generateToken(user);
  
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      bio: user.bio,
      university: user.university,
      organization: user.organization,
      year: user.year,
      rating: user.rating,
      isNewUser: user.isNewUser,
    },
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user & set cookie
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'freelancer', // Default starting role
    });

    sendTokenCookie(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user, get token, set cookie
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    sendTokenCookie(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully.' });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile & setup onboarding info
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.university = req.body.university !== undefined ? req.body.university : user.university;
    user.organization = req.body.organization !== undefined ? req.body.organization : user.organization;
    user.year = req.body.year !== undefined ? req.body.year : user.year;
    user.isNewUser = req.body.isNewUser !== undefined ? req.body.isNewUser : user.isNewUser;

    const updatedUser = await user.save();

    // Regenerate and update cookie to keep session payload (name, role, email) in sync
    const token = generateToken(updatedUser);
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };

    res.cookie('token', token, cookieOptions).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      skills: updatedUser.skills,
      bio: updatedUser.bio,
      university: updatedUser.university,
      organization: updatedUser.organization,
      year: updatedUser.year,
      rating: updatedUser.rating,
      isNewUser: updatedUser.isNewUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
