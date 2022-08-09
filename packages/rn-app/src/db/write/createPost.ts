import {contractWithSigner, handleError, getFastestGasPrice} from '_db';

export const createPost = async (
  text: string,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getFastestGasPrice();

    const tx = await contract.createPost(text, gasPrice ? {gasPrice} : {});
    console.log(`tx.hash`, tx.hash);

    await new Promise<void>(res => contract.on('CreatePostEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
