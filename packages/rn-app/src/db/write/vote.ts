import {handleError, contractWithSigner} from '_db';

export const vote = async (
  postId: number,
  voteIsTypeUp: boolean,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    const tx = await contract.votePost(postId, voteIsTypeUp);
    await new Promise<void>(res => contract.on('VoteEvent', res));
    await tx.wait(5);

    return {};
  } catch (error) {
    return handleError(error);
  }
};
