import express from 'express';
import { Bid } from '../models/Bid.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bids
// @desc    Submit a new proposal/bid on a task
router.post('/', protect, async (req, res) => {
  const { taskId, amount, deliveryTime, proposal } = req.body;

  try {
    if (req.user.role === 'client' && req.user.role !== 'both') {
      return res.status(403).json({ message: 'Only freelancers can submit proposals.' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.postedBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot bid on your own task.' });
    }

    if (task.status !== 'open') {
      return res.status(400).json({ message: 'Task is no longer open for bidding.' });
    }

    // Check if freelancer already submitted a bid on this task
    const existingBid = await Bid.findOne({ taskId, freelancerId: req.user.id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this task.' });
    }

    // Fetch user details for the bid record
    const user = await User.findById(req.user.id);

    const bid = await Bid.create({
      taskId,
      taskTitle: task.title,
      freelancerId: req.user.id,
      freelancerName: user.name,
      freelancerRating: user.rating,
      amount,
      deliveryTime,
      proposal,
      status: 'pending',
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bids/task/:taskId
// @desc    Get bids for a specific task (client poster gets all, freelancer gets own)
router.get('/task/:taskId', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // If client is the poster of the task, they can view all bids
    if (task.postedBy.toString() === req.user.id) {
      const bids = await Bid.find({ taskId: req.params.taskId }).sort({ createdAt: -1 });
      return res.json(bids);
    }

    // If the requester is a freelancer, they can only view their own bid(s) for this task
    if (req.user.role === 'freelancer' || req.user.role === 'both') {
      const bids = await Bid.find({ taskId: req.params.taskId, freelancerId: req.user.id }).sort({ createdAt: -1 });
      return res.json(bids);
    }

    // Otherwise, unauthorized
    return res.status(403).json({ message: 'Unauthorized. You do not have permission to view proposals for this task.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bids/my-submitted
// @desc    Get all bids submitted by the logged-in freelancer
router.get('/my-submitted', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id }).sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/bids/:id/status
// @desc    Accept or reject a bid (client only)
router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'

  try {
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const bid = await Bid.findById(req.params.id);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found.' });
    }

    const task = await Task.findById(bid.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Associated task not found.' });
    }

    // Ensure the logged in user is the client who posted the task
    if (task.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    bid.status = status;
    await bid.save();

    if (status === 'accepted') {
      // Mark task as in-progress
      task.status = 'in-progress';
      await task.save();

      // Reject all other pending bids for this task
      await Bid.updateMany(
        { taskId: bid.taskId, _id: { $ne: bid._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bids/all
// @desc    Get all bids associated with the user's tasks or user's proposals
router.get('/all', protect, async (req, res) => {
  try {
    if (req.user.role === 'freelancer') {
      const bids = await Bid.find({ freelancerId: req.user.id }).sort({ createdAt: -1 });
      return res.json(bids);
    } else {
      // Client role - fetch bids on all tasks posted by client
      const myTasks = await Task.find({ postedBy: req.user.id });
      const taskIds = myTasks.map(t => t._id);
      const bids = await Bid.find({ taskId: { $in: taskIds } }).sort({ createdAt: -1 });
      res.json(bids);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bids/:id/comment
// @desc    Add a comment/message to a proposal/bid (client or freelancer only)
// NOTE: This MUST be defined before GET /:id to prevent Express wildcard shadowing
router.post('/:id/comment', protect, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required.' });
  }

  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found.' });
    }

    const task = await Task.findById(bid.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Associated task not found.' });
    }

    // Auth check: either the freelancer who placed it, or the client who owns the task
    const requesterId = req.user.id.toString();
    const freelancerId = bid.freelancerId.toString();
    const taskPosterId = task.postedBy.toString();

    if (requesterId !== freelancerId && requesterId !== taskPosterId) {
      return res.status(403).json({ message: 'Unauthorized. You do not have permission to comment on this proposal.' });
    }

    // Add comment — store senderId as string for easy frontend comparison
    bid.comments.push({
      senderId: req.user.id,
      senderName: req.user.name,
      text: text.trim(),
      createdAt: new Date(),
    });

    const savedBid = await bid.save();
    res.status(201).json(savedBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bids/:id
// @desc    Get details of a specific bid (authorized client/freelancer only)
// NOTE: This wildcard route MUST be last among the /:id routes
router.get('/:id', protect, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found.' });
    }

    const task = await Task.findById(bid.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Associated task not found.' });
    }

    // Ensure the requester is either the freelancer who submitted the bid, OR the client who posted the task
    if (bid.freelancerId.toString() !== req.user.id && task.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized. You do not have permission to view this proposal.' });
    }

    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

