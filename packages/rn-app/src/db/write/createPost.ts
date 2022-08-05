import {contractWithSigner, handleError} from '_db';

export const createPost = async (
  text: string,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    const tx = await contract.createPost(text);
    // TODO: check this - wait after the graph have the data updated - 5 blocks?
    await tx.wait(5);
    // await new Promise<void>(res => contract.on('CreatePostEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
