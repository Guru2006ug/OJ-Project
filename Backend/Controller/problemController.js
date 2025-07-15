const Problem = require("../models/Problem");

// Create a new problem
exports.createProblem = async (req, res) => {
  try {
    const newProblem = await Problem.create(req.body);
    res.status(201).json({ message: "Problem created!", problem: newProblem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create problem." });
  }
};

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

// Update problem
exports.updateProblem = async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found." });
    }
    res.status(200).json({ message: "Problem updated!", problem: updatedProblem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update problem." });
  }
};

// Delete problem
exports.deleteProblem = async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found." });
    }
    res.status(200).json({ message: "Problem deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete problem." });
  }
};
