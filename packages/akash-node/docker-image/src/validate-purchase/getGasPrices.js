const axios = require("axios");
const ethers = require("ethers");

const { fromBigNumberToGwei, formatToDecimals } = require("../utils");

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

  const gasTip = (parseFloat(fast) - parseFloat(standard)) / 2;
  const gasWithTip = formatToDecimals(parseFloat(fast) + gasTip, 2);

  const gasPrices = {
    usdPrice,
    standardByOracle: standard,
    fastByOracle: fast,
    gasWithTip: ethers.utils.parseUnits(gasWithTip, "gwei"),
  };

  printGasPrices(gasPrices);

  return gasPrices;
};

const printGasPrices = ({ standardByOracle, fastByOracle, gasWithTip }) => {
  console.log();

  if (process.env.INSIDE_SERVER === "true") {
    console.log(
      `standard -> ${standardByOracle}`,
      `fast -> ${fastByOracle}`,
      `with-tip -> ${fromBigNumberToGwei(gasWithTip)}`
    );
  } else {
    console.log(
      `standard -> [1;36m ${standardByOracle}[0m  `,
      `fast -> [1;33m ${fastByOracle}[0m  `,
      `with-tip -> [1;32m ${fromBigNumberToGwei(gasWithTip)}[0m`
    );
  }

  console.log();
};

module.exports = getGasPrices;
