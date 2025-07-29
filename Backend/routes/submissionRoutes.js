const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // ✅ REQUIRED!
const router = express.Router();

const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/submissions
// POST /api/submissions
router.post("/", authMiddleware, async (req, res) => {
    try {
      const { problemId, code, language, input, output, expectedOutput, isPassed } = req.body;
  
      const submission = new Submission({
        user: req.user.id,
        problem: new mongoose.Types.ObjectId(problemId), // ✅ FIXED
        language,
        code,
        input,
        output,
        expectedOutput,
        isPassed,
      });
  
      await submission.save();
      res.status(201).json({ message: "Submission saved", submission });
    } catch (error) {
      res.status(500).json({ message: "Error saving submission", error: error.message });
    }
  });
  

// GET /api/submissions/:problemId
router.get("/:problemId", authMiddleware, async (req, res) => {
    try {
      const { problemId } = req.params;
  
      if (!ObjectId.isValid(problemId)) {
        return res.status(400).json({ error: "Invalid problemId" });
      }
  
      const submissions = await Submission.find({
        user: req.user.id,
        problem: new ObjectId(problemId),
      }).sort({ createdAt: -1 });
  
      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching submissions", error: error.message });
    }
  });
module.exports = router;
