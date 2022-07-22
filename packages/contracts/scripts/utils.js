const ethers = require("ethers")

const fromPrivateKeyToAddress = (privateKey) => {
  const wallet = new ethers.Wallet(privateKey)
  return wallet.address
}

const getAccountBalance = async (address, rpc_url) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc_url)
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
