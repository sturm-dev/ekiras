const ethers = require("ethers");

const { printSpacer, printInYellow } = require("../utils");
const { estimateCostOfSendBalanceToUser } = require("./estimateTxCosts");

// https://sharpsheets.io/blog/app-store-and-google-play-commissions-fees/
// https://existek.com/blog/how-do-developers-bypass-app-store-fees/#apple_app_store_fees

const app_store__fee = 0.1485; // 15% of 0.99usd -> 0.1485usd
const sturm_dev__feePercentage = 0.2; // approx -> 0.03034usd

// + 0.1485usd (in-app purchase)
// + ~ 0.0022usd (save tx_id)
// + ~ 0.0010usd (send balance to user)
// total_txs_fee = 0.1517usd (total tx fee)
//
// sturm_dev_fee = total_txs_fee * sturm_dev__feePercentage ~= 0.03034usd

// total_tx_cost = app_store__fee + sturm_dev_fee = 0.18204usd

// ────────────────────────────────────────────────────────────────────────────────

// TODO: try to use contract instead of wallet

const sendBalanceToUserAddress = async (
  wallet,
  { usdPrice, gasWithTip },
  userPublicAddress,
  isSandbox
) => {
  // ────────────────────────────────────────────────────────────────────────────────
  // TODO: not call estimate here -> call in index & pass result to this function

  const { estimatedLimit, estimatedUsdCost } =
    await estimateCostOfSendBalanceToUser({
      wallet,
      to: userPublicAddress,
      gasPrice: gasWithTip,
      usdPrice,
    });

  if (parseFloat(estimatedUsdCost) >= parseFloat(process.env.TX_PRICE_LIMIT))
    throw Error(`TX cost is greater than ${process.env.TX_PRICE_LIMIT}`);

  printInYellow(
    "⛽️ Estimated cost of send balance to user (💵 USD): ",
    estimatedUsdCost
  );

  // - [ ] with the sum of the 2 tx costs, calculate the total estimated cost of the tx

  // ────────────────────────────────────────────────────────────────────────────────

  const valueToSend = calculateTheBalanceToSend(usdPrice, isSandbox);

  printSpacer("Mining transaction...");
  const tx = await wallet.sendTransaction({
    to: userPublicAddress,
    value: valueToSend,
    gasPrice: gasWithTip,
    gasLimit: estimatedLimit,
  });

  console.log(`\ntx: send balance to user`, tx);

  printSpacer("Transaction mined!", tx.hash);
  const receipt = await tx.wait();
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);

  return {
    amountOfMaticSentToTheUser: ethers.utils.formatUnits(valueToSend, "ether"),
    txHash: tx.hash,
  };
};

// ────────────────────────────────────────────────────────────────────────────────

const calculateTheBalanceToSend = (usdPrice, isSandbox) => {
  // const totalOfUsdToBuyMatic =
  //   1 - app_store__fee - costOfBuyMatic__sturm_dev;
  // const amountOfMaticToTransferToTheUser = isSandbox
  //   ? "0.01"
  //   : (totalOfUsdToBuyMatic * usdPrice).toString();

  const amountOfMaticToTransferToTheUser = "0.01";

  printInYellow(
    `\namountOfMaticToTransferToTheUser - isSandbox: ${isSandbox}`,
    amountOfMaticToTransferToTheUser
  );

  return ethers.utils.parseEther(amountOfMaticToTransferToTheUser);
};

module.exports = sendBalanceToUserAddress;
