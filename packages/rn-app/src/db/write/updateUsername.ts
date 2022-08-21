import {
  contractWithSigner,
  handleError,
  getFastestGasPrice,
  printTxHash,
  getBalance,
} from '_db';

export const updateUsername = async ({
  newUsername,
  userAddress,
}: {
  newUsername: string;
  userAddress: string;
}): Promise<{
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

    await new Promise<void>(res => {
      contract.on('UpdateUsernameEvent', msgSender => {
        if (msgSender === userAddress) res();
      });
    });

    getBalance(userAddress);

    return {};
  } catch (error) {
    return handleError(error);
  }
};
