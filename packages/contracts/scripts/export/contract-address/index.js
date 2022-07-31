const fs = require("fs")
const path = require("path")

const replaceTextInFile = require("../utils/replaceTextInFile")
const writeFileSync = require("../utils/writeFileSync")

const exportContractAddress = (newAddress) => {
  try {
    const contractAddressDir = path.resolve(
      __dirname,
      "../../../build/contract-address.json"
    )
    let oldAddress = ""

    if (fs.existsSync(contractAddressDir)) {
      const dir = path.resolve(__dirname, contractAddressDir)
      const file = fs.readFileSync(dir, "utf8")
      oldAddress = JSON.parse(file)["contract-address"]

      // only replace if already added the contract address at least once before
      const dirs = [
        "../../../../akash-node/.env",
        "../../../../rn-app/.env",
        "../../../../subgraph/subgraph.yaml",
        "../../../../subgraph/networks.json",
      ]
      dirs.forEach((dir) => replaceTextInFile(oldAddress, newAddress, dir))
    } else
      console.log(
        'this scripts "replace" old contract address with new one ' +
          "-> the first time you have to add the address in the files manually"
      )

    // update contract address in build folder
    writeFileSync(
      "../../../build/contract-address.json",
      JSON.stringify({ "contract-address": newAddress })
    )
  } catch (e) {
    console.log(`exportContractAddress error ->`, e)
  }
}

module.exports = exportContractAddress
