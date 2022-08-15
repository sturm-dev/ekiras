const ethers = require("ethers");
const { getRandomInt, estimatedCostOfTx } = require("../utils");

const estimateCostOfSaveTxId = async (contract, { gasPrice }, postResult) => {
  let txId = postResult && postResult.data.receipt.in_app[0].transaction_id;
  if (process.env.INSIDE_SERVER !== "true") {
    txId = getRandomInt(100, 10000); // fake data for testing
  }

  const estimatedLimit = await contract.estimateGas.addTransactionId(txId, {
    gasPrice,
  });

  const estimatedCost = estimatedCostOfTx(gasPrice, estimatedLimit);
  return { estimatedLimit, estimatedCost };
};

const estimateCostOfSendBalanceToUser = async ({
  wallet,
  to,
  gasPrice,
  usdPrice,
}) => {
  const fakeAmountOfMaticToSend = 0.84 * parseFloat(usdPrice); // 0.99 - 0.15 (apple fee)
  const estimatedLimit = await wallet.estimateGas({
    to,
    value: ethers.utils.parseEther(fakeAmountOfMaticToSend.toString()),
    gasPrice,
  });

  const estimatedCost = estimatedCostOfTx(gasPrice, estimatedLimit);
  return { estimatedLimit, estimatedCost };
};

const estimateTotalCostOfTx = ({
  _saveTxIdCost,
  _sendBalanceToUserCost,
  usdPrice,
}) => {
  // ─────────────────────────────────────────────────────────────────
  const appleFee =
    parseFloat(process.env.APPLE_IN_APP_PURCHASE_FEE) *
    parseFloat(process.env.IN_APP_PURCHASE_PRICE) *
    parseFloat(usdPrice); // convert usd fee to matic
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
    parseFloat(process.env.IN_APP_PURCHASE_PRICE) * parseFloat(usdPrice) -
    totalCostOfTx;
  // ─────────────────────────────────────────────────────────────────

  return { appleFee, serverFee, totalCostOfTx, estimatedMaticToSend };
};

module.exports = {
  estimateCostOfSaveTxId,
  estimateCostOfSendBalanceToUser,
  estimateTotalCostOfTx,
};

// https://sharpsheets.io/blog/app-store-and-google-play-commissions-fees/
// https://existek.com/blog/how-do-developers-bypass-app-store-fees/#apple_app_store_fees
