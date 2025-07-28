const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeJava = (filePath, outputName, input) => {
  const codesDir = path.dirname(filePath);
  const outputDir = path.join(__dirname, "..", "outputs");

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const inputPath = path.join(outputDir, `${outputName}.txt`);
  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    const command = `cd "${codesDir}" && javac Main.java && java Main < "${inputPath}"`;

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        const classFilePath = path.join(codesDir, "Main.class");
        if (fs.existsSync(classFilePath)) fs.unlinkSync(classFilePath);
      } catch (cleanupErr) {
        console.log("Cleanup error (Java):", cleanupErr.message);
      }

      if (error) {
        return reject({
          error: stderr || stdout || error.message || "Compilation error in Java code",
        });
      }

      return resolve({ output: stdout });
    });
  });
};

module.exports = executeJava;
