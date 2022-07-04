const { ethers, run, network } = require("hardhat")
const {
  getAccountBalance,
  fromPrivateKeyToAddress,
  mathRound,
} = require("./utils")

async function main() {
  const JustFeedbackFactory = await ethers.getContractFactory("JustFeedback")

  const accountBalanceBefore = await getAccountBalance(
    fromPrivateKeyToAddress(network.config.accounts[0])
  )
  // ────────────────────────────────────────────────────────────────────────────────
  console.log(`\n\n`, "Deploying contract...")
  const justFeedback = await JustFeedbackFactory.deploy()
  await justFeedback.deployed()
  console.log(
    "Contract deployed at:",
    `https://bttcscan.com/address/${justFeedback.address}`
  )
  if (network.config.chainId != 31337 && process.env.BTTCSCAN_API_KEY) {
    console.log(`\n\n`, "Waiting for block confirmations...")
    await justFeedback.deployTransaction.wait(6)
    await verify(justFeedback.address, [])
  }
  // ────────────────────────────────────────────────────────────────────────────────
  const accountBalanceAfter = await getAccountBalance(
    fromPrivateKeyToAddress(network.config.accounts[0])
  )
  const uploadContractFee = accountBalanceBefore - accountBalanceAfter
  console.log(`uploadContractFee`, mathRound(uploadContractFee), "BTT")
}

async function verify(contractAddress, args) {
  console.log(`\n\n`, "Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
