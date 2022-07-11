import {contractWithSigner, handleSolidityErrors} from '_db';

export const createPost = async (
  text: string,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    await contract.createPost(text);
    await new Promise<void>(res => contract.on('CreatePostEvent', res));

    return {};
  } catch (error) {
    return handleSolidityErrors(error);
  }
};
