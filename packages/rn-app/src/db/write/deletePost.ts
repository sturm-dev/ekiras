import {contractWithSigner, handleError} from '_db';

export const deletePost = async (
  postId: number,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    await contract.deleteOwnPost(postId);
    await new Promise<void>(res => contract.on('DeletePostEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
