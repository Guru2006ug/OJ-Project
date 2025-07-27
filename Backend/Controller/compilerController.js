const generateFile = require("../Compiler/generateFile");
const executeCpp = require("../Compiler/executeCpp");
const executeJava = require("../Compiler/executeJava");
const executePython = require("../Compiler/executePython");
const { v4: uuid } = require("uuid");

const compileCode = async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required." });
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

      case "python":
        filepath = generateFile(code, jobId, "py");
        result = await executePython(filepath, input || "");
        break;

      default:
        return res.status(400).json({ error: "Unsupported language." });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Compilation Error:", err);
    res.status(500).json(err);
  }
};


module.exports = { compileCode };
