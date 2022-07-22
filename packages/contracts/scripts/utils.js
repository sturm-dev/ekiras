const ethers = require("ethers")

const TESTNET__RPC_FULL_URL = process.env.TESTNET__RPC_FULL_URL

const fromPrivateKeyToAddress = (privateKey) => {
  const wallet = new ethers.Wallet(privateKey)
  return wallet.address
}

const getAccountBalance = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider(TESTNET__RPC_FULL_URL)

  return formatBTT((await provider.getBalance(address))._hex)
}

const formatBTT = (balanceInHex) => {
  if (!balanceInHex) return undefined

  const balance = ethers.BigNumber.from(balanceInHex)
  const amountOfBTT = ethers.utils.formatEther(balance)
  return mathRound(amountOfBTT)
}

const mathRound = (amountOfBTT) => Math.round(amountOfBTT * 1e4) / 1e4

module.exports = {
  getAccountBalance,
  formatBTT,
  fromPrivateKeyToAddress,
  mathRound,
}
