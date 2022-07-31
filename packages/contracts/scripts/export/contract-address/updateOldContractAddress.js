const fs = require("fs")
const path = require("path")

const updateOldContractAddress = (newAddress) => {
  try {
    const resolvedDir = path.resolve(
      __dirname,
      "../../../build/contract-address.json"
    )
    // TODO: use write file
    fs.writeFileSync(
      resolvedDir,
      JSON.stringify({ "contract-address": newAddress })
    )
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports = updateOldContractAddress
