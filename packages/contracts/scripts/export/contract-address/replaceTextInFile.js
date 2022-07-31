const fs = require("fs")
const path = require("path")

const replaceTextInFile = (oldText, newText, dir) => {
  try {
    const resolvedDir = path.resolve(__dirname, dir)

    const file = fs.readFileSync(resolvedDir, "utf8")
    const modifiedFile = file.replaceAll(oldText, newText)

    fs.writeFileSync(resolvedDir, modifiedFile)
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = replaceTextInFile
