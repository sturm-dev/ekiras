const fs = require("fs")
const path = require("path")

const getTheAbi = () => {
  try {
    const dir = path.resolve(
      __dirname,
      "../../../artifacts/contracts/JustFeedback.sol/JustFeedback.json"
    )

    if (fs.existsSync(dir)) {
      const file = fs.readFileSync(dir, "utf8")
      const json = JSON.parse(file)
      const abi = json.abi

      return abi
    } else throw new Error("File does not exist")
  } catch (e) {
    console.log(`getTheAbi error ->`, e)
  }
}

module.exports = getTheAbi
