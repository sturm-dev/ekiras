const { ethers, run, network } = require("hardhat")

const {
  getAccountBalance,
  fromPrivateKeyToAddress,
  mathRound,
} = require("./utils")

const { RPC_FULL_URL, ETHERSCAN_ADDRESS_URL } = require("../handleEnvVars")
const exportTheAbiSync = require("./export/abi")
const exportContractAddress = require("./export/contract-address")

async function deploy({ MAINNET }) {
  console.log(`\n\n [1;33m -[0m To deploy to ${MAINNET ? "mainnet" : "testnet"}...\n\n`)

  const JustFeedbackFactory = await ethers.getContractFactory("JustFeedback")

  const address = fromPrivateKeyToAddress(network.config.accounts[0])

  // TODO: try to get balance like this https://hardhat.org/tutorial/deploying-to-a-live-network#7.-deploying-to-a-live-network
  const accountBalanceBefore = await getAccountBalance(
    address,
    RPC_FULL_URL(MAINNET)
  )
  console.log(`accountBalanceBefore`, mathRound(accountBalanceBefore))
  // ────────────────────────────────────────────────────────────────────────────────
  console.log(`\n\n [1;33m -[0m Deploying smart contracts...\n\n`)

  const contract = await JustFeedbackFactory.deploy()
  await contract.deployed()

  console.log(
    "Contract deployed at:",
    `[1;32m ${ETHERSCAN_ADDRESS_URL(MAINNET)}${contract.address}[0m`
  )

  // hardhat.chainId = 31337
  if (network.config.chainId != 31337 && RPC_FULL_URL(MAINNET)) {
    console.log(`\n\n [1;33m -[0m Waiting for block confirmations...\n\n`)
    await contract.deployTransaction.wait(6)
    await verify(contract.address, [])
  }
  // ────────────────────────────────────────────────────────────────────────────────
  const accountBalanceAfter = await getAccountBalance(
    fromPrivateKeyToAddress(network.config.accounts[0]),
    RPC_FULL_URL(MAINNET)
  )
  const uploadContractFee = accountBalanceBefore - accountBalanceAfter
  console.log()
  console.log()
  console.log("accountBalanceAfter", mathRound(accountBalanceAfter))
  console.log("uploadContractFee", mathRound(uploadContractFee))
  // ────────────────────────────────────────────────────────────────────────────────
  console.log(`\n\n [1;33m -[0m Exporting the abi file to another projects...\n\n`)
  exportTheAbiSync()
  // ────────────────────────────────────────────────────────────────────────────────
  console.log(
    `\n\n [1;33m -[0m Exporting the contract address to another projects...\n\n`
  )
  exportContractAddress(contract.address)
  // ────────────────────────────────────────────────────────────────────────────────
  console.log(`\n\n [1;33m -[0m All finished! 🎉\n\n`)
}

async function verify(contractAddress, args) {
  console.log(`\n\n [1;33m -[0m Verifying contract...\n\n`)
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log(`[1;32m Already Verified![0m`) // log in green
    } else console.log(e)
  }
}

module.exports = deploy
