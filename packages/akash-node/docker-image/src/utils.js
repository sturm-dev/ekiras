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
  catchBlock
) => {
  const accountBalanceAfter = await getAccountBalance(address, provider);
  const txFee = accountBalanceBefore - accountBalanceAfter;

  const textCatchInYellow =
    process.env.INSIDE_SERVER === "true"
      ? "- CATCH BLOCK -> "
      : "- [1;33m CATCH BLOCK[0m -> ";

  console.log();
  printInGreen(
    `${catchBlock ? textCatchInYellow : ""}` + "⛽️ Tx fee: ",
    txFee
  );
  console.log();

  if (usdPrice) {
    printInGreen(
      `${catchBlock ? textCatchInYellow : ""}` + "💵 Tx fee in usd: ",
      parseFloat(txFee) * parseFloat(usdPrice)
    );
    console.log();
  }

  return txFee;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const formatToTwoDecimals = (number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(number));
};

const formatToFourDecimals = (number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(parseFloat(number));
};

const estimatedCostOfTx = (gasPrice, gasLimit, usdPrice) => {
  let _gasLimit = ethers.BigNumber.from(gasLimit._hex);
  _gasLimit = ethers.utils.formatUnits(_gasLimit, "gwei");
  _gasLimit = parseFloat(_gasLimit);

  let _gasPrice = ethers.BigNumber.from(gasPrice._hex);
  _gasPrice = ethers.utils.formatUnits(_gasPrice, "gwei");
  _gasPrice = parseFloat(_gasPrice);

  const estimatedMaticCost = formatToFourDecimals(_gasLimit * _gasPrice);
  const estimatedUsdCost = formatToFourDecimals(
    estimatedMaticCost * parseFloat(usdPrice)
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
  formatToTwoDecimals,
  formatToFourDecimals,
  estimatedCostOfTx,
};
