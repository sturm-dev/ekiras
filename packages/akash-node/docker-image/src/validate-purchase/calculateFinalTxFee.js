const {
  textInYellowForConsole,
  textInCyanForConsole,
  getConsoleTextByColor,
  formatToDecimals,
  getAccountBalance,
  printInGreen,
} = require("../utils");

const calculateFinalTxFee = async (
  accountBalanceBefore,
  address,
  provider,
  usdPrice,
  estimatedTotalTxFeeInMatic,
  amountOfMaticToSend,
  catchBlock
) => {
  const accountBalanceAfter = await getAccountBalance(address, provider);
  const txRealFee = formatToDecimals(
    accountBalanceBefore - accountBalanceAfter,
    8
  );

  // add amount send to the user to the network fee
  const _estimatedTotalTxFeeInMatic = formatToDecimals(
    estimatedTotalTxFeeInMatic + parseFloat(amountOfMaticToSend),
    8
  );
  const txOnlyNetworkFee = formatToDecimals(
    parseFloat(txRealFee) - parseFloat(amountOfMaticToSend),
    8
  );

  let feeEstimationHitRate = "";

  console.log();
  const catchBlockText = catchBlock
    ? textInYellowForConsole("- ", "CATCH BLOCK")
    : "";

  feeEstimationHitRate = formatToDecimals(
    (txRealFee / parseFloat(_estimatedTotalTxFeeInMatic)) * 100,
    2
  );
  const coloredHitRate =
    feeEstimationHitRate <= 100 ? 2 : feeEstimationHitRate < 130 ? 3 : 1; // green - yellow - red

  console.log(
    catchBlockText + "⛽️ Tx fee in matic: ",
    textInCyanForConsole("", `estimated: ${_estimatedTotalTxFeeInMatic}`),
    "/",
    textInYellowForConsole("", `actual: ${txRealFee}`),
    getConsoleTextByColor("= ", `% ${feeEstimationHitRate}`, coloredHitRate),
    "\n"
  );

  if (usdPrice) {
    printInGreen(
      catchBlockText + "💵 Tx fee in usd: ",
      parseFloat(txRealFee) * parseFloat(usdPrice)
    );

    console.log();
  }

  return { txRealFee, txOnlyNetworkFee, feeEstimationHitRate };
};

module.exports = calculateFinalTxFee;
