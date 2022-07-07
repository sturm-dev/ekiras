import * as ethers from 'ethers';

export const formatBTT = (balanceInHex: string): number => {
  const balance = ethers.BigNumber.from(balanceInHex);
  const amountOfBTT = ethers.utils.formatEther(balance);
  return mathRound(amountOfBTT);
};

const mathRound = (amountOfBTT: string) =>
  Math.round(parseInt(amountOfBTT, 10) * 1e4) / 1e4;
