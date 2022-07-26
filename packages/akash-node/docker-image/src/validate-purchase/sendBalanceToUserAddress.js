const ethers = require("ethers");

const { printSpacer, printInGreen } = require("../utils");

const calculateTheBalanceToSend = (usdPrice, isSandbox) => {
  // TODO: save on .env
  const costOfInAppPurchase = 0.15;
  const costOfBuyMatic__sturm_dev = 0.15; // maintain server costs - risk of loss
  const totalOfUsdToBuyMatic =
    1 - costOfInAppPurchase - costOfBuyMatic__sturm_dev;
  const amountOfMaticToTransferToTheUser = isSandbox
    ? "0.01"
    : (totalOfUsdToBuyMatic * usdPrice).toString();

  printInGreen(
    `amountOfMaticToTransferToTheUser - isSandbox: ${isSandbox}`,
    amountOfMaticToTransferToTheUser
  );

  return ethers.utils.parseEther(amountOfMaticToTransferToTheUser);
};

const sendBalanceToUserAddress = async (
  wallet,
  { usdPrice, veryFastPrice },
  userPublicAddress,
  isSandbox
) => {
  const valueToSend = calculateTheBalanceToSend(usdPrice, isSandbox);

  const gasLimit = await wallet.estimateGas({
    to: userPublicAddress,
    value: valueToSend,
    gasPrice: veryFastPrice,
  });

  printSpacer("Mining transaction...");
  const tx = await wallet.sendTransaction({
    to: userPublicAddress,
    value: valueToSend,
    gasPrice: veryFastPrice,
    gasLimit,
  });

  console.log(`tx`, tx);

  printSpacer("Transaction mined!", tx.hash);
  const receipt = await tx.wait();
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
};

module.exports = sendBalanceToUserAddress;
