const ethers = require("ethers");
const dayjs = require("dayjs");

// ─── CONSOLE UTILS ─────────────────────────────────────────────────────────────────────────────

// https://stackoverflow.com/a/69874540 -> tables
// https://logfetch.com/js-console-colors/

const getConsoleTextByColor = (text, colorText, colorNumber) => {
  // 1 - red
  // 2 - green
  // 3 - yellow
  // 4 - blue
  // 6 - cyan
  if (process.env.INSIDE_SERVER !== "true")
    return `${text ? `${text} ` : ""}[1;3${colorNumber}m ${colorText}[0m`;
  else return `${text ? `${text} ` : ""}${colorText}`;
};

const textInRedForConsole = (text, colorText) =>
  getConsoleTextByColor(text, colorText, 1);

const textInGreenForConsole = (text, colorText) =>
  getConsoleTextByColor(text, colorText, 2);

const textInYellowForConsole = (text, colorText) =>
  getConsoleTextByColor(text, colorText, 3);

const textInBlueForConsole = (text, colorText) =>
  getConsoleTextByColor(text, colorText, 4);

const textInCyanForConsole = (text, colorText) =>
  getConsoleTextByColor(text, colorText, 6);

const printInGreen = (text, greenText) =>
  customLogger(textInGreenForConsole(text, greenText));

const printInYellow = (text, yellowText) =>
  customLogger(textInYellowForConsole(text, yellowText));

const printInRed = (text, redText) =>
  customLogger(textInRedForConsole(text, redText));

const printSpacer = (text) => {
  if (process.env.INSIDE_SERVER === "true") {
    customLogger(`\n\n-${text}\n\n`);
  } else {
    customLogger(`\n\n [1;33m -[0m ${text}\n\n`);
  }
};

const secondLog = (...args) => {
  if (process.env.ACTIVE_MORE_LOGS === "true") customLogger(...args);
};

const customLogger = (...args) => {
  // https://day.js.org/docs/en/durations/format //YYYY-MM-DDTHH:mm:ss

  if (process.env.INSIDE_SERVER === "true") {
    const formattedDate = dayjs().subtract(3, "hour").format("DD-MM HH:mm:ss");

    console.log(formattedDate + " \t", ...args);
  } else {
    console.log(...args);
  }
};

// ────────────────────────────────────────────────────────────────────────────────

const fromBigNumberToGwei = (bigNumber) => {
  const balance = ethers.BigNumber.from(bigNumber._hex);
  return ethers.utils.formatUnits(balance, "gwei");
};

const fromBigNumberToEther = (bigNumber) => {
  const balance = ethers.BigNumber.from(bigNumber._hex);
  return ethers.utils.formatUnits(balance, "ether");
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

const getAccountBalance = async (address, provider) =>
  fromBigNumberToEther(await provider.getBalance(address));

const estimatedCostOfTx = (gasPrice, gasLimit) => {
  if (!gasPrice || !gasLimit)
    throw new Error(
      "gasPrice or gasLimit is undefined inside of utils/estimatedCostOfTx"
    );

  let _gasLimit = ethers.BigNumber.from(gasLimit._hex);
  _gasLimit = ethers.utils.formatUnits(_gasLimit, "gwei");
  _gasLimit = parseFloat(_gasLimit);

  let _gasPrice = ethers.BigNumber.from(gasPrice._hex);
  _gasPrice = ethers.utils.formatUnits(_gasPrice, "gwei");
  _gasPrice = parseFloat(_gasPrice);

  return formatToDecimals(_gasLimit * _gasPrice, 8);
};

const getDecimalOfBigNumber = (bigNumber) => parseInt(bigNumber._hex, 16);

module.exports = {
  errors: {
    ALREADY_SAVED_THIS_TRANSACTION_ID: "already saved this transactionId",
  },
  getAccountBalance,
  fromBigNumberToGwei,
  fromBigNumberToEther,
  getRandomInt,
  formatToDecimals,
  estimatedCostOfTx,
  getDecimalOfBigNumber,
  // console ──────────────────
  getConsoleTextByColor,
  textInRedForConsole,
  textInGreenForConsole,
  textInYellowForConsole,
  textInBlueForConsole,
  textInCyanForConsole,
  printSpacer,
  printInGreen,
  printInYellow,
  printInRed,
  secondLog,
  customLogger,
};
