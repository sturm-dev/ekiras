import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import {
  shortenAddress,
  useCall,
  useEthers,
  useLookupAddress,
} from "@usedapp/core";
import * as ethers from "ethers";
import React, { useEffect, useState } from "react";

import { Body, Button, Container, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";

import { addresses, abis } from "@my-app/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const ens = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  // Read more about useDapp on https://usedapp.io/
  const { error: contractCallError, value: tokenBalance } =
    useCall({
      contract: new Contract(addresses.bttcMulticall, abis.multicall),
      method: "getEthBalance",
      args: ["0xbe921007385971d169a4596ECC175A91f8710a56"],
    }) ?? {};

  if (contractCallError)
    console.log(
      `contractCallError`,
      contractCallError,
      typeof contractCallError
    );

  console.log(`tokenBalance`, tokenBalance, typeof tokenBalance);

  if (tokenBalance) {
    const balance = ethers.BigNumber.from(tokenBalance.balance._hex);
    let amountOfBTT = ethers.utils.formatEther(balance);
    amountOfBTT = Math.round(amountOfBTT * 1e4) / 1e4;
    console.log(`amountOfBTT`, amountOfBTT, typeof amountOfBTT);
  }

  const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  useEffect(() => {
    if (subgraphQueryError) {
      console.error(
        "Error while querying subgraph:",
        subgraphQueryError.message
      );
      return;
    }
    if (!loading && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, subgraphQueryError, data]);

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <Image src={logo} alt="ethereum-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        <Link href="https://reactjs.org">Learn React</Link>
        <Link href="https://usedapp.io/">Learn useDapp</Link>
        <Link href="https://thegraph.com/docs/quick-start">
          Learn The Graph
        </Link>
      </Body>
    </Container>
  );
}

export default App;
