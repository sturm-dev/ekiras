const { ethers, run, network } = require("hardhat")

const {
  getAccountBalance,
  fromPrivateKeyToAddress,
  mathRound,
} = require("./utils")

const TESTNET__RPC_FULL_URL = process.env.TESTNET__RPC_FULL_URL
const TESTNET__ETHERSCAN_ADDRESS_URL =
  process.env.TESTNET__ETHERSCAN_ADDRESS_URL

async function main() {
  const JustFeedbackFactory = await ethers.getContractFactory("JustFeedback")

  const address = fromPrivateKeyToAddress(network.config.accounts[0])

  const accountBalanceBefore = await getAccountBalance(address)
  console.log(`accountBalanceBefore`, mathRound(accountBalanceBefore))
  // ────────────────────────────────────────────────────────────────────────────────
  console.log(`\n\n [1;33m -[0m Deploying smart contracts...\n\n`)

  const contract = await JustFeedbackFactory.deploy()
  await contract.deployed()

  console.log(
    "Contract deployed at:",
    `[1;32m ${TESTNET__ETHERSCAN_ADDRESS_URL}${contract.address}[0m`
  )

  // hardhat.chainId = 31337
  if (network.config.chainId != 31337 && TESTNET__RPC_FULL_URL) {
    console.log(`\n\n [1;33m -[0m Waiting for block confirmations...\n\n`)
    await contract.deployTransaction.wait(6)
    await verify(contract.address, [])
  }
  // ────────────────────────────────────────────────────────────────────────────────
  const accountBalanceAfter = await getAccountBalance(
    fromPrivateKeyToAddress(network.config.accounts[0])
  )
  const uploadContractFee = accountBalanceBefore - accountBalanceAfter
  console.log()
  console.log()
  console.log("accountBalanceAfter", mathRound(accountBalanceAfter))
  console.log("uploadContractFee", mathRound(uploadContractFee))
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
