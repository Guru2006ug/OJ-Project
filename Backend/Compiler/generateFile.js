const fs = require("fs");
const path = require("path");

const generateFile = (code, filename, extension) => {
  const dir = path.join(__dirname, "..", "codes");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const fileName = extension === "java" ? "Main" : filename;
  const filePath = path.join(dir, `${fileName}.${extension}`);
  fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = generateFile;
