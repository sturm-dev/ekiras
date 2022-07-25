const ethers = require("ethers");
const axios = require("axios");

const gasPriceMulBy_1_3 = (gasPrice) => {
  const str = ethers.utils.formatEther(gasPrice);
  const eth = str * 1.3; // 1.3x gas price
  return ethers.utils.parseEther(eth.toFixed(18));
};

const getGasPrices = async (provider) => {
  const gasPriceBaseFromProvider = await provider.getGasPrice();

  const gasOracle = await axios.get(
    `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`
  );

  console.log(`gasOracle.data`, gasOracle.data);

  const fastPrice = gasOracle.data.result.FastGasPrice;
  const usdPrice = gasOracle.data.result.UsdPrice;
  const fastPriceFormatted = ethers.utils.parseUnits(`${fastPrice}`, "gwei");

  // ─────────────────────────

  // TODO: make logic to know which gas price to use (from polygon oracle)
  return {
    usdPrice,
    gasPriceBaseFromProvider: gasPriceBaseFromProvider,
    fastPriceByPolygonOracle: fastPriceFormatted,
    veryFastPrice: gasPriceMulBy_1_3(fastPriceFormatted),
  };
};

const fromBigNumberToGwei = (bigNumber) => {
  const balance = ethers.BigNumber.from(bigNumber._hex);
  return ethers.utils.formatUnits(balance, "gwei");
};

const fromBigNumberToEther = (bigNumber) => {
  const balance = ethers.BigNumber.from(bigNumber._hex);
  return ethers.utils.formatUnits(balance, "ether");
};

const printInGreen = (text, greenText) => console.log(`${text} [1;32m ${greenText}[0m`);

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

const printSpacer = (text) => console.log(`\n\n [1;33m -[0m ${text}\n\n`);

const errors = {
  ALREADY_SAVED_THIS_TRANSACTION_ID: "already saved this transactionId",
};

const getAccountBalance = async (address, provider) =>
  fromBigNumberToEther(await provider.getBalance(address));

module.exports = {
  getGasPrices,
  printGasPrices,
  printSpacer,
  errors,
  printInGreen,
  getAccountBalance,
};
