const express = require("express");
const { compileCode } = require("../Controller/compilerController");

const router = express.Router();
router.post("/", compileCode); // endpoint: /api/compiler

module.exports = router;
