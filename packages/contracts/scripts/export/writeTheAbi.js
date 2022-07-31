const fs = require("fs")
const path = require("path")

const writeTheAbi = (abi, dir) => {
  try {
    const resolvedDir = path.resolve(__dirname, dir)
    fs.writeFileSync(resolvedDir, JSON.stringify(abi))
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = writeTheAbi
