const getTheAbiSync = require("./getTheAbi")
const writeFileSync = require("../utils/writeFileSync")

const exportTheAbi = () => {
  try {
    const abi = getTheAbiSync()
    if (!abi) throw new Error("No abi found")

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
    dirs.forEach((dir) => writeFileSync(dir, JSON.stringify(abi)))
  } catch (e) {
    console.log(`exportTheAbi error ->`, e)
  }
}

module.exports = exportTheAbi
