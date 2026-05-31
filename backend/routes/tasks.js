import express from 'express';
import { Task } from '../models/Task.js';
import { Bid } from '../models/Bid.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all open tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'open' }).populate('postedBy', 'name rating').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', protect, async (req, res) => {
  const { title, description, budget, deadline, skillsRequired } = req.body;

  try {
    if (req.user.role === 'freelancer' && req.user.role !== 'both') {
      return res.status(403).json({ message: 'Only clients can post freelance tasks.' });
    }

    const task = await Task.create({
      title,
      description,
      budget,
      deadline,
      skillsRequired,
      postedBy: req.user.id,
      clientName: req.user.name,
      status: 'open',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/my-posted
// @desc    Get tasks posted by the current user
router.get('/my-posted', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/my-bids
// @desc    Get tasks the user has bid on
router.get('/my-bids', protect, async (req, res) => {
  try {
    // Find all bids submitted by this freelancer
    const bids = await Bid.find({ freelancerId: req.user.id });
    const taskIds = bids.map(bid => bid.taskId);

    // Fetch the corresponding tasks
    const tasks = await Task.find({ _id: { $in: taskIds } }).populate('postedBy', 'name rating');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
