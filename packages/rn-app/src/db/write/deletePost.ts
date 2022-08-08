import {contractWithSigner, handleError, getGasPrice} from '_db';

export const deletePost = async (
  postId: number,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getGasPrice();

    const tx = await contract.deleteOwnPost(postId, gasPrice ? {gasPrice} : {});
    console.log(`tx.hash`, tx.hash);

    await new Promise<void>(res => contract.on('DeletePostEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
