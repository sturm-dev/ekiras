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

const validatePurchase = async (postResult, req) => {
  printSpacer("Start with purchase validation ...");

  const userPublicAddress = req.body["user-public-address"];

  const in_app = postResult.data.receipt.in_app;
  console.log(`in_app`, JSON.stringify(in_app, null, 2));

  printSpacer(
    "TODO: get transactionId from in_app from last purchase (create more purchases)"
  );

  let transactionId = in_app[0].transaction_id;
  // transactionId = Math.floor(Math.random() * 20000); // TODO: remove

  try {
    printSpacer("Getting contract...");

    const provider = new ethers.providers.JsonRpcProvider(RPC_FULL_URL);

    const contract = await new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      new ethers.Wallet(PRIVATE_KEY, provider)
    );

    // ────────────────────────────────────────────────────────────────────────────────

    printSpacer("Getting gas prices from polygon oracle...");

    const { fastPriceByPolygonOracle, gasPriceMulBy_1_3 } = await getGasPrices(
      provider
    );

    printGasPrices({
      fastPriceByPolygonOracle,
      gasPriceMulBy_1_3,
    });

    // ────────────────────────────────────────────────────────────────────────────────

    printSpacer("Adding transactionId to the smart contract...");

    const tx = await contract.addTransactionId(transactionId, {
      gasPrice: fastPriceByPolygonOracle,
    });
    console.log("transactionId added", transactionId, tx);

    await new Promise((res) => contract.on("AddTransactionIdEvent", res));
    console.log("AddTransactionIdEvent emitted");

    // ─────────────────────────────────────────────────────────────────

    printSpacer("TODO: send balance to user-public-address");

    // - [ ] get with oracle the price in USD of MATIC token
    // - [ ] calculate the amount to send to user
    //   - 15 % apple/google for the in-app purchase
    //   - 15 % to sturm.dev to reward of this tx
    //   - the costs of this tx
    // - [ ] send the amount of MATIC to user-public-address

    printSpacer("Success! 🎉");

    return { message: "Success!" };
  } catch (e) {
    console.log("error ->", e);

    if (e.toString().includes(errors.ALREADY_SAVED_THIS_TRANSACTION_ID)) {
      return { errorString: errors.ALREADY_SAVED_THIS_TRANSACTION_ID };
    } else return { error: e, errorString: e.toString() };
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
