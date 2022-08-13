const ethers = require("ethers");

const fromBigNumberToGwei = (bigNumber) => {
  const balance = ethers.BigNumber.from(bigNumber._hex);
  return ethers.utils.formatUnits(balance, "gwei");
};

const fromBigNumberToEther = (bigNumber) => {
  const balance = ethers.BigNumber.from(bigNumber._hex);
  return ethers.utils.formatUnits(balance, "ether");
};

const printInGreen = (text, greenText) => {
  if (process.env.INSIDE_SERVER === "true") {
    console.log(`${text} => ${greenText}`);
  } else {
    console.log(`${text} [1;32m ${greenText}[0m`);
  }
};

const printInYellow = (text, yellowText) => {
  if (process.env.INSIDE_SERVER === "true") {
    console.log(`${text} => ${yellowText}`);
  } else {
    console.log(`${text} [1;33m ${yellowText}[0m`);
  }
};

const printInRed = (text, redText) => {
  if (process.env.INSIDE_SERVER === "true") {
    console.log(`${text} => ${redText}`);
  } else {
    console.log(`${text} [1;31m ${redText}[0m`);
  }
};

const printSpacer = (text) => {
  if (process.env.INSIDE_SERVER === "true") {
    console.log(`\n\n-${text}\n\n`);
  } else {
    console.log(`\n\n [1;33m -[0m ${text}\n\n`);
  }
};

const getAccountBalance = async (address, provider) =>
  fromBigNumberToEther(await provider.getBalance(address));

const calculateFinalTxFee = async (
  accountBalanceBefore,
  address,
  provider,
  usdPrice,
  estimatedTotalTxFeeInMatic,
  amountOfMaticToSend,
  catchBlock
) => {
  const _estimatedTotalTxFeeInMatic = formatToDecimals(
    estimatedTotalTxFeeInMatic + parseFloat(amountOfMaticToSend),
    8
  );
  console.log(`_estimatedTotalTxFeeInMatic`, _estimatedTotalTxFeeInMatic);

  const accountBalanceAfter = await getAccountBalance(address, provider);
  const txFee = formatToDecimals(accountBalanceBefore - accountBalanceAfter, 8);
  let feeEstimationHitRate = "";

  console.log(`amountOfMaticToSend`, amountOfMaticToSend);

  console.log();
  if (process.env.INSIDE_SERVER !== "true") {
    const catchBlockText = catchBlock ? "- [1;33m CATCH BLOCK[0m -> " : "";

    feeEstimationHitRate = formatToDecimals(
      (txFee / parseFloat(_estimatedTotalTxFeeInMatic)) * 100,
      2
    );
    const coloredHitRate =
      feeEstimationHitRate <= 100 ? 2 : feeEstimationHitRate < 130 ? 3 : 1; // green - yellow - red

    // TODO: add function textInRedForConsole, in green, etc
    console.log(
      catchBlockText + "⛽️ Tx: ",
      `[1;36m estimated: ${_estimatedTotalTxFeeInMatic}[0m`,
      "/",
      `[1;33m actual: ${txFee}[0m `,
      `= [1;3${coloredHitRate}m % ${feeEstimationHitRate}[0m`
    );
    console.log();
    if (usdPrice) {
      printInGreen(
        catchBlockText + "💵 Tx fee in usd: ",
        parseFloat(txFee) * parseFloat(usdPrice)
      );
      console.log();
    }
  } else {
    // TODO: same than above but without colored text
    // TODO: make atomic function color text & inside ask for insideServer
    // const catchBlockText = "- CATCH BLOCK -> ";
    // printInGreen(catchBlock ? catchBlockText : "" + "⛽️ Tx fee: ", txFee);
    // console.log(
    //   `standard -> ${standardByOracle}`,
    //   `fast -> ${fastByOracle}`,
    //   `with-tip -> ${fromBigNumberToGwei(gasWithTip)}`
    // );
    // console.log();
    // if (usdPrice) {
    //   printInGreen(
    //     `${catchBlock ? textCatchInYellow : ""}` + "💵 Tx fee in usd: ",
    //     parseFloat(txFee) * parseFloat(usdPrice)
    //   );
    //   console.log();
    // }
  }

  return { txFee, feeEstimationHitRate };
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const formatToDecimals = (number, decimals = 4) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(parseFloat(number));
};

const estimatedCostOfTx = (gasPrice, gasLimit, usdPrice) => {
  let _gasLimit = ethers.BigNumber.from(gasLimit._hex);
  _gasLimit = ethers.utils.formatUnits(_gasLimit, "gwei");
  _gasLimit = parseFloat(_gasLimit);

  let _gasPrice = ethers.BigNumber.from(gasPrice._hex);
  _gasPrice = ethers.utils.formatUnits(_gasPrice, "gwei");
  _gasPrice = parseFloat(_gasPrice);

  const estimatedMaticCost = formatToDecimals(_gasLimit * _gasPrice, 8);
  const estimatedUsdCost = formatToDecimals(
    estimatedMaticCost * parseFloat(usdPrice),
    8
  );

  return {
    estimatedMaticCost,
    estimatedUsdCost,
  };
};

module.exports = {
  errors: {
    ALREADY_SAVED_THIS_TRANSACTION_ID: "already saved this transactionId",
  },
  printSpacer,
  printInGreen,
  printInYellow,
  printInRed,
  getAccountBalance,
  fromBigNumberToGwei,
  fromBigNumberToEther,
  calculateFinalTxFee,
  getRandomInt,
  formatToDecimals,
  estimatedCostOfTx,
};
