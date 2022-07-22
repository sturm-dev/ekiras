const ethers = require("ethers")

const fromPrivateKeyToAddress = (privateKey) => {
  const wallet = new ethers.Wallet(privateKey)
  return wallet.address
}

const getAccountBalance = async (address, rpc_url) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc_url)
  return formatBalance((await provider.getBalance(address))._hex)
}

const formatBalance = (balanceInHex) => {
  if (!balanceInHex) return undefined

  const balance = ethers.BigNumber.from(balanceInHex)
  const amountOfBalance = ethers.utils.formatEther(balance)
  return mathRound(amountOfBalance)
}

const mathRound = (amountOfBalance) => Math.round(amountOfBalance * 1e4) / 1e4

module.exports = {
  getAccountBalance,
  formatBalance,
  fromPrivateKeyToAddress,
  mathRound,
}
