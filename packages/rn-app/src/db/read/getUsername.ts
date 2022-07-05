import * as ethers from 'ethers';

import {abi, provider, contractAddress} from '_db';

export const getUsername = async (userAddress: string): Promise<string> =>
  new ethers.Contract(contractAddress, abi, provider).addressToUsername(
    userAddress,
  );
