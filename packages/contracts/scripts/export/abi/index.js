const getTheAbiSync = require("./getTheAbi")
const writeTheAbiSync = require("./writeTheAbi")

const exportTheAbi = () => {
  try {
    const abi = getTheAbiSync()

    // in packages/contracts
    // in packages/akash-node
    // in packages/rn-app
    // in packages/subgraph
    const dirs = [
      "../../../build/abi.json",
      "../../../../akash-node/docker-image/src/abi.json",
      "../../../../rn-app/src/db/abi.json",
      "../../../../subgraph/abis/JustFeedback.json",
    ]
    dirs.forEach((dir) => writeTheAbiSync(abi, dir))
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = exportTheAbi
