const oldContractAddressJson = require("../../../build/contract-address.json")
const replaceTextInFile = require("./replaceTextInFile")
const updateOldContractAddress = require("./updateOldContractAddress")

const exportContractAddress = (newAddress) => {
  try {
    const oldAddress = oldContractAddressJson["contract-address"]

    const dirs = [
      "../../../../akash-node/.env",
      "../../../../rn-app/.env",
      "../../../../subgraph/subgraph.yaml",
      "../../../../subgraph/networks.json",
    ]
    dirs.forEach((dir) => replaceTextInFile(oldAddress, newAddress, dir))

    updateOldContractAddress(newAddress)
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = exportContractAddress
