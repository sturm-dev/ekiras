import {provider, formatBalance, handleError} from '_db';

export const getBalance = async (
  userAddress: string,
): Promise<{
  balance: number;
  error?: string;
}> => {
  console.log(`[1;33m -- getBalance --[0m`); // log in yellow

  try {
    return {
      balance: formatBalance((await provider.getBalance(userAddress))._hex),
    };
  } catch (error) {
    return {balance: 0, ...handleError(error)};
  }
};
