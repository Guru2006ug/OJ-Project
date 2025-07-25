const express = require("express");
const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} = require("../Controller/problemController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getAllProblems);
router.get("/:id", getProblemById);

// Authenticated users only
router.post("/", authMiddleware, createProblem);
router.put("/:id", authMiddleware, updateProblem);
router.delete("/:id", authMiddleware, deleteProblem);

module.exports = router;
