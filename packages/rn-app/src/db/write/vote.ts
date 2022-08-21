import {
  handleError,
  contractWithSigner,
  PostInterface,
  getFastestGasPrice,
  printTxHash,
  getBalance,
} from '_db';

export const vote = async ({
  post,
  voteIsTypeUp,
  userAddress,
}: {
  post: PostInterface;
  voteIsTypeUp: boolean;
  userAddress: string;
}): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getFastestGasPrice();

    const tx = await contract.votePost(
      post.id,
      voteIsTypeUp,
      gasPrice ? {gasPrice} : {},
    );
    printTxHash(tx.hash);

    await new Promise<void>(res => {
      contract.on('VoteEvent', msgSender => {
        if (msgSender === userAddress) res();
      });
    });

    getBalance(userAddress);

    return {};
  } catch (error) {
    return handleError(error);
  }
};
