import * as ethers from 'ethers';
import {formatToDecimals} from '_utils';

export const estimatedCostOfTx = (
  gasPrice: ethers.ethers.BigNumber,
  gasLimit: ethers.ethers.BigNumber,
): string => {
  if (!gasPrice || !gasLimit)
    throw new Error(
      'gasPrice or gasLimit is undefined inside of utils/estimatedCostOfTx',
    );

  let _gasLimit: ethers.ethers.BigNumber | string | number =
    ethers.BigNumber.from(gasLimit._hex);
  _gasLimit = ethers.utils.formatUnits(_gasLimit, 'gwei');
  _gasLimit = parseFloat(_gasLimit);

  let _gasPrice: ethers.ethers.BigNumber | string | number =
    ethers.BigNumber.from(gasPrice._hex);
  _gasPrice = ethers.utils.formatUnits(_gasPrice, 'gwei');
  _gasPrice = parseFloat(_gasPrice);

  return formatToDecimals(_gasLimit * _gasPrice, 4);
};
