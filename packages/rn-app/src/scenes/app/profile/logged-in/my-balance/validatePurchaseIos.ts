import {AKASH_NODE_ENDPOINT} from 'react-native-dotenv';

export const validatePurchaseIos = async ({
  receipt,
  userAddress,
}: {
  receipt: string;
  userAddress: string;
}): Promise<{status: 'ok' | 'error'}> => {
  try {
    const response = await fetch(AKASH_NODE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'receipt-data': receipt,
        'user-public-address': userAddress,
      }),
    });

    const json = await response.json();

    console.log(`json`, JSON.stringify(json, null, 2));

    // {"amountOfMaticSentToTheUser": "0.01", "message": "Success!", "txFee": 0.014482512319999863, "txHash": "0xea1e704bc8b015c602dcc134608398aba8681be611a0a5ee47de8ec2bbfab487",}
    // {"amountOfMaticSentToTheUser": "0", "errorString": "already saved this transactionId", "txFee": 0}

    if (!json.error && !json.errorString) {
      // TODO: return tx hash
      return {status: 'ok'};
    } else {
      if (json.errorString === 'already saved this transactionId') {
        // TODO: show message
        return {status: 'error'};
      } else {
        return {status: 'error'};
      }
    }
  } catch (error) {
    console.error(error);

    return {status: 'error'};
  }
};
