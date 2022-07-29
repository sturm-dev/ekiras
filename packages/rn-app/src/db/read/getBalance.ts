import {provider, formatBalance, handleError} from '_db';

export const getBalance = async (
  userAddress: string,
): Promise<{
  balance: number;
  error?: string;
}> => {
  try {
    return {
      balance: formatBalance((await provider.getBalance(userAddress))._hex),
    };
  } catch (error) {
    return {balance: 0, ...handleError(error)};
  }
};
