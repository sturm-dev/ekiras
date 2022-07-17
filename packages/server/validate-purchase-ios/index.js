const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// make this endpoint https

// TODO: if purchase is valid
//  -> send balance from smart contract to user
//  -> in the rn-app `finish purchase`
//  -> save transactionId in blockchain `alreadyUsedTransactionsIds` to not repeat transactions?

// .env with seed in the server

const formatResult = (postResult) => {
  return {
    receipt: {
      receipt_type: postResult.data.receipt.receipt_type,
      bundle_id: postResult.data.receipt.bundle_id,
      application_version: postResult.data.receipt.application_version,
      in_app: postResult.data.receipt.in_app,
    },
    environment: postResult.data.environment,
    status: postResult.data.status,
  };
};

app.post("/validate-purchase-ios", async (req, res) => {
  try {
    const dataToSend = JSON.stringify({
      "receipt-data": req.body["receipt-data"],
      password: req.body["password"],
      "exclude-old-transactions": true,
    });

    const postResult = await axios.post(
      "https://buy.itunes.apple.com/verifyReceipt",
      dataToSend
    );

    if (postResult.data.status && postResult.data.status === 21007) {
      const postResultSandbox = await axios.post(
        "https://sandbox.itunes.apple.com/verifyReceipt",
        dataToSend
      );

      res.json(formatResult(postResultSandbox));
    } else {
      res.json(formatResult(postResult));
    }
  } catch (e) {
    res.json({ error: e, errorString: e.toString() });
  }
});

app.listen(process.env.port || 3000, () => {
  console.log(`Server running on port ${process.env.port || 3000}`);
});

// https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
// https://futurice.com/blog/validating-in-app-purchases-in-your-ios-app
