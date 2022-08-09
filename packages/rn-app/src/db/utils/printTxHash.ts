import {POLYGON_EXPLORE_TX_URL} from 'react-native-dotenv';

export const printTxHash = (txHash: string) => {
  console.log('-');
  console.log(`[1;33m ${POLYGON_EXPLORE_TX_URL + txHash}[0m`);
  console.log('-');
};
