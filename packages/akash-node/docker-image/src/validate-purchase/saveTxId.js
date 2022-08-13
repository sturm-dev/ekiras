const { getRandomInt, printInYellow } = require("../utils");

const saveTxId = async (
  contract,
  { gasWithTip },
  postResult,
  { estimatedUsdCost, estimatedLimit, estimatedMaticCost }
) => {
  let transactionId = postResult.data.receipt.in_app[0].transaction_id;
  if (process.env.INSIDE_SERVER !== "true") {
    transactionId = getRandomInt(100, 10000);
  }

  // ────────────────────────────────────────────────────────────────────────────────

  if (parseFloat(estimatedUsdCost) >= parseFloat(process.env.TX_PRICE_LIMIT))
    throw Error(`TX cost is greater than ${process.env.TX_PRICE_LIMIT}`);

  printInYellow(
    "⛽️ Estimated cost of save TX_id (🪙 MATIC): ",
    estimatedMaticCost
  );
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
