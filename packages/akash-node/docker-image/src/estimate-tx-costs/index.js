const ethers = require("ethers");

const abi = require("../abi.json");
const {
  printSpacer,
  printInRed,
  formatToDecimals,
  fromBigNumberToGwei,
} = require("../utils.js");
const getGasPrices = require("../validate-purchase/getGasPrices");
const {
  estimateCostOfSaveTxId,
  estimateCostOfSendBalanceToUser,
} = require("./estimateTxCosts");

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

const publicAddressExample = "0x1649d2c41583a9Ee322931BDAe470F67C317A8Fa";

const estimateTxCosts = async () => {
  try {
    printSpacer("Start with estimate tx costs...");

    const provider = new ethers.providers.JsonRpcProvider(RPC_FULL_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    printSpacer("Getting contract...");
    const contract = await new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    printSpacer("Getting gas prices from polygon oracle...");
    const { gasWithTip, usdPrice, standardByOracle, fastByOracle } =
      await getGasPrices();

    // ─────────────────────────────────────────────────────────────────
    const { estimatedUsdCost: _saveTxIdCost } = await estimateCostOfSaveTxId(
      contract,
      { gasPrice: gasWithTip, usdPrice }
    );
    // ─────────────────────────────────────────────────────────────────
    const { estimatedUsdCost: _sendBalanceToUserCost } =
      await estimateCostOfSendBalanceToUser({
        wallet,
        to: publicAddressExample,
        gasPrice: gasWithTip,
        usdPrice,
      });
    // ─────────────────────────────────────────────────────────────────
    let appleFee =
      parseFloat(process.env.APPLE_IN_APP_PURCHASE_FEE) *
      parseFloat(process.env.IN_APP_PURCHASE_PRICE);
    // ─────────────────────────────────────────────────────────────────
    const baseFee =
      parseFloat(appleFee) +
      parseFloat(_saveTxIdCost) +
      parseFloat(_sendBalanceToUserCost);
    // ─────────────────────────────────────────────────────────────────
    const serverFee = baseFee * parseFloat(process.env.SERVER_FEE);
    // ─────────────────────────────────────────────────────────────────
    const totalCostOfTx = baseFee + serverFee;
    // ─────────────────────────────────────────────────────────────────
    const estimatedMaticToSend =
      (parseFloat(process.env.IN_APP_PURCHASE_PRICE) - totalCostOfTx) *
      parseFloat(usdPrice);
    // ─────────────────────────────────────────────────────────────────

    printSpacer("Success! 🎉");

    // ────────────────────────────────────────
    return {
      gasPrices: {
        standard: standardByOracle,
        fast: fastByOracle,
        fastWithTip: fromBigNumberToGwei(gasWithTip),
      },
      estimatedCostsInUsd: {
        matic: usdPrice,
        saveTxId: _saveTxIdCost,
        sendBalanceToUser: _sendBalanceToUserCost,
        appleFee: formatToDecimals(appleFee, 8),
        serverFee: formatToDecimals(serverFee, 8),
        totalCostOfTx: formatToDecimals(totalCostOfTx, 8),
      },
      estimatedMaticToSend: formatToDecimals(estimatedMaticToSend, 8),
    };
  } catch (e) {
    printInRed("", "-- INSIDE ESTIMATE TX COSTS CATCH BLOCK --");

    if (e.toString().includes(`reason=`)) {
      const errorString = e.toString().split(`reason="`)[1].split(`"`)[0];
      printInRed("errorString reason=", errorString);
      return {
        error: e,
        errorString: errorString,
      };
    } else {
      console.error(e);
      console.log();
      console.log(`e.toString()`, e.toString());
      return {
        error: e,
        errorString: e.toString(),
      };
    }
  }
};

module.exports = estimateTxCosts;
