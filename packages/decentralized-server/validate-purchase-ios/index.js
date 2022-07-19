const axios = require("axios");
const bodyParser = require("body-parser");
const app = require("express")();
const ethers = require("ethers");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO:
// - [x] get the public address of the user from POST
// - [ ] 🔥 get the mnemonic from .env
//   - [x] set the env var in yaml
//   - [x] test get the env var in server from yaml
//   - [ ] replicate the way of send env var from local
// - [ ] send the balance to the user when purchase is valid
// - [ ] store the transactionId in the smart contract to not repeat purchase

const validatePurchase = async (postResult, req) => {
  const userPublicAddress = req.body["user-public-address"];
  const MAIN_MNEMONIC = process.env.MAIN_MNEMONIC;
  const BTTC_RPC_API_KEY = process.env.BTTC_RPC_API_KEY;

  const result = {
    receipt: {
      receipt_type: postResult.data.receipt.receipt_type,
      bundle_id: postResult.data.receipt.bundle_id,
      application_version: postResult.data.receipt.application_version,
      in_app: postResult.data.receipt.in_app,
    },
    environment: postResult.data.environment,
    status: postResult.data.status,
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // TODO:
  // - [x] (ethers basic config) ask with ethers the balance of public address
  // - [ ] read the smart contract -> check the transactionId is not saved

  const provider = new ethers.providers.StaticJsonRpcProvider(
    `https://bttc.getblock.io/mainnet/?api_key=${BTTC_RPC_API_KEY}`,
    { chainId: 199, name: "BitTorrent Chain Mainnet" }
  );

  const balance = await provider.getBalance(userPublicAddress);

  console.log(`balance`, balance, typeof balance);

  const formattedBalance = ethers.utils.formatEther(
    ethers.BigNumber.from(balance._hex)
  );

  console.log(`formattedBalance`, formattedBalance, typeof formattedBalance);

  // ────────────────────────────────────────────────────────────────────────────────

  console.log(`result`, result, typeof result);
  console.log(`userPublicAddress`, userPublicAddress, typeof userPublicAddress);
  console.log(`MAIN_MNEMONIC`, MAIN_MNEMONIC, typeof MAIN_MNEMONIC);

  return { message: "Success!" };
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

    // if receipt from sandbox
    if (postResult.data.status && postResult.data.status === 21007) {
      const postResultSandbox = await axios.post(
        "https://sandbox.itunes.apple.com/verifyReceipt",
        dataToSend
      );

      res.json(await validatePurchase(postResultSandbox, req));
    } else {
      res.json(await validatePurchase(postResult, req));
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
