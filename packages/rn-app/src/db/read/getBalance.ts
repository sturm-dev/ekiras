import {provider, formatBTT} from '_db';

export const getBalance = async (
  userAddress: string,
): Promise<number | undefined> =>
  formatBTT((await provider.getBalance(userAddress))._hex);
