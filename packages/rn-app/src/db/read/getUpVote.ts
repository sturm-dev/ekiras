import {contractWithoutSigner, handleError} from '_db';

export const getUpVote = async (
  postId: number,
  userAddress: string,
): Promise<{
  upVote: boolean;
  error?: string;
}> => {
  try {
    const upVote = await contractWithoutSigner.votesUp(postId, userAddress);

    return {upVote};
  } catch (error) {
    return {upVote: false, ...handleError(error)};
  }
};
