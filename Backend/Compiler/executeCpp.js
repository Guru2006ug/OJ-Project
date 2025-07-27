const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeCpp = (filePath, outputName) => {
  const outputDir = path.join(__dirname, "..", "outputs");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, outputName);

  return new Promise((resolve, reject) => {
    exec(`g++ ${filePath} -o ${outputPath} && ${outputPath}`, (error, stdout, stderr) => {
      if (error) return reject({ error: stderr || error.message });
      return resolve({ output: stdout });
    });
  });
};

module.exports = executeCpp;
