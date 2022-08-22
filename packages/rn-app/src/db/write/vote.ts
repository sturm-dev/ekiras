import {
  handleError,
  contractWithSigner,
  PostInterface,
  getFastestGasPrice,
  printTxHash,
  getBalance,
} from '_db';
import {checkTxPriceIsNormalBeforeContinue} from '../utils/checkTxPriceIsNormalBeforeContinue';

export const vote = async ({
  post,
  voteIsTypeUp,
  userAddress,
}: {
  post: PostInterface;
  voteIsTypeUp: boolean;
  userAddress: string;
}): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();
    const gasPrice = await getFastestGasPrice();
    if (!gasPrice) throw Error('no gas price');

    const fnName = 'votePost';
    const fnArgs = [post.id, voteIsTypeUp, gasPrice ? {gasPrice} : {}];

    const proceed = await checkTxPriceIsNormalBeforeContinue({
      contract,
      gasPrice,
      fnName,
      fnArgs,
    });

    if (proceed) {
      const tx = await contract[fnName](...fnArgs);
      printTxHash(tx.hash);

      await new Promise<void>(res => {
        contract.on('VoteEvent', msgSender => {
          if (msgSender === userAddress) res();
        });
      });

      getBalance(userAddress);

      return {};
    } else {
      return {error: 'tx is too expensive'};
    }
  } catch (error) {
    return handleError(error);
  }
};
