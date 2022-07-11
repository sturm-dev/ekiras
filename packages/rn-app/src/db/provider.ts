import * as ethers from 'ethers';
import {BTTC_RPC_API_KEY} from 'react-native-dotenv';

import {chainData} from './chainData';

const {rpcUrl, chainId, chainName} = chainData;

export const provider = new ethers.providers.StaticJsonRpcProvider(
  rpcUrl(BTTC_RPC_API_KEY),
  {chainId, name: chainName},
);
