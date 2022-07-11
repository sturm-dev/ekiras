import {contractWithSigner, handleSolidityErrors} from '_db';

export const updateUsername = async (
  newUsername: string,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    await contract.updateMyUsername(newUsername);
    await new Promise<void>(res => contract.on('UpdateUsernameEvent', res));

    return {};
  } catch (error) {
    return handleSolidityErrors(error);
  }
};
