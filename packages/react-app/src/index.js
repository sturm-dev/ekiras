import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DAppProvider, DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

export const BttcChain = {
  chainId: 199,
  chainName: "BitTorrent Chain Mainnet",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0x365aEf443783331c487Eaf8C576A248f15e221c5",
  getExplorerAddressLink: (address) =>
    `https://bttcscan.com/address/${address}`,
  getExplorerTransactionLink: (transactionHash) =>
    `https://bttcscan.com/tx/${transactionHash}`,
  // Optional parameters:
  rpcUrl: "https://rpc.bt.io/",
  blockExplorerUrl: "https://bttcscan.com",
  nativeCurrency: {
    name: "BitTorrent-New",
    symbol: "BTT",
    decimals: 18,
  },
};

const config = {
  readOnlyChainId: BttcChain.chainId,
  readOnlyUrls: {
    [BttcChain.chainId]:
      "https://bttc.getblock.io/mainnet/?api_key=538c9c6c-35d3-42f2-a58a-e4060ef3367f",
  },
  networks: [...DEFAULT_SUPPORTED_CHAINS, BttcChain],
};

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
});

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
