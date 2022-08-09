import * as ethers from 'ethers';
import {POLYGON_GAS_PRICE_ORACLE_URL} from 'react-native-dotenv';

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const getFastestGasPrice = async (): Promise<
  ethers.BigNumber | undefined
> => {
  try {
    let gasPrice: any = '';
    let standard = '';
    let fast = '';

    const response = await fetch(POLYGON_GAS_PRICE_ORACLE_URL);
    const json = await response?.json();

    if (json) {
      standard = formatter.format(json.standard.maxFee);
      fast = formatter.format(json.fast.maxFee);
    } else throw new Error('error getting the gas price from polygon oracle');

    const gasTip = (parseFloat(fast) - parseFloat(standard)) / 2;
    gasPrice = formatter.format(parseFloat(fast) + gasTip);

    console.log(
      `standard -> [1;36m ${standard}[0m`,
      `fast -> [1;33m ${fast}[0m`,
      `with-tip -> [1;32m ${gasPrice}[0m`,
    );

    return ethers.utils.parseUnits(gasPrice, 'gwei');
  } catch (error) {
    console.error(`error getting gas price`, error);
    throw error;
  }
};
