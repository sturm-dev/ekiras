const fs = require("fs")
const path = require("path")

const dir = path.resolve(__dirname, "../../contracts/abi.json")

fs.writeFileSync(dir, "{}")

// TODO: read the file /contracts/artifacts/contracts/JustFeedback.sol/JustFeedback.json
// get the abi
// write the json file inside of contracts

// TODO: share the script to resolve this on
// https://ethereum.stackexchange.com/questions/37931/is-there-a-way-to-extract-abi-from-a-deployed-contract
// https://ethereum.stackexchange.com/questions/131400/how-to-get-abi-of-deployed-contract-using-ethersjs-in-hardhat
// https://github.com/ethers-io/ethers.js/issues/129
