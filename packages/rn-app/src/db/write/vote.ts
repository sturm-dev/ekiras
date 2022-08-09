import {
  handleError,
  contractWithSigner,
  PostInterface,
  getGasPrice,
  printTxHash,
  formatHexBigNumber,
} from '_db';

export const vote = async ({
  post,
  voteIsTypeUp,
}: {
  post: PostInterface;
  voteIsTypeUp: boolean;
}): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getGasPrice();

    const tx = await contract.votePost(
      post.id,
      voteIsTypeUp,
      gasPrice ? {gasPrice} : {},
    );
    printTxHash(tx.hash);

    await new Promise<void>(res => {
      contract.on('VoteEvent', values => {
        if (formatHexBigNumber(values.postId) === post.id) res();
        // TODO: check with msg.sender instead
        // TODO: add msg.sender to event
      });
    });

    return {};
  } catch (error) {
    return handleError(error);
  }
};
