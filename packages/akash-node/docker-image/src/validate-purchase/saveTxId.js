const getTxId = (postResult) => {
  const in_app = postResult.data.receipt.in_app;

  const in_app_sorted = in_app.sort((a, b) => {
    const msToDate = (ms) => new Date(parseInt(ms));

    if (msToDate(a.purchase_date_ms) > msToDate(b.purchase_date_ms)) return -1;
    if (msToDate(a.purchase_date_ms) < msToDate(b.purchase_date_ms)) return 1;
    else return 0;
  });

  return in_app_sorted[0].transaction_id;
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
