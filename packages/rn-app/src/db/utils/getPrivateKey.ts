import * as ethers from 'ethers';
import {getMnemonic} from './getMnemonic';

export const getPrivateKey = async (): Promise<string> =>
  ethers.Wallet.fromMnemonic(await getMnemonic()).privateKey;
