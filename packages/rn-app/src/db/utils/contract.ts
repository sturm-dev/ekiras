import * as ethers from 'ethers';

import {provider} from '../provider';
import {internalUse_getPrivateKey} from './internalUse_getPrivateKey';
import abi from '../abi.json';
import {CONTRACT_ADDRESS} from './handleEnvVars';

let contractWithSignerCreated: ethers.Contract | undefined;

export const resetContractWithSigner = () =>
  (contractWithSignerCreated = undefined);

export const contractWithSigner = async () => {
  if (!contractWithSignerCreated) {
    contractWithSignerCreated = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      new ethers.Wallet(await internalUse_getPrivateKey(), provider),
    );
  }

  return contractWithSignerCreated;
};

export const contractWithoutSigner = new ethers.Contract(
  CONTRACT_ADDRESS,
  abi,
  provider,
);
