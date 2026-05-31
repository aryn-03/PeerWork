import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Fetch fresh user from DB to avoid stale JWT payload data (e.g. stale roles)
    const dbUser = await User.findById(decoded.id).select('role name email rating');
    if (!dbUser) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = {
      id: dbUser._id.toString(),
      role: dbUser.role,
      name: dbUser.name,
      email: dbUser.email,
      rating: dbUser.rating,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
