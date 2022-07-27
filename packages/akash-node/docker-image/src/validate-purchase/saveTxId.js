const saveTxId = async (contract, { veryFastPrice }, postResult) => {
  const transactionId = postResult.data.receipt.in_app[0].transaction_id;

  const tx = await contract.addTransactionId(transactionId, {
    gasPrice: veryFastPrice,
  });
  console.log("transactionId added", transactionId, tx);

  await new Promise((res) => contract.on("AddTransactionIdEvent", res));
  console.log(`\nAddTransactionIdEvent emitted`);
};

module.exports = saveTxId;
