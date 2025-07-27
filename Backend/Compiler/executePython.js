const { exec } = require("child_process");

const executePython = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`python "${filepath}"`, (error, stdout, stderr) => {
      if (error) return reject({ error: stderr || error.message });
      resolve({ output: stdout });
    });
  });
};

module.exports = executePython;
