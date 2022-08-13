const ethers = require("ethers");

const { printSpacer, printInYellow, formatToDecimals } = require("../utils");

// ────────────────────────────────────────────────────────────────────────────────

// TODO: try to use contract instead of wallet

const sendBalanceToUserAddress = async (
  wallet,
  { gasWithTip },
  userPublicAddress,
  isSandbox,
  { estimatedLimit, estimatedUsdCost, estimatedMaticCost },
  estimatedMaticToSend
) => {
  // ────────────────────────────────────────────────────────────────────────────────

  if (parseFloat(estimatedUsdCost) >= parseFloat(process.env.TX_PRICE_LIMIT))
    throw Error(`TX cost is greater than ${process.env.TX_PRICE_LIMIT}`);

  printInYellow(
    "⛽️ Estimated cost of send balance to user (🪙 MATIC): ",
    estimatedMaticCost
  );
  printInYellow(
    "⛽️ Estimated cost of send balance to user (💵 USD): ",
    estimatedUsdCost
  );

  // ────────────────────────────────────────────────────────────────────────────────

  if (isSandbox) {
    console.log(
      `\nreal matic to send if not sandbox`,
      formatToDecimals(estimatedMaticToSend, 8)
    );
  }

  const amountOfMaticToSend = isSandbox
    ? "0.01"
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

  console.log(`\ntx: send balance to user`, tx);

  printSpacer("Transaction mined!", tx.hash);
  const receipt = await tx.wait();
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);

  return {
    amountOfMaticSentToTheUser: amountOfMaticToSend,
    txHash: tx.hash,
  };
};

module.exports = sendBalanceToUserAddress;
