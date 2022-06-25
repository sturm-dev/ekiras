export const bttcChain = {
  chainId: 199,
  chainName: 'BitTorrent Chain Mainnet',
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: '0x365aEf443783331c487Eaf8C576A248f15e221c5',
  getExplorerAddressLink: (address: string) =>
    `https://bttcscan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://bttcscan.com/tx/${transactionHash}`,
  rpcUrl:
    'https://bttc.getblock.io/mainnet/?api_key=538c9c6c-35d3-42f2-a58a-e4060ef3367f',
  blockExplorerUrl: 'https://bttcscan.com',
  nativeCurrency: {
    name: 'BitTorrent-New',
    symbol: 'BTT',
    decimals: 18,
  },
};
