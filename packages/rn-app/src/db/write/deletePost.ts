import {
  contractWithSigner,
  handleError,
  getFastestGasPrice,
  printTxHash,
} from '_db';

export const deletePost = async ({
  postId,
  userAddress,
}: {
  postId: number;
  userAddress: string;
}): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getFastestGasPrice();

    const tx = await contract.deleteOwnPost(postId, gasPrice ? {gasPrice} : {});
    printTxHash(tx.hash);

    await new Promise<void>(res => {
      contract.on('DeletePostEvent', msgSender => {
        if (msgSender === userAddress) res();
      });
    });

    return {};
  } catch (error) {
    return handleError(error);
  }
};
