const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeJava = (filePath, outputName, input) => {
  const codesDir = path.dirname(filePath);
  const outputDir = path.join(__dirname, "..", "outputs");
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const inputPath = path.join(outputDir, `${outputName}.txt`);
  fs.writeFileSync(inputPath, input);

  return new Promise((resolve, reject) => {
    // Execute Java program directly from codes directory
    const command = `cd "${codesDir}" && javac Main.java && java Main < "${inputPath}"`;

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        return reject({ error: stderr || error.message });
      }
      
      // Clean up input file after execution
      try {
        fs.unlinkSync(inputPath);
      } catch (cleanupError) {
        console.log("Cleanup error:", cleanupError.message);
      }
      
      return resolve({ output: stdout });
    });
  });
};

module.exports = executeJava;
