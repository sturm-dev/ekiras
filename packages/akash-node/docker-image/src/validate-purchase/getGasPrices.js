const axios = require("axios");
const ethers = require("ethers");

const { gasPriceMul, printInGreen, fromBigNumberToGwei } = require("../utils");

const getGasPrices = async (provider) => {
  const gasPriceBaseFromProvider = await provider.getGasPrice();

  // TODO: use this endpoint with a password to not spend api calls
  // API -> 5 calls/second limit
  // Up to 100,000 API calls per day
  const gasOracle = await axios.get(
    `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`
  );

  console.log(`gasOracle.data`, gasOracle.data);

  const fastPrice = gasOracle.data.result.FastGasPrice;
  const usdPrice = gasOracle.data.result.UsdPrice;
  const fastPriceFormatted = ethers.utils.parseUnits(`${fastPrice}`, "gwei");

  const gasPrices = {
    usdPrice,
    gasPriceBaseFromProvider: gasPriceBaseFromProvider,
    fastPriceByPolygonOracle: fastPriceFormatted,
    veryFastPrice: gasPriceMul(fastPriceFormatted, 1.3),
  };

  printGasPrices(gasPrices);

  return gasPrices;
};

const printGasPrices = ({
  gasPriceBaseFromProvider,
  fastPriceByPolygonOracle,
  veryFastPrice,
}) => {
  console.log();

  printInGreen(
    "gas Price Base From Provider: ",
    fromBigNumberToGwei(gasPriceBaseFromProvider)
  );
  printInGreen(
    "fast price by polygon oracle: ",
    fromBigNumberToGwei(fastPriceByPolygonOracle)
  );
  printInGreen("very Fast Price: ", fromBigNumberToGwei(veryFastPrice));

  console.log();
};

module.exports = getGasPrices;
