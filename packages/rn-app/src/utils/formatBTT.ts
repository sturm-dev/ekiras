import * as ethers from 'ethers';

export const formatBTT = (balanceInHex?: string) => {
  if (!balanceInHex) return undefined;

  const balance = ethers.BigNumber.from(balanceInHex);
  let amountOfBTT: any = ethers.utils.formatEther(balance);
  amountOfBTT = Math.round(amountOfBTT * 1e4) / 1e4;

  return amountOfBTT;
};
