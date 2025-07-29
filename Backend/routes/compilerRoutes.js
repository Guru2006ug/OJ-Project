const express = require("express");
const { compileCode } = require("../Controller/compilerController");
const Submission = require("../models/Submission");



const router = express.Router();
router.post("/", compileCode); // endpoint: /api/compiler

router.post("/", async (req, res) => {
    try {
      const { problemId, code, language, input, expectedOutput } = req.body;
  
      // Simulated output & check (replace with real logic)
      const finalInput = input;
      const userOutput = "some result";
      const isPassed = userOutput === expectedOutput;
  
      await Submission.create({
        user: req.user.id,
        problem: problemId,
        language,
        code,
        input: finalInput,
        output: userOutput,
        expectedOutput,
        isPassed,
      });
  
      res.status(201).json({ message: "Submission saved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  

module.exports = router;
