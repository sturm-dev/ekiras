import {contractWithoutSigner, handleError} from '_db';

export const getDownVote = async (
  postId: number,
  userAddress: string,
): Promise<{
  downVote: boolean;
  error?: string;
}> => {
  console.log(`[1;33m -- getDownVote --[0m`); // log in yellow

  try {
    const downVote = await contractWithoutSigner.votesDown(postId, userAddress);

    return {downVote};
  } catch (error) {
    return {downVote: false, ...handleError(error)};
  }
};
