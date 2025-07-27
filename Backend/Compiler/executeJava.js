const { exec } = require("child_process");
const path = require("path");

const executeJava = (filepath) => {
  const dir = path.dirname(filepath);
  return new Promise((resolve, reject) => {
    exec(`cd ${dir} && javac Main.java && java Main`, (error, stdout, stderr) => {
      if (error) return reject({ error: stderr || error.message });
      resolve({ output: stdout });
    });
  });
};

module.exports = executeJava;
