import * as ethers from 'ethers';

import {
  abi,
  contractAddress,
  internalUse_getPrivateKey,
  provider,
  handleSolidityErrors,
} from '_db';

export const updateUsername = async (
  newUsername: string,
): Promise<{
  error?: string;
}> => {
  try {
    const tx = await new ethers.Contract(
      contractAddress,
      abi,
      new ethers.Wallet(await internalUse_getPrivateKey(), provider),
    ).updateMyUsername(newUsername);

    await tx.wait();
    return {};
  } catch (error) {
    return handleSolidityErrors(error);
  }
};
