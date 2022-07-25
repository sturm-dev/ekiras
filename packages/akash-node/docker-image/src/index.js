// ────────────────────────────────────────────────────────────────────────────────
//
// - endpoint body:
//   - receipt-data
//   - password (app-store shared secret)
//   - user-public-address
//
// - logic:
//   - try to post body-data to itunes prod
//   - error with sandbox code -> try to post itunes sandbox
//   - no error (prod or sandbox) ->
//     - validate purchase ->
//       - get from response the transactionId of last purchase
//       - get the tx fast price from polygon oracle
//       - add transactionId (using tx fast price) to the smart contract (if error -> resolve error)
//       - calculate the balance to send to user
//         - get the price in USD of MATIC token from oracle
//         - 15 % apple/google cost for the in-app purchase
//       - send balance to user-public-address
//       - return success to rn-app
//
// ────────────────────────────────────────────────────────────────────────────────

const axios = require("axios");
const bodyParser = require("body-parser");
const app = require("express")();
const ethers = require("ethers");

const abi = require("./abi.json");
const {
  getGasPrices,
  printGasPrices,
  printSpacer,
  errors,
  printInGreen,
  getAccountBalance,
} = require("./utils.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PRIVATE_KEY =
  process.env.MAINNET === "true"
    ? process.env.MAINNET__PRIVATE_KEY
    : process.env.TESTNET__PRIVATE_KEY;
const RPC_FULL_URL =
  process.env.MAINNET === "true"
    ? process.env.MAINNET__RPC_FULL_URL
    : process.env.TESTNET__RPC_FULL_URL;
const CONTRACT_ADDRESS =
  process.env.MAINNET === "true"
    ? process.env.MAINNET__CONTRACT_ADDRESS
    : process.env.TESTNET__CONTRACT_ADDRESS;

// ────────────────────────────────────────────────────────────────────────────────
const calculateTxFee = async (accountBalanceBefore, address, provider) => {
  const accountBalanceAfter = await getAccountBalance(address, provider);
  const txFee = accountBalanceBefore - accountBalanceAfter;

  console.log(`accountBalanceBefore`, accountBalanceBefore);
  console.log(`accountBalanceAfter`, accountBalanceAfter);

  console.log();
  printInGreen("⛽️ Tx fee: ", txFee);
  console.log();

  return txFee;
};
// ────────────────────────────────────────────────────────────────────────────────

const validatePurchase = async (postResult, req) => {
  let provider;
  let wallet;
  let balanceBefore;

  try {
    printSpacer("Start with purchase validation ...");

    provider = new ethers.providers.JsonRpcProvider(RPC_FULL_URL);
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    balanceBefore = await getAccountBalance(wallet.address, provider);

    const userPublicAddress = req.body["user-public-address"];

    const in_app = postResult.data.receipt.in_app;
    console.log(`in_app`, JSON.stringify(in_app, null, 2));

    printSpacer(
      "TODO: get transactionId from in_app from last purchase (create more purchases)"
    );

    let transactionId = in_app[0].transaction_id;
    transactionId = Math.floor(Math.random() * 20000); // TODO: remove

    printSpacer("Getting contract...");

    const contract = await new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    // ────────────────────────────────────────────────────────────────────────────────

    printSpacer("Getting gas prices from polygon oracle...");

    const {
      usdPrice,
      gasPriceBaseFromProvider,
      fastPriceByPolygonOracle,
      veryFastPrice,
    } = await getGasPrices(provider);

    printGasPrices({
      gasPriceBaseFromProvider,
      fastPriceByPolygonOracle,
      veryFastPrice,
    });

    // ────────────────────────────────────────────────────────────────────────────────

    printSpacer("Adding transactionId to the smart contract...");

    const tx = await contract.addTransactionId(transactionId, {
      gasPrice: veryFastPrice,
    });
    console.log("transactionId added", transactionId, tx);

    await new Promise((res) => contract.on("AddTransactionIdEvent", res));
    console.log("AddTransactionIdEvent emitted");

    // ─────────────────────────────────────────────────────────────────

    printSpacer("TODO: send balance to user-public-address");

    // TODO: save on .env
    const costOfInAppPurchase = 0.15;
    const costOfBuyMatic__sturm_dev = 0.15; // maintain server costs - risk of loss
    const totalOfUsdToBuyMatic =
      1 - costOfInAppPurchase - costOfBuyMatic__sturm_dev;
    const amountOfMaticToTransferToTheUser = (
      totalOfUsdToBuyMatic * usdPrice
    ).toString();

    printInGreen(
      "amountOfMaticToTransferToTheUser",
      amountOfMaticToTransferToTheUser
    );

    const valueToSend = ethers.utils.parseEther(
      amountOfMaticToTransferToTheUser
    );

    console.log(`valueToSend`, valueToSend);

    const limit = await wallet.estimateGas({
      to: userPublicAddress,
      value: valueToSend,
      gasPrice: veryFastPrice,
    });

    console.log(`limit`, limit);

    printSpacer("Mining transaction...");
    const sendMatic = await wallet.sendTransaction({
      to: userPublicAddress,
      value: valueToSend,
      gasPrice: veryFastPrice,
      gasLimit: limit,
    });

    printSpacer("Transaction mined!", sendMatic.hash);
    const receipt = await sendMatic.wait();
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);

    printSpacer("Success! 🎉");

    // ─────────────────────────────────────────────────────────────────

    const txFee = await calculateTxFee(balanceBefore, wallet.address, provider);

    return { txFee, message: "Success!" };
  } catch (e) {
    printSpacer("INSIDE CATCH BLOCK");

    let txFee;

    try {
      txFee = await calculateTxFee(balanceBefore, wallet.address, provider);
    } catch (e) {
      console.log("calculateTxFee error ->", e);
    }

    if (e.toString().includes(errors.ALREADY_SAVED_THIS_TRANSACTION_ID)) {
      return { txFee, errorString: errors.ALREADY_SAVED_THIS_TRANSACTION_ID };
    } else {
      console.log("error ->", e);
      return { txFee, error: e, errorString: e.toString() };
    }
  }
};

