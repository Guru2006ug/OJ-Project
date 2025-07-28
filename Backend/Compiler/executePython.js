const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executePython = (filepath, input) => {
  const dir = path.dirname(filepath);
  const inputPath = path.join(dir, "input.txt");
  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    const command = `python "${filepath}" < "${inputPath}"`;

    exec(command, (error, stdout, stderr) => {
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      } catch (cleanupErr) {
        console.log("Cleanup error (Python):", cleanupErr.message);
      }

      if (error) {
        return reject({
          error: stderr || error.message || "Syntax/runtime error in Python code",
        });
      }

      return resolve({ output: stdout });
    });
  });
};

module.exports = executePython;
