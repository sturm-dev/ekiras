import * as ethers from 'ethers';

import {
  abi,
  contractAddress,
  getPrivateKey,
  provider,
  handleSolidityErrors,
} from '_db';

export const vote = async (
  postId: number,
  voteIsTypeUp: boolean,
): Promise<{
  error?: string;
}> => {
  try {
    const tx = await new ethers.Contract(
      contractAddress,
      abi,
      new ethers.Wallet(await getPrivateKey(), provider),
    ).votePost(postId, voteIsTypeUp);

    await tx.wait();
    return {};
  } catch (error) {
    return handleSolidityErrors(error);
  }
};