const postToItunesProd = (dataToSend) =>
  new Promise(async (res, rej) => {
    try {
      printSpacer("axios post to itunes prod...");

      const postResult = await axios.post(
        "https://buy.itunes.apple.com/verifyReceipt",
        dataToSend
      );

      if (postResult.data.status && postResult.data.status === 21007)
        res("sandbox");
      else res(postResult);
    } catch (e) {
      rej(e);
    }
  });

const postToItunesSandbox = (dataToSend) =>
  new Promise(async (res, rej) => {
    try {
      printSpacer("axios post to itunes sandbox...");

      const postResult = await axios.post(
        "https://sandbox.itunes.apple.com/verifyReceipt",
        dataToSend
      );

      res(postResult);
    } catch (e) {
      rej(e);
    }
  });

app.post("/validate-purchase-ios", async (req, res) => {
  printSpacer("Starting...");

  const dataToSend = JSON.stringify({
    "receipt-data": req.body["receipt-data"],
    password: req.body["password"],
    "exclude-old-transactions": true,
  });

  // console.log(`dataToSend`, JSON.stringify(JSON.parse(dataToSend), null, 2));

  let result;

  try {
    const toProdResult = await postToItunesProd(dataToSend);

    if (toProdResult !== "sandbox") result = toProdResult;
    else result = await postToItunesSandbox(dataToSend);

    res.json(await validatePurchase(result, req));
  } catch (e) {
    console.log(`catch e`, e);

    res.json({ error: e, errorString: e.toString() });
  }
});

app.listen(process.env.port || 3000, () => {
  console.log(`Server running on port ${process.env.port || 3000}`);
});

// https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
// https://futurice.com/blog/validating-in-app-purchases-in-your-ios-app
