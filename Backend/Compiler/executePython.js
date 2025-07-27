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
      if (error) return reject({ error: stderr || error.message });
      resolve({ output: stdout });
    });
  });
};


module.exports = executePython;
