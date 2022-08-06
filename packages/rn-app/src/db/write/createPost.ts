import * as ethers from 'ethers';
import {contractWithSigner, handleError} from '_db';

export const createPost = async (
  text: string,
  gasPrice?: number,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    console.log(`gasPrice`, gasPrice);

    const tx = await contract.createPost(text, {
      gasPrice: gasPrice
        ? ethers.utils.parseUnits(`${gasPrice}`, 'gwei')
        : undefined,
    });
    await new Promise<void>(res => contract.on('CreatePostEvent', res));
    await tx.wait(5);

    return {};
  } catch (error) {
    return handleError(error);
  }
};
