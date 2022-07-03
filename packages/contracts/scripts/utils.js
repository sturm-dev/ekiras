const ethers = require("ethers");

const getAccountBalance = async (address) => {
  const { rpcUrl, chainId, chainName } = bttcChain;
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl, {
    chainId,
    name: chainName,
  });

  return formatBTT((await provider.getBalance(address))._hex);
};

const bttcChain = {
  chainId: 199,
  chainName: "BitTorrent Chain Mainnet",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0x365aEf443783331c487Eaf8C576A248f15e221c5",
  getExplorerAddressLink: (address) =>
    `https://bttcscan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash) =>
    `https://bttcscan.com/tx/${transactionHash}`,
  rpcUrl:
    "https://bttc.getblock.io/mainnet/?api_key=538c9c6c-35d3-42f2-a58a-e4060ef3367f",
  blockExplorerUrl: "https://bttcscan.com",
  nativeCurrency: {
    name: "BitTorrent-New",
    symbol: "BTT",
    decimals: 18,
  },
};

const formatBTT = (balanceInHex) => {
  if (!balanceInHex) return undefined;

  const balance = ethers.BigNumber.from(balanceInHex);
  let amountOfBTT = ethers.utils.formatEther(balance);
  amountOfBTT = Math.round(amountOfBTT * 1e4) / 1e4;

  return amountOfBTT;
};

module.exports = { getAccountBalance, bttcChain, formatBTT };
