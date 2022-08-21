const ethers = require("ethers");

const {
  printSpacer,
  printInYellow,
  formatToDecimals,
  textInBlueForConsole,
  textInGreenForConsole,
  customLogger,
} = require("../utils");

// ────────────────────────────────────────────────────────────────────────────────

// TODO: try to use contract instead of wallet

const sendBalanceToUserAddress = async (
  wallet,
  { gasWithTip, usdPrice },
  userPublicAddress,
  isSandbox,
  { estimatedLimit, estimatedCost },
  estimatedMaticToSend
) => {
  // ────────────────────────────────────────────────────────────────────────────────
  const estimatedUsdCost = formatToDecimals(
    parseFloat(estimatedCost) * parseFloat(usdPrice),
    8
  );

  if (parseFloat(estimatedUsdCost) >= parseFloat(process.env.TX_PRICE_LIMIT))
    throw Error(`TX cost is greater than ${process.env.TX_PRICE_LIMIT}`);

  customLogger(
    "⛽️ Estimated cost of send balance to user:",
    textInBlueForConsole("\n\t\t\t\t\t\t(🪙 MATIC):\t", estimatedCost),
    textInGreenForConsole("\n\t\t\t\t\t\t(💵 USD):\t", estimatedUsdCost)
  );

  // ────────────────────────────────────────────────────────────────────────────────

  if (isSandbox) {
    customLogger(
      `\nreal matic to send if not sandbox`,
      formatToDecimals(estimatedMaticToSend, 8)
    );
  }

  const amountOfMaticToSend = isSandbox
    ? "0.03"
    : formatToDecimals(estimatedMaticToSend, 8);

  printInYellow(
    `\namountOfMaticToSend - isSandbox: ${isSandbox}`,
    amountOfMaticToSend
  );

  // ────────────────────────────────────────────────────────────────────────────────

  printSpacer("Mining transaction...");
  const tx = await wallet.sendTransaction({
    to: userPublicAddress,
    value: ethers.utils.parseEther(amountOfMaticToSend),
    gasPrice: gasWithTip,
    gasLimit: estimatedLimit,
  });

  customLogger(`\ntx: send balance to user`, tx);

  printSpacer("Transaction mined!", tx.hash);
  const receipt = await tx.wait();
  // The transaction is now on chain!
  customLogger(`Mined in block ${receipt.blockNumber}`);

  return {
    amountOfMaticSentToTheUser: amountOfMaticToSend,
    txHash: tx.hash,
  };
};

module.exports = sendBalanceToUserAddress;
