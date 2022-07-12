import {contractWithoutSigner, handleError} from '_db';

export const getDownVote = async (
  postId: number,
  userAddress: string,
): Promise<{
  downVote: boolean;
  error?: string;
}> => {
  try {
    const downVote = await contractWithoutSigner.votesDown(postId, userAddress);

    return {downVote};
  } catch (error) {
    return {downVote: false, ...handleError(error)};
  }
};
