import * as ethers from 'ethers';

import {internalUse_getMnemonic} from './internalUse_getMnemonic';
import {handleError} from './handleError';
import {saveLocalData} from '../local';

export const getUserAddress = async (): Promise<{
  userAddress: string;
  error?: string;
}> => {
  try {
    const userAddress = ethers.Wallet.fromMnemonic(
      await internalUse_getMnemonic(),
    ).address;
    await saveLocalData('myAddress', userAddress);

    return {userAddress};
  } catch (error) {
    return {userAddress: '', ...handleError(error)};
  }
};
