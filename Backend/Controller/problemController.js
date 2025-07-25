const Problem = require("../models/Problem");

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch problems." });
  }
};

// Get one problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found." });
    }
    res.status(200).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch problem." });
  }
};

// Create a new problem (user required)
exports.createProblem = async (req, res) => {
  try {
    const { title, description, inputFormat, outputFormat, constraints, sampleInput, sampleOutput, difficulty, hiddenTestCases } = req.body;

    if (!title || !description || !inputFormat || !outputFormat || !difficulty) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newProblem = await Problem.create({
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
      difficulty,
      hiddenTestCases,
      user: req.user.id  // From authMiddleware
    });

    res.status(201).json({ message: "Problem created!", problem: newProblem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create problem." });
  }
};

// Update a problem
exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found." });

    if (problem.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own problems." });
    }

    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Problem updated!", problem: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update problem." });
  }
};

// Delete a problem
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: "Problem not found." });

    if (problem.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own problems." });
    }

    await problem.remove();
    res.status(200).json({ message: "Problem deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete problem." });
  }
};

