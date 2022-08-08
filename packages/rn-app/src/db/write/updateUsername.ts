import {contractWithSigner, handleError, getGasPrice} from '_db';

export const updateUsername = async (
  newUsername: string,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getGasPrice();

    const tx = await contract.updateMyUsername(
      newUsername,
      gasPrice ? {gasPrice} : {},
    );
    console.log(`tx.hash`, tx.hash);

    await new Promise<void>(res => contract.on('UpdateUsernameEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
