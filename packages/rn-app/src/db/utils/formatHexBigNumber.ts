import * as ethers from 'ethers';

export const formatHexBigNumber = (bigNumber: ethers.BigNumber): number => {
  return ethers.BigNumber.from(bigNumber._hex).toNumber();
};
