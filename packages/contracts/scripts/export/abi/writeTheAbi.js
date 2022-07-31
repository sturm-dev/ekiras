const fs = require("fs")
const path = require("path")

// TODO: make function more generally -> writeFile(text, dir)
// TODO: if dir not exists -> create
const writeTheAbi = (abi, dir) => {
  try {
    const resolvedDir = path.resolve(__dirname, dir)
    fs.writeFileSync(resolvedDir, JSON.stringify(abi))
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = writeTheAbi
