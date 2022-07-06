import * as ethers from 'ethers';

import {getMnemonic} from './getMnemonic';

export const getUserAddress = async (): Promise<string> =>
  ethers.Wallet.fromMnemonic(await getMnemonic()).address;
