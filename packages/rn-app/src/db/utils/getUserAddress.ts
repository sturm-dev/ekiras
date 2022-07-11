import * as ethers from 'ethers';

import {internalUse_getMnemonic} from './internalUse_getMnemonic';
import {handleError} from './handleError';

export const getUserAddress = async (): Promise<{
  userAddress: string;
  error?: string;
}> => {
  try {
    return {
      userAddress: ethers.Wallet.fromMnemonic(await internalUse_getMnemonic())
        .address,
    };
  } catch (error) {
    return {userAddress: '', ...handleError(error)};
  }
};
