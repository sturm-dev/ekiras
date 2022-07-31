const fs = require("fs")
const path = require("path")

const writeFileSync = (dir, content) => {
  try {
    const resolvedDir = path.resolve(__dirname, dir)

    // create folders if not exists
    const filename = path.basename(resolvedDir)
    const dirWithoutFilename = resolvedDir
      .toString()
      .replace(`/${filename}`, "")
    if (!fs.existsSync(dirWithoutFilename)) {
      fs.mkdirSync(dirWithoutFilename, { recursive: true })
    }
    fs.writeFileSync(resolvedDir, content)
  } catch (e) {
    console.log(`writeFileSync error ->`, e)
  }
}

module.exports = writeFileSync
