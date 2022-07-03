const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");
const { getAccountBalance } = require("./utils");

// ────────────────────────────────────────────────────────────────────────────────

// TODO: give correct gas fee to deploy script `1900000` ? - the contract use 412 btt
//
// TODO: use `ethers` instead of `web3`
// TODO: learn to verify the contract from console

// ────────────────────────────────────────────────────────────────────────────────

const publicAddress = "0xbe921007385971d169a4596ECC175A91f8710a56";

const provider = new HDWalletProvider(
  "west artefact armor surround despair bacon dress unlock armor paper couple ripple", // bttc mainnet with 10usd
  "https://bttc.getblock.io/mainnet/?api_key=538c9c6c-35d3-42f2-a58a-e4060ef3367f"
);
const web3 = new Web3(provider);

const deploy = async () => {
  console.log(`evm.bytecode`, evm.bytecode, typeof evm.bytecode);
  console.log("abi", JSON.stringify(abi, null, 2));

  const accountBalanceBefore = await getAccountBalance(publicAddress);
  // ────────────────────────────────────────────────────────────────────────────────
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "1900000", from: accounts[0] });

  console.log(
    "Contract deployed to",
    `https://bttcscan.com/address/${result.options.address}`
  );
  // ────────────────────────────────────────────────────────────────────────────────
  const accountBalanceAfter = await getAccountBalance(publicAddress);
  const uploadContractFee = accountBalanceBefore - accountBalanceAfter;
  console.log(`uploadContractFee`, uploadContractFee, typeof uploadContractFee);

  provider.engine.stop();
};
deploy();
