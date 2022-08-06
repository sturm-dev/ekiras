import {contractWithSigner, handleError} from '_db';

export const deletePost = async (
  postId: number,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    const tx = await contract.deleteOwnPost(postId);
    await new Promise<void>(res => contract.on('DeletePostEvent', res));
    await tx.wait(5);

    return {};
  } catch (error) {
    return handleError(error);
  }
};
