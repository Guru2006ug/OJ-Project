const generateFile = require("../Compiler/generateFile");
const executeCpp = require("../Compiler/executeCpp");
const executeJava = require("../Compiler/executeJava");
const executePython = require("../Compiler/executePython");
const { v4: uuid } = require("uuid");

const compileCode = async (req, res) => {
  const { language, code, input, expectedOutput } = req.body;

  if (!language || !code) {
    return res.status(400).json({ message: "Language and code are required." });
  }

  const jobId = uuid();
  let filepath, result;

  try {
    switch (language) {
      case "cpp":
        filepath = generateFile(code, jobId, "cpp");
        result = await executeCpp(filepath, jobId, input || "");
        break;

      case "java":
        filepath = generateFile(code, jobId, "java");
        result = await executeJava(filepath, jobId, input || "");
        break;

      case "py":
        filepath = generateFile(code, jobId, "py");
        result = await executePython(filepath, input || "");
        break;

      default:
        return res.status(400).json({ message: "Unsupported language." });
    }

    let correct = undefined;
    if (expectedOutput !== undefined) {
      // Clean whitespace for comparison
      const normalize = (str) => str.trim().replace(/\r/g, "");
      correct = normalize(result.output) === normalize(expectedOutput);
    }

    return res.status(200).json({ output: result.output, correct });
  } catch (err) {
    console.error("Compilation Error:", err);
    return res.status(500).json({ message: "Execution error", error: err });
  }
};



module.exports = { compileCode };
