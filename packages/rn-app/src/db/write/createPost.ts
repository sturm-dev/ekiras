import * as ethers from 'ethers';

import {abi, contractAddress, getPrivateKey, provider} from '_db';

export const createPost = async (text: string) => {
  const tx = await new ethers.Contract(
    contractAddress,
    abi,
    new ethers.Wallet(await getPrivateKey(), provider),
  ).createPost(text);

  return await tx.wait();
};
