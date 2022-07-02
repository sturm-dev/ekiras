const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider(
  "west artefact armor surround despair bacon dress unlock armor paper couple ripple", // bttc mainnet with 10usd
  "https://bttc.getblock.io/mainnet/?api_key=538c9c6c-35d3-42f2-a58a-e4060ef3367f"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  // console.log("abi", JSON.stringify(abi, null, 2));
  // console.log(`evm.bytecode`, evm.bytecode, typeof evm.bytecode);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(
    "Contract deployed to",
    `https://bttcscan.com/address/${result.options.address}`
  );
  provider.engine.stop();
};
deploy();

// TODO: use `ethers` instead of `web3`
// TODO: learn to verify the contract from console
