import {provider, formatBTT, handleSolidityErrors} from '_db';

export const getBalance = async (
  userAddress: string,
): Promise<{
  balance: number;
  error?: string;
}> => {
  try {
    return {balance: formatBTT((await provider.getBalance(userAddress))._hex)};
  } catch (error) {
    return {balance: 0, ...handleSolidityErrors(error)};
  }
};
