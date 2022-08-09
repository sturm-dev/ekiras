import * as ethers from 'ethers';

import {Abi, Abi__factory} from 'types/ethers-contracts';

import {provider} from '../provider';
import {internalUse_getPrivateKey} from './internalUse_getPrivateKey';
import {CONTRACT_ADDRESS} from './handleEnvVars';

let contractWithSignerCreated: Abi | undefined;

export const resetContractWithSigner = () =>
  (contractWithSignerCreated = undefined);

export const contractWithSigner = async () => {
  if (!contractWithSignerCreated) {
    contractWithSignerCreated = Abi__factory.connect(
      CONTRACT_ADDRESS,
      new ethers.Wallet(await internalUse_getPrivateKey(), provider),
    );
  }

  return contractWithSignerCreated;
};

export const contractWithoutSigner = Abi__factory.connect(
  CONTRACT_ADDRESS,
  provider,
);
