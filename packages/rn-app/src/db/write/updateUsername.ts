import {contractWithSigner, handleError} from '_db';

export const updateUsername = async (
  newUsername: string,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    const tx = await contract.updateMyUsername(newUsername);
    await new Promise<void>(res => contract.on('UpdateUsernameEvent', res));
    await tx.wait(5);

    return {};
  } catch (error) {
    return handleError(error);
  }
};
