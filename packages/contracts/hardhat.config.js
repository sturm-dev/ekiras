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

const BTTC_RPC_URL = process.env.BTTC_RPC_URL
const BTTC_RPC_API_KEY = process.env.BTTC_RPC_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const BTTCSCAN_API_KEY = process.env.BTTCSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    bttc: {
      url: BTTC_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 199,
      httpHeaders: { "x-api-key": BTTC_RPC_API_KEY },
    },
  },
  etherscan: {
    apiKey: {
      bttc: BTTCSCAN_API_KEY,
    },
    customChains: [
      {
        network: "bttc",
        chainId: 199,
        urls: {
          apiURL: "https://api.bttcscan.com/api",
          browserURL: "https://bttcscan.com",
        },
      },
    ],
  },
  solidity: "0.8.8",
}
