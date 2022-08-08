import {handleError, contractWithSigner, PostInterface, getGasPrice} from '_db';

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
    console.log(`tx.hash`, tx.hash);

    await new Promise<void>(res => contract.on('VoteEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
