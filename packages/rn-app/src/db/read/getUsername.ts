import {contractWithoutSigner, handleError} from '_db';

export const getUsername = async (
  userAddress: string,
): Promise<{
  username: string;
  error?: string;
}> => {
  console.log(`[1;33m -- getUsername --[0m`); // log in yellow

  try {
    const username = await contractWithoutSigner.addressToUsername(userAddress);

    return {username};
  } catch (error) {
    return {username: '', ...handleError(error)};
  }
};
