import * as ethers from 'ethers';

import {handleError, contractWithSigner, PostInterface} from '_db';

export const vote = async ({
  post,
  voteIsTypeUp,
}: {
  post: PostInterface;
  voteIsTypeUp: boolean;
}): Promise<{
  error?: string;
}> => {
  try {
    const getGasPrice = (): Promise<string> =>
      new Promise((res, rej) => {
        fetch('https://gasstation-mainnet.matic.network/v2')
          .catch(error => rej(error))
          .then(response => response?.json())
          .then(json => {
            const formatter = new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });

            if (json) res(formatter.format(json.fast.maxFee));
            else rej('error getting the gas price from polygon oracle');
          });
      });

    const _gasPrice = await getGasPrice();
    console.log(`_gasPrice`, _gasPrice);

    const gasPriceMul1_1 = (parseFloat(_gasPrice) * 1.1).toString();
    console.log(`gasPriceMul1_1`, gasPriceMul1_1);
    // TODO: sum the diff between the middle and the highest price / 2
    // middle = 50
    // highest = 100
    // sum = 50 / 2 = 25
    // gasPrice = 100 + 25 = 125

    const contract = await contractWithSigner();

    const tx = await contract.votePost(
      post.id,
      voteIsTypeUp,
      _gasPrice
        ? {gasPrice: ethers.utils.parseUnits(gasPriceMul1_1, 'gwei')}
        : {},
    );
    console.log(`tx.hash`, tx.hash);

    await new Promise<void>(res => contract.on('VoteEvent', res));
    console.log('VoteEvent');

    return {};
  } catch (error) {
    return handleError(error);
  }
};

// TODO: remove gasPrice from context
// TODO: add getGasPrice to db utils
