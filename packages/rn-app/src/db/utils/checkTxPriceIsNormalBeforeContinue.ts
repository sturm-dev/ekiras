import {ethers} from 'ethers';
import {Alert} from 'react-native';

import {estimatedCostOfTx} from './estimateCostOfTx';
import {VOTE_COST_APPROX} from './handleEnvVars';

export const checkTxPriceIsNormalBeforeContinue = async ({
  contract,
  gasPrice,
  fnName,
  fnArgs,
}: {
  contract: ethers.Contract;
  gasPrice: ethers.BigNumber;
  fnName: string;
  fnArgs: any[];
}) => {
  let proceed = true;
  const txEstimatedLimit = await contract.estimateGas[fnName](...fnArgs);

  const txCost = parseFloat(
    gasPrice ? estimatedCostOfTx(gasPrice, txEstimatedLimit) : '0',
  );
  console.log(`txCost`, txCost);

  await new Promise<void>(res => {
    if (txCost > parseFloat(VOTE_COST_APPROX) * 1.5) {
      Alert.alert(
        'Gas is expensive right now',
        `\nThe approx cost of one vote is ${VOTE_COST_APPROX}, but the actual cost is ${txCost}.\n\nDo you want to proceed anyway?`,
        [
          {
            text: 'No, I will try again later',
            style: 'cancel',
            onPress: () => {
              proceed = false;
              res();
            },
          },
          {
            text: 'Yes',
            onPress: () => {
              proceed = true;
              res();
            },
          },
        ],
      );
    } else res();
  });

  return proceed;
};
