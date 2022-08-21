import {
  contractWithSigner,
  handleError,
  getFastestGasPrice,
  printTxHash,
  formatHexBigNumber,
  getBalance,
} from '_db';

export const createPost = async ({
  text,
  userAddress,
}: {
  text: string;
  userAddress: string;
}): Promise<{
  newPostId: number;
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getFastestGasPrice();

    const tx = await contract.createPost(text, gasPrice ? {gasPrice} : {});
    printTxHash(tx.hash);

    const newPostId = await new Promise<number>(res => {
      contract.on('CreatePostEvent', (msgSender, postId) => {
        if (msgSender === userAddress) res(formatHexBigNumber(postId));
      });
    });

    getBalance(userAddress);

    return {newPostId};
  } catch (error) {
    return {...handleError(error), newPostId: -1};
  }
};
