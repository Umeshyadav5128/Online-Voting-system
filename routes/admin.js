const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Candidate = require('../models/Candidate');

// Get vote results
router.get('/results', protect, admin, async (req, res) => {
  try {
    const candidates = await Candidate.find({}).sort({ voteCount: -1 });
    res.json(candidates);
  } catch (error) {
    console.error("Get Results Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a candidate
router.post('/candidate', protect, admin, async (req, res) => {
  const { name, party } = req.body;
  try {
    const candidate = await Candidate.create({ name, party });
    res.status(201).json(candidate);
  } catch (error) {
    console.error("Add Candidate Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed Initial Candidates
router.post('/seed', async (req, res) => {
   // Just a dev route to seed some data easily
   const count = await Candidate.countDocuments();
   if (count === 0) {
      await Candidate.insertMany([
         { name: 'John Doe', party: 'Progressive Party' },
         { name: 'Jane Smith', party: 'Conservative Party' },
         { name: 'Alice Johnson', party: 'Green Party' }
      ]);
      return res.json({ message: 'Database seeded' });
   }
   res.json({ message: 'Already seeded' });
});

module.exports = router;
