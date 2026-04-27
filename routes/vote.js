const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Candidate = require('../models/Candidate');

// Get all candidates
router.get('/candidates', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({});
    res.json(candidates);
  } catch (error) {
    console.error("Get Candidates Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cast a vote
router.post('/', protect, async (req, res) => {
  const { candidateId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user.hasVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.voteCount += 1;
    await candidate.save();

    user.hasVoted = true;
    await user.save();

    res.json({ message: 'Vote cast successfully', hasVoted: true });
  } catch (error) {
    console.error("Cast Vote Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
