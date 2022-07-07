import * as ethers from 'ethers';

import {abi, provider, contractAddress, handleSolidityErrors} from '_db';

export const getUsername = async (
  userAddress: string,
): Promise<{
  username: string;
  error?: string;
}> => {
  try {
    return {
      username: await new ethers.Contract(
        contractAddress,
        abi,
        provider,
      ).addressToUsername(userAddress),
    };
  } catch (error) {
    return {username: '', ...handleSolidityErrors(error)};
  }
};
