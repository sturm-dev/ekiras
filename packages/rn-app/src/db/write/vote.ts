import {handleError, contractWithSigner} from '_db';

export const vote = async (
  postId: number,
  voteIsTypeUp: boolean,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    await contract.votePost(postId, voteIsTypeUp);
    await new Promise<void>(res => contract.on('VoteEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
