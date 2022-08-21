import {provider, formatBalance, handleError} from '_db';
import {formatToDecimals} from '_utils';
import {saveLocalData} from '../local';

export const getBalance = async (
  userAddress: string,
): Promise<{
  balance: string;
  error?: string;
}> => {
  console.log(`[1;33m -- getBalance --[0m`); // log in yellow

  try {
    const newBalance = formatToDecimals(
      formatBalance((await provider.getBalance(userAddress))._hex),
    );
    await saveLocalData('myBalance', newBalance);

    return {balance: newBalance};
  } catch (error) {
    return {balance: '', ...handleError(error)};
  }
};
