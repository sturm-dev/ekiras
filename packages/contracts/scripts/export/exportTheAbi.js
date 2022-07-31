const getTheAbiSync = require("./getTheAbi")
const writeTheAbiSync = require("./writeTheAbi")

const exportTheAbi = () => {
  try {
    const abi = getTheAbiSync()

    // in packages/contracts
    writeTheAbiSync(abi, "../../builded-abi/abi.json")
    // in packages/akash-node
    writeTheAbiSync(abi, "../../../akash-node/docker-image/src/abi.json")
    // in packages/rn-app
    writeTheAbiSync(abi, "../../../rn-app/src/db/abi.json")
    // in packages/subgraph
    writeTheAbiSync(abi, "../../../subgraph/abis/JustFeedback.json")
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = exportTheAbi
