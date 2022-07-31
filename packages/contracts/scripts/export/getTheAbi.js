const fs = require("fs")
const path = require("path")

const getTheAbi = () => {
  try {
    const dir = path.resolve(
      __dirname,
      "../../artifacts/contracts/JustFeedback.sol/JustFeedback.json"
    )
    const file = fs.readFileSync(dir, "utf8")
    const json = JSON.parse(file)
    const abi = json.abi

    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = getTheAbi
