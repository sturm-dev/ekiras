const fs = require("fs")
const path = require("path")

const dir = path.resolve(__dirname, "../../contracts/abi.json")

fs.writeFileSync(dir, "{}")

// TODO: with the abi file generated -> export to another folders
