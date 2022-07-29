const ethers = require("ethers");

const gasPriceMul = (gasPrice, mul) => {
  const str = ethers.utils.formatEther(gasPrice);
  const eth = str * mul;
  return ethers.utils.parseEther(eth.toFixed(18));
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

const printSpacer = (text) => console.log(`\n\n [1;33m -[0m ${text}\n\n`);

const getAccountBalance = async (address, provider) =>
  fromBigNumberToEther(await provider.getBalance(address));

const calculateTxFee = async (accountBalanceBefore, address, provider) => {
  const accountBalanceAfter = await getAccountBalance(address, provider);
  const txFee = accountBalanceBefore - accountBalanceAfter;

  console.log();
  printInGreen("⛽️ Tx fee: ", txFee);
  console.log();

  return txFee;
};

module.exports = {
  errors: {
    ALREADY_SAVED_THIS_TRANSACTION_ID: "already saved this transactionId",
  },
  printSpacer,
  printInGreen,
  getAccountBalance,
  fromBigNumberToGwei,
  fromBigNumberToEther,
  gasPriceMul,
  calculateTxFee,
};
