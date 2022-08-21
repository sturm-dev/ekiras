const ethers = require("ethers");

const abi = require("../abi.json");
const {
  printSpacer,
  printInRed,
  formatToDecimals,
  fromBigNumberToGwei,
  customLogger,
} = require("../utils.js");
const getGasPrices = require("../validate-purchase/getGasPrices");
const {
  estimateCostOfSaveTxId,
  estimateCostOfSendBalanceToUser,
  estimateTotalCostOfTx,
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

    const provider = new ethers.providers.StaticJsonRpcProvider(RPC_FULL_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    printSpacer("Getting contract...");
    const contract = await new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    printSpacer("Getting gas prices from polygon oracle...");
    const { gasWithTip, usdPrice, standardByOracle, fastByOracle } =
      await getGasPrices();

    // ─────────────────────────────────────────────────────────────────
    const { estimatedCost: _saveTxIdCost } = await estimateCostOfSaveTxId(
      contract,
      { gasPrice: gasWithTip },
      { onlyEstimate: true }
    );
    // ─────────────────────────────────────────────────────────────────
    const { estimatedCost: _sendBalanceToUserCost } =
      await estimateCostOfSendBalanceToUser({
        wallet,
        to: publicAddressExample,
        gasPrice: gasWithTip,
        usdPrice,
      });
    // ─────────────────────────────────────────────────────────────────
    const { appleFee, serverFee, totalCostOfTx, estimatedMaticToSend } =
      estimateTotalCostOfTx({
        _saveTxIdCost,
        _sendBalanceToUserCost,
        usdPrice,
      });
    // ─────────────────────────────────────────────────────────────────

    printSpacer("Success! 🎉");

    // ────────────────────────────────────────
    return {
      usdPrice,
      gasPrices: {
        standard: standardByOracle,
        fast: fastByOracle,
        fastWithTip: fromBigNumberToGwei(gasWithTip),
      },
      estimatedCostsInMatic: {
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
      customLogger(e);
      customLogger(`\n error in string:`, e.toString());
      return {
        error: e,
        errorString: e.toString(),
      };
    }
  }
};

module.exports = estimateTxCosts;
