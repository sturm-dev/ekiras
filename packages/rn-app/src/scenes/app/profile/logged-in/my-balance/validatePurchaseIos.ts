import * as ethers from 'ethers';
import {DYNAMIC_DATA_CONTRACT_ADDRESS} from 'react-native-dotenv';

import {dynamicDataAbi, VALIDATE_PURCHASE_ENDPOINT, provider} from '_db';

export const validatePurchaseIos = async ({
  receipt,
  userAddress,
}: {
  receipt: string;
  userAddress: string;
}): Promise<{status: 'ok' | 'error'}> => {
  try {
    // ─────────────────────────────────────────────────────────────────
    let akashNodeEndpoint = await new ethers.Contract(
      DYNAMIC_DATA_CONTRACT_ADDRESS,
      dynamicDataAbi,
      provider,
    ).akashNodeUrl();
    // ───────────────────
    akashNodeEndpoint += VALIDATE_PURCHASE_ENDPOINT;
    // ───────────────────
    if (!akashNodeEndpoint.startsWith('http://'))
      akashNodeEndpoint = 'http://' + akashNodeEndpoint;
    // ───────────────────
    console.log(`akashNodeEndpoint`, akashNodeEndpoint);
    // ─────────────────────────────────────────────────────────────────

    const response = await fetch(akashNodeEndpoint, {
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

    console.log(`response`, response);

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
    console.error('validatePurchaseIos - catch', error);

    return {status: 'error'};
  }
};
