export const chainData = {
  chainId: 199,
  chainName: 'BitTorrent Chain Mainnet',
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: '0x365aEf443783331c487Eaf8C576A248f15e221c5',
  getExplorerAddressLink: (address: string) =>
    `https://bttcscan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://bttcscan.com/tx/${transactionHash}`,
  rpcUrl: (apiKey: string) =>
    `https://bttc.getblock.io/mainnet/?api_key=${apiKey}`,
  blockExplorerUrl: 'https://bttcscan.com',
  nativeCurrency: {
    name: 'BitTorrent-New',
    symbol: 'BTT',
    decimals: 18,
  },
};
