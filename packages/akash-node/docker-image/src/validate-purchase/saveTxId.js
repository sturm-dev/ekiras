const {
  getRandomInt,
  formatToDecimals,
  textInBlueForConsole,
  textInGreenForConsole,
  getDecimalOfBigNumber,
} = require("../utils");

const saveTxId = async (
  contract,
  { gasWithTip, usdPrice },
  postResult,
  { estimatedLimit, estimatedCost }
) => {
  let transactionId = postResult.data.receipt.in_app[0].transaction_id;
  if (process.env.INSIDE_SERVER !== "true") {
    transactionId = getRandomInt(100, 10000); // fake data for testing
  }

  // ────────────────────────────────────────────────────────────────────────────────
  const estimatedUsdCost = formatToDecimals(
    parseFloat(estimatedCost) * parseFloat(usdPrice),
    8
  );

  if (parseFloat(estimatedUsdCost) >= parseFloat(process.env.TX_PRICE_LIMIT))
    throw Error(`TX cost is greater than ${process.env.TX_PRICE_LIMIT}`);

  console.log(
    "⛽️ Estimated cost of save TX_id:",
    textInBlueForConsole("\n\t\t\t\t\t\t(🪙 MATIC):\t", estimatedCost),
    textInGreenForConsole("\n\t\t\t\t\t\t(💵 USD):\t", estimatedUsdCost)
  );

  // ────────────────────────────────────────────────────────────────────────────────

  const tx = await contract.addTransactionId(transactionId, {
    gasPrice: gasWithTip,
    gasLimit: estimatedLimit,
  });
  console.log("\ntx: save tx_id", transactionId, tx);

  await new Promise((res) => {
    contract.on("AddTransactionIdEvent", (txId) => {
      if (parseInt(transactionId) === getDecimalOfBigNumber(txId)) res();
    });
  });
  console.log(`\nAddTransactionIdEvent emitted`);
};

module.exports = saveTxId;
