import {contractWithoutSigner, handleError} from '_db';

export const getUpVote = async (
  postId: number,
  userAddress: string,
): Promise<{
  upVote: boolean;
  error?: string;
}> => {
  console.log(`[1;33m -- getUpVote --[0m`); // log in yellow

  try {
    const upVote = await contractWithoutSigner.votesUp(postId, userAddress);

    return {upVote};
  } catch (error) {
    return {upVote: false, ...handleError(error)};
  }
};
