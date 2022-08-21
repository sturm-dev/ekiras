// ────────────────────────────────────────────────────────────────────────────────
//
// - endpoint body:
//   - receipt-data
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

const { printSpacer, printInRed, customLogger } = require("./utils.js");
const validatePurchase = require("./validate-purchase");
const estimateTxCosts = require("./estimate-tx-costs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ────────────────────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────────────────────

app.post("/validate-purchase-ios", async (req, res) => {
  printSpacer("Starting...");

  const dataToSend = JSON.stringify({
    "receipt-data": req.body["receipt-data"],
    password: process.env.APP_STORE_SHARED_SECRET,
    "exclude-old-transactions": true,
  });

  // customLogger(`dataToSend`, JSON.stringify(JSON.parse(dataToSend), null, 2));

  let result;

  try {
    const toProdResult = await postToItunesProd(dataToSend);

    if (toProdResult !== "sandbox") result = toProdResult;
    else result = await postToItunesSandbox(dataToSend);

    res.json(await validatePurchase(result, req));
  } catch (e) {
    printInRed("", "-- INSIDE INDEX 'validate-purchase-ios' CATCH BLOCK --");

    customLogger(e);
    customLogger("\n" + e.toString());

    res.json({ error: e, errorString: e.toString() });
  }
});

// ────────────────────────────────────────────────────────────────────────────────

app.get("/estimate-tx-costs", async (req, res) => {
  printSpacer("Starting...");

  try {
    res.json(await estimateTxCosts());
  } catch (e) {
    printInRed("", "-- INSIDE INDEX 'estimate-tx-costs' CATCH BLOCK --");

    customLogger(e);
    customLogger("\n" + e.toString());

    res.json({ error: e, errorString: e.toString() });
  }
});

// ────────────────────────────────────────────────────────────────────────────────

app.listen(process.env.port || 3000, () => {
  customLogger(`Server running on port ${process.env.port || 3000}`);
});

// https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
// https://futurice.com/blog/validating-in-app-purchases-in-your-ios-app
