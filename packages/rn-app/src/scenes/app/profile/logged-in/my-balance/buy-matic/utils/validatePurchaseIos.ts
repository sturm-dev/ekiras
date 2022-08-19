import {handleError, VALIDATE_PURCHASE_ENDPOINT} from '_db';
import {secondLog} from '_utils';
import {getAkashNodeEndpoint} from './getEndpoint';

export const validatePurchaseIos = async ({
  receipt,
  userAddress,
}: {
  receipt: string;
  userAddress: string;
}): Promise<{
  purchaseResult: any;
  error?: string;
}> => {
  try {
    const response = await fetch(
      (await getAkashNodeEndpoint()) + VALIDATE_PURCHASE_ENDPOINT,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'receipt-data': receipt,
          'user-public-address': userAddress,
        }),
      },
    );

    secondLog(`response`, response);

    const json = await response.json();
    console.log(`json`, JSON.stringify(json, null, 2));

    if (!json.error && !json.errorString) {
      return {purchaseResult: json};
    } else {
      return {error: json.errorString, purchaseResult: undefined};
    }
  } catch (error) {
    console.error('validatePurchaseIos - catch', error);

    return {purchaseResult: undefined, ...handleError(error)};
  }
};
