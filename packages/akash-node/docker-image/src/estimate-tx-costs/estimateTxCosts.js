const ethers = require("ethers");
const { getRandomInt, estimatedCostOfTx } = require("../utils");

const estimateCostOfSaveTxId = async (contract, { gasPrice, usdPrice }) => {
  const estimatedLimit = await contract.estimateGas.addTransactionId(
    getRandomInt(100, 10000),
    { gasPrice }
  );

  const { estimatedUsdCost, estimatedMaticCost } = estimatedCostOfTx(
    gasPrice,
    estimatedLimit,
    usdPrice
  );

  return { estimatedUsdCost, estimatedLimit, estimatedMaticCost };
};

const estimateCostOfSendBalanceToUser = async ({
  wallet,
  to,
  gasPrice,
  usdPrice,
}) => {
  const estimatedLimit = await wallet.estimateGas({
    to,
    value: ethers.utils.parseEther((0.85 * parseFloat(usdPrice)).toString()),
    gasPrice,
  });

  const { estimatedUsdCost, estimatedMaticCost } = estimatedCostOfTx(
    gasPrice,
    estimatedLimit,
    usdPrice
  );

  return { estimatedUsdCost, estimatedLimit, estimatedMaticCost };
};

// TODO: check what is usd and what is matic
const estimateTotalCostOfTx = ({
  _saveTxIdCost,
  _sendBalanceToUserCost,
  usdPrice,
}) => {
  // ─────────────────────────────────────────────────────────────────
  const appleFee =
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

  return { appleFee, serverFee, totalCostOfTx, estimatedMaticToSend };
};

module.exports = {
  estimateCostOfSaveTxId,
  estimateCostOfSendBalanceToUser,
  estimateTotalCostOfTx,
};

// https://sharpsheets.io/blog/app-store-and-google-play-commissions-fees/
// https://existek.com/blog/how-do-developers-bypass-app-store-fees/#apple_app_store_fees
