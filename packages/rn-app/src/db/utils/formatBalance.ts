import * as ethers from 'ethers';

export const formatBalance = (balanceInHex: string): number => {
  const balance = ethers.BigNumber.from(balanceInHex);
  const amountOfBalance = ethers.utils.formatEther(balance);

  return parseFloat(amountOfBalance);
};

export const mathRound = (amountOfBalance: string) =>
  Math.round(parseInt(amountOfBalance, 10) * 1e4) / 1e4;
