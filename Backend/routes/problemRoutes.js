const express = require("express");
const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} = require("../Controller/problemController");

const router = express.Router();

// Public Routes
router.get("/", getAllProblems);
router.get("/:id", getProblemById);

// Admin-only (you can add middleware later)
router.post("/", createProblem);
router.patch("/:id", updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;
