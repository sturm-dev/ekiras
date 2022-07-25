const ethers = require("ethers");
const axios = require("axios");

const getGasPrices = async (provider) => {
  const price = await provider.getGasPrice();
  const str = ethers.utils.formatEther(price);
  const eth = str * 1.3; // 1.3x gas price
  const recommendedGasPrice = ethers.utils.parseEther(eth.toFixed(18));

  const gasOracle = await axios.get(
    `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`
  );

  const fastPrice = gasOracle.data.result.FastGasPrice;
  const fastPriceFormatted = ethers.utils.parseUnits(`${fastPrice}`, "gwei");

  // TODO: make logic to know which gas price to use (from polygon oracle)
  return {
    gasPriceMulBy_1_3: recommendedGasPrice,
    fastPriceByPolygonOracle: fastPriceFormatted,
  };
};

const fromBigNumberToGwei = (bigNumber) => {
  const balance = ethers.BigNumber.from(bigNumber._hex);
  return ethers.utils.formatUnits(balance, "gwei");
};

const printInGreen = (text, greenText) => console.log(`${text} [1;32m ${greenText}[0m`);

const printGasPrices = ({ gasPriceMulBy_1_3, fastPriceByPolygonOracle }) => {
  console.log();

  printInGreen(
    "gas price mul by 1.3: ",
    fromBigNumberToGwei(gasPriceMulBy_1_3)
  );
  printInGreen(
    "fast price by polygon oracle: ",
    fromBigNumberToGwei(fastPriceByPolygonOracle)
  );

  console.log();
};

module.exports = {
  getGasPrices,
  printGasPrices,
};
