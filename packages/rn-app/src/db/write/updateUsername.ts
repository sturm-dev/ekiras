import * as ethers from 'ethers';

import {abi, contractAddress, getPrivateKey, provider} from '_db';

export const updateUsername = async (newUsername: string) => {
  const tx = await new ethers.Contract(
    contractAddress,
    abi,
    new ethers.Wallet(await getPrivateKey(), provider),
  ).updateMyUsername(newUsername);

  return await tx.wait();
};
