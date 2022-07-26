const ethers = require("ethers");

const abi = require("../abi.json");
const {
  printSpacer,
  errors,
  getAccountBalance,
  calculateTxFee,
} = require("../utils.js");

const saveTxId = require("./saveTxId");
const getGasPrices = require("./getGasPrices");
const sendBalanceToUserAddress = require("./sendBalanceToUserAddress");

// ────────────────────────────────────────────────────────────────────────────────

const PRIVATE_KEY =
  process.env.MAINNET === "true"
    ? process.env.MAINNET__PRIVATE_KEY
    : process.env.TESTNET__PRIVATE_KEY;
const RPC_FULL_URL =
  process.env.MAINNET === "true"
    ? process.env.MAINNET__RPC_FULL_URL
    : process.env.TESTNET__RPC_FULL_URL;
const CONTRACT_ADDRESS =
  process.env.MAINNET === "true"
    ? process.env.MAINNET__CONTRACT_ADDRESS
    : process.env.TESTNET__CONTRACT_ADDRESS;

// ────────────────────────────────────────────────────────────────────────────────

const validatePurchase = async (postResult, req) => {
  let provider;
  let wallet;
  let balanceBefore;
  let amountOfMaticSentToTheUser = "0";

  try {
    printSpacer("Start with purchase validation...");

    const isSandbox = postResult.data.environment === "Sandbox";
    const userAddress = req.body["user-public-address"];

    provider = new ethers.providers.JsonRpcProvider(RPC_FULL_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // ────────────────────────────────────────────────────────────
    printSpacer("Getting account previous balance...");
    balanceBefore = await getAccountBalance(wallet.address, provider);

    printSpacer("Getting contract...");
    const contract = await new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    printSpacer("Getting gas prices from polygon oracle...");
    const gasPrices = await getGasPrices(provider);

    printSpacer("Adding transactionId to the smart contract...");
    await saveTxId(contract, gasPrices, postResult);

    printSpacer("Send balance to user...");
    amountOfMaticSentToTheUser = await sendBalanceToUserAddress(
      wallet,
      gasPrices,
      userAddress,
      isSandbox
    );
    // ────────────────────────────────────────────────────────────

    printSpacer("Success! 🎉");

    // ────────────────────────────────────────

    const txFee = await calculateTxFee(balanceBefore, wallet.address, provider);

    return { txFee, amountOfMaticSentToTheUser, message: "Success!" };
  } catch (e) {
    console.log(`\n\n[1;33m -- INSIDE VALIDATE PURCHASE CATCH BLOCK --[0m\n\n`); // log in yellow

    let txFee;

    try {
      txFee = await calculateTxFee(balanceBefore, wallet.address, provider);
    } catch (e) {
      console.log("calculateTxFee error ->", e);
    }

    if (e.toString().includes(errors.ALREADY_SAVED_THIS_TRANSACTION_ID)) {
      return {
        txFee,
        amountOfMaticSentToTheUser,
        errorString: errors.ALREADY_SAVED_THIS_TRANSACTION_ID,
      };
    } else {
      console.log("error ->", e);
      return {
        txFee,
        amountOfMaticSentToTheUser,
        error: e,
        errorString: e.toString(),
      };
    }
  }
};

module.exports = validatePurchase;
