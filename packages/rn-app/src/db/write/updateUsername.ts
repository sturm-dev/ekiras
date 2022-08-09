import {
  contractWithSigner,
  handleError,
  getFastestGasPrice,
  printTxHash,
} from '_db';

export const updateUsername = async (
  newUsername: string,
): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getFastestGasPrice();

    const tx = await contract.updateMyUsername(
      newUsername,
      gasPrice ? {gasPrice} : {},
    );
    printTxHash(tx.hash);

    await new Promise<void>(res => contract.on('UpdateUsernameEvent', res));

    return {};
  } catch (error) {
    return handleError(error);
  }
};
