const fs = require("fs")
const path = require("path")

const writeFileSync = require("./writeFileSync")

const replaceTextInFile = (oldText, newText, dir) => {
  try {
    const resolvedDir = path.resolve(__dirname, dir)
    if (fs.existsSync(resolvedDir)) {
      const file = fs.readFileSync(resolvedDir, "utf8")
      const modifiedFile = file.replaceAll(oldText, newText)

      writeFileSync(dir, modifiedFile)
    } else throw new Error("File does not exist")
  } catch (e) {
    console.log(`replaceTextInFile error ->`, e)
  }
}

module.exports = replaceTextInFile
