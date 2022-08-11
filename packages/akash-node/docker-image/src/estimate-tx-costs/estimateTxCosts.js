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

  return { estimatedLimit, estimatedUsdCost, estimatedMaticCost };
};

module.exports = {
  estimateCostOfSaveTxId,
  estimateCostOfSendBalanceToUser,
};
