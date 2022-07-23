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
//       - ask if transactionId already saved to the smart contract
//         - yes -> return error
//         - no ->
//           - add transactionId to the smart contract
//           - send balance to user-public-address
//           - return success to rn-app
//
// ────────────────────────────────────────────────────────────────────────────────

const axios = require("axios");
const bodyParser = require("body-parser");
const app = require("express")();
const ethers = require("ethers");

const abi = require("./abi.json");

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

const validatePurchase = async (postResult, req) => {
  const userPublicAddress = req.body["user-public-address"];
  console.log(`userPublicAddress`, userPublicAddress, typeof userPublicAddress);

  const in_app = postResult.data.receipt.in_app;
  console.log(`in_app`, JSON.stringify(in_app, null, 2));

  // TODO: get transactionId from in_app from last purchase

  const transactionId = in_app[0].transaction_id;
  console.log(`transactionId`, transactionId);

  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_FULL_URL);

    const contract = await new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      new ethers.Wallet(PRIVATE_KEY, provider)
    );

    // TODO: check if transactionId already saved to the smart contract

    // TODO: add transactionId to the smart contract

    // TODO: fix error "reason": "cannot estimate gas; transaction may fail or may require manual gas limit",

    const { result, error } = await contract.addTransactionId(transactionId);

    console.log(`result`, result);
    console.log(`error`, error);

    await new Promise((res) => contract.on("AddTransactionIdEvent", res));

    // TODO: send balance to user-public-address

    // TODO: return success to rn-app

    return { message: "Success!" };
  } catch (e) {
    console.log("error ->", e);
    return { error: e, errorString: e.toString() };
  }
};

const postToItunesProd = (dataToSend) =>
  new Promise(async (res, rej) => {
    try {
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
  const dataToSend = JSON.stringify({
    "receipt-data": req.body["receipt-data"],
    password: req.body["password"],
    "exclude-old-transactions": true,
  });

  console.log(`dataToSend`, JSON.stringify(JSON.parse(dataToSend), null, 2));

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
