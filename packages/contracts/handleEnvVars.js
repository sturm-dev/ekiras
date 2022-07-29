const RPC_FULL_URL = (mainnet) =>
  mainnet
    ? process.env.MAINNET__RPC_FULL_URL
    : process.env.TESTNET__RPC_FULL_URL

const ETHERSCAN_ADDRESS_URL = (mainnet) =>
  mainnet
    ? process.env.MAINNET__ETHERSCAN_ADDRESS_URL
    : process.env.TESTNET__ETHERSCAN_ADDRESS_URL

module.exports = {
  RPC_FULL_URL,
  ETHERSCAN_ADDRESS_URL,
}
