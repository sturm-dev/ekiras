import {contractWithoutSigner, handleError} from '_db';

export const getUsername = async (
  userAddress: string,
): Promise<{
  username: string;
  error?: string;
}> => {
  try {
    const username = await contractWithoutSigner.addressToUsername(userAddress);

    return {username};
  } catch (error) {
    return {username: '', ...handleError(error)};
  }
};
