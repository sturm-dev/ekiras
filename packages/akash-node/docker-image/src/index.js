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

const { printSpacer } = require("./utils.js");
const validatePurchase = require("./validate-purchase");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    console.log(`\n\n[1;33m -- INSIDE INDEX CATCH BLOCK --[0m\n\n`); // log in yellow

    console.log(`catch e`, e);

    res.json({ error: e, errorString: e.toString() });
  }
});

app.listen(process.env.port || 3000, () => {
  console.log(`Server running on port ${process.env.port || 3000}`);
});

// https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
// https://futurice.com/blog/validating-in-app-purchases-in-your-ios-app
