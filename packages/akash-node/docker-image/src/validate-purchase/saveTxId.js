const { printSpacer } = require("../utils");

const getTxId = (postResult) => {
  const in_app = postResult.data.receipt.in_app;
  console.log(`in_app`, JSON.stringify(in_app, null, 2));
  let transactionId = in_app[0].transaction_id;
  transactionId = Math.floor(Math.random() * 20000); // TODO: remove

  printSpacer(
    "TODO: get transactionId from in_app from last purchase (create more purchases)"
  );

  return transactionId;
};

const saveTxId = async (contract, { veryFastPrice }, postResult) => {
  const transactionId = getTxId(postResult);

  const tx = await contract.addTransactionId(transactionId, {
    gasPrice: veryFastPrice,
  });
  console.log("transactionId added", transactionId, tx);

  await new Promise((res) => contract.on("AddTransactionIdEvent", res));
  console.log(`\nAddTransactionIdEvent emitted`);
};

module.exports = saveTxId;
