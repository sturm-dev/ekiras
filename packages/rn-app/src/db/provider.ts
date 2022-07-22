import * as ethers from 'ethers';
import {
  MAINNET,
  MAINNET__RPC_FULL_URL,
  TESTNET__RPC_FULL_URL,
} from 'react-native-dotenv';

export const provider = new ethers.providers.JsonRpcProvider(
  MAINNET === 'true' ? MAINNET__RPC_FULL_URL : TESTNET__RPC_FULL_URL,
);
