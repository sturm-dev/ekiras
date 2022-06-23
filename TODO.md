# TODO

- [ ] test useDapp - basic example connection

- [ ] create & deploy a subgraph

```js
export const BttcChain = {
chainId: 199,
chainName: 'BitTorrent Chain Mainnet',
isTestChain: false,
isLocalChain: false,
multicallAddress: '0x365aEf443783331c487Eaf8C576A248f15e221c5',
getExplorerAddressLink: (address) => `https://bttcscan.com/address/${address}`,
getExplorerTransactionLink: (transactionHash) => `https://bttcscan.com/tx/${transactionHash}`,
// Optional parameters:
rpcUrl: 'https://rpc.bt.io/',
blockExplorerUrl: 'https://bttcscan.com',
}

const config = {
readOnlyChainId: BttcChain.chainId,
readOnlyUrls: {
    [Mainnet.chainId]:
    "https://bttc.getblock.io/mainnet/?api_key=538c9c6c-35d3-42f2-a58a-e4060ef3367f",
},
networks: [...DEFAULT_SUPPORTED_CHAINS, BttcChain],
};
```