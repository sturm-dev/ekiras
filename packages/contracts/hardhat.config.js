require("@nomiclabs/hardhat-waffle")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const TESTNET__RPC_FULL_URL = process.env.TESTNET__RPC_FULL_URL
const TESTNET__PRIVATE_KEY = process.env.TESTNET__PRIVATE_KEY
const TESTNET__ETHERSCAN_API_KEY = process.env.TESTNET__ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    polygonMumbai: {
      url: TESTNET__RPC_FULL_URL,
      accounts: [TESTNET__PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: TESTNET__ETHERSCAN_API_KEY,
    },
  },
  solidity: {
    version: "0.8.8",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
