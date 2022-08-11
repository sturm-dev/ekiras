const { getRandomInt, printInYellow, estimatedCostOfTx } = require("../utils");

const saveTxId = async (contract, { gasWithTip, usdPrice }, postResult) => {
  let transactionId = postResult.data.receipt.in_app[0].transaction_id;
  if (process.env.INSIDE_SERVER !== "true") {
    transactionId = getRandomInt(100, 10000);
  }

  // ────────────────────────────────────────────────────────────────────────────────

  const estimatedLimit = await contract.estimateGas.addTransactionId(
    transactionId,
    { gasPrice: gasWithTip }
  );

  const { estimatedUsdCost } = estimatedCostOfTx(
    gasWithTip,
    estimatedLimit,
    usdPrice
  );
  printInYellow(
    "⛽️ Estimated cost of save TX_id (💵 USD): ",
    estimatedUsdCost
  );

  if (parseFloat(estimatedUsdCost) >= parseFloat(process.env.TX_PRICE_LIMIT))
    throw Error("TX cost is too high");

  // ────────────────────────────────────────────────────────────────────────────────

  const tx = await contract.addTransactionId(transactionId, {
    gasPrice: gasWithTip,
    gasLimit: estimatedLimit,
  });
  console.log("\ntransactionId added", transactionId, tx);

  await new Promise((res) => {
    contract.on("AddTransactionIdEvent", (txId) => {
      if (parseInt(txId) === parseInt(txId._hex, 16)) res();
    });
  });
  console.log(`\nAddTransactionIdEvent emitted`);
};

module.exports = saveTxId;
