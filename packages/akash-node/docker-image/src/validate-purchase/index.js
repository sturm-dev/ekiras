const ethers = require("ethers");

const abi = require("../abi.json");
const {
  printSpacer,
  errors,
  getAccountBalance,
  calculateFinalTxFee,
  printInRed,
} = require("../utils.js");

const saveTxId = require("./saveTxId");
const getGasPrices = require("./getGasPrices");
const sendBalanceToUserAddress = require("./sendBalanceToUserAddress");
const {
  estimateCostOfSaveTxId,
  estimateCostOfSendBalanceToUser,
  estimateTotalCostOfTx,
} = require("../estimate-tx-costs/estimateTxCosts");

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
  let usdPrice = "0";
  let estimatedTotalTxFeeInMatic = 0;

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
    const gasPrices = await getGasPrices();
    usdPrice = gasPrices.usdPrice;

    printSpacer(
      "Estimating the cost to add transactionId to the smart contract..."
    );
    const estimatedData_addTxId = await estimateCostOfSaveTxId(contract, {
      gasPrice: gasPrices.gasWithTip,
      usdPrice,
    });
    estimatedTotalTxFeeInMatic += parseFloat(
      estimatedData_addTxId.estimatedMaticCost
    );

    printSpacer("Adding transactionId to the smart contract...");
    await saveTxId(contract, gasPrices, postResult, estimatedData_addTxId);

    printSpacer("Estimating the cost to send the balance to user...");
    const estimatedData_sendBalance = await estimateCostOfSendBalanceToUser({
      wallet,
      to: userAddress,
      gasPrice: gasPrices.gasWithTip,
      usdPrice,
    });
    estimatedTotalTxFeeInMatic += parseFloat(
      estimatedData_sendBalance.estimatedMaticCost
    );

    const { estimatedMaticToSend } = estimateTotalCostOfTx({
      _saveTxIdCost: estimatedData_addTxId.estimatedUsdCost,
      _sendBalanceToUserCost: estimatedData_sendBalance.estimatedUsdCost,
      usdPrice,
    });

    printSpacer("Send balance to user...");
    const { amountOfMaticSentToTheUser: _amountOfMaticSentToTheUser, txHash } =
      await sendBalanceToUserAddress(
        wallet,
        gasPrices,
        userAddress,
        isSandbox,
        estimatedData_sendBalance,
        estimatedMaticToSend
      );
    amountOfMaticSentToTheUser = _amountOfMaticSentToTheUser;
    // ────────────────────────────────────────────────────────────

    printSpacer("Success! 🎉");

    // ────────────────────────────────────────

    const { txFee, feeEstimationHitRate } = await calculateFinalTxFee(
      balanceBefore,
      wallet.address,
      provider,
      usdPrice,
      estimatedTotalTxFeeInMatic,
      amountOfMaticSentToTheUser
    );

    return { feeEstimationHitRate, txFee, txHash, amountOfMaticSentToTheUser };
  } catch (e) {
    printInRed("", "-- INSIDE VALIDATE PURCHASE CATCH BLOCK --");

    let txFee;

    try {
      const { txFee: _txFee } = await calculateFinalTxFee(
        balanceBefore,
        wallet.address,
        provider,
        usdPrice,
        estimatedTotalTxFeeInMatic,
        amountOfMaticSentToTheUser,
        true // inside of catch block
      );
      txFee = _txFee;
    } catch (e) {
      console.log("calculateFinalTxFee error ->", e);
    }

    if (e.toString().includes(errors.ALREADY_SAVED_THIS_TRANSACTION_ID)) {
      printInRed("", "ALREADY_SAVED_THIS_TRANSACTION_ID");
      return {
        txFee,
        amountOfMaticSentToTheUser,
        errorString: errors.ALREADY_SAVED_THIS_TRANSACTION_ID,
      };
    } else if (e.toString().includes(`reason=`)) {
      const errorString = e.toString().split(`reason="`)[1].split(`"`)[0];
      printInRed("errorString reason=", errorString);
      return {
        txFee,
        error: e,
        errorString: errorString,
      };
    } else {
      console.error(e);
      console.log();
      console.log(`error in string:`, e.toString());
      return {
        txFee,
        error: e,
        errorString: e.toString(),
      };
    }
  }
};

module.exports = validatePurchase;
