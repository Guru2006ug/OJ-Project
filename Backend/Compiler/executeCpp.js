const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeCpp = (filePath, outputName, input) => {
  const outputDir = path.join(__dirname, "..", "outputs");
  const inputPath = path.join(outputDir, `${outputName}.txt`);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, outputName);
  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    const command = `g++ ${filePath} -o ${outputPath} && ${outputPath} < ${inputPath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) return reject({ error: stderr || error.message });
      return resolve({ output: stdout });
    });
  });
};


module.exports = executeCpp;
