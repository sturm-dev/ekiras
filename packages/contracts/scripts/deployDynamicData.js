const { ethers, run } = require("hardhat")
const { formatBalance } = require("./utils")

// STEPS:
//
// 1. switch comment line of private key in hardhat.config.js
// 2. run script from package.json

async function deploy() {
  console.log(`\n\n [1;33m -[0m Deploying contract...\n\n`)

  const ContractFactory = await ethers.getContractFactory("DynamicData")

  const contract = await ContractFactory.deploy()
  await contract.deployed()

  console.log(
    `contract.address [1;32m https://polygonscan.com/address/${contract.address}[0m`
  )

  await contract.deployTransaction.wait(6)
  await verify(contract.address, [])

  const [deployer] = await ethers.getSigners()
  console.log(
    "Account balance:",
    formatBalance(await deployer.getBalance()).toString()
  )
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
    } else console.log("error when verifying the contract:", e)
  }
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
