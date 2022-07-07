import * as ethers from 'ethers';
import {internalUse_getMnemonic} from './internalUse_getMnemonic';

export const internalUse_getPrivateKey = async (): Promise<string> =>
  ethers.Wallet.fromMnemonic(await internalUse_getMnemonic()).privateKey;
