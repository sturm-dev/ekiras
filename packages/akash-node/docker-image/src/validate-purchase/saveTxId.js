const { getRandomInt, printInYellow } = require("../utils");
const { estimateCostOfSaveTxId } = require("./estimateTxCosts");

const saveTxId = async (contract, { gasWithTip, usdPrice }, postResult) => {
  let transactionId = postResult.data.receipt.in_app[0].transaction_id;
  if (process.env.INSIDE_SERVER !== "true") {
    transactionId = getRandomInt(100, 10000);
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // TODO: not call estimate here -> call in index & pass result to this function

  const { estimatedUsdCost, estimatedLimit } = await estimateCostOfSaveTxId(
    contract,
    { gasPrice: gasWithTip, usdPrice }
  );

  if (parseFloat(estimatedUsdCost) >= parseFloat(process.env.TX_PRICE_LIMIT))
    throw Error(`TX cost is greater than ${process.env.TX_PRICE_LIMIT}`);

  printInYellow(
    "⛽️ Estimated cost of save TX_id (💵 USD): ",
    estimatedUsdCost
  );

  // ────────────────────────────────────────────────────────────────────────────────

  const tx = await contract.addTransactionId(transactionId, {
    gasPrice: gasWithTip,
    gasLimit: estimatedLimit,
  });
  console.log("\ntx: save tx_id", transactionId, tx);

  await new Promise((res) => {
    contract.on("AddTransactionIdEvent", (txId) => {
      if (parseInt(txId) === parseInt(txId._hex, 16)) res();
    });
  });
  console.log(`\nAddTransactionIdEvent emitted`);
};

module.exports = saveTxId;
