const axios = require("axios");
const ethers = require("ethers");

const {
  fromBigNumberToGwei,
  formatToDecimals,
  textInCyanForConsole,
  textInYellowForConsole,
  textInGreenForConsole,
  textInBlueForConsole,
  secondLog,
} = require("../utils");

const getGasPrices = async () => {
  // TODO: use this endpoint with a password match in .env to not spend api calls
  // API -> 5 calls/second limit by polygon scan
  // Up to 100,000 API calls per day
  const gasOracle = await axios.get(
    `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`
  );

  const standard = gasOracle.data.result.ProposeGasPrice;
  const fast = gasOracle.data.result.FastGasPrice;
  const usdPrice = gasOracle.data.result.UsdPrice;

  const gasTip = parseFloat(fast) - parseFloat(standard);
  const gasWithTip = formatToDecimals(parseFloat(fast) + gasTip, 2);

  secondLog("gasWithTip", gasWithTip);

  const gasPrices = {
    usdPrice,
    standardByOracle: standard,
    fastByOracle: fast,
    gasWithTip: ethers.utils.parseUnits(gasWithTip, "gwei"), // TODO: error here "invalid decimal value"
  };

  printGasPrices(gasPrices);

  return gasPrices;
};

const printGasPrices = ({
  standardByOracle,
  fastByOracle,
  gasWithTip,
  usdPrice,
}) => {
  console.log();
  console.log(
    textInBlueForConsole("standard ->", standardByOracle),
    textInYellowForConsole("\tfast ->", fastByOracle),
    textInCyanForConsole("\twith-tip ->", fromBigNumberToGwei(gasWithTip)),
    textInGreenForConsole("\tusdPrice ->", usdPrice)
  );
  console.log();
};

module.exports = getGasPrices;
