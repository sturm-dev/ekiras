import * as ethers from 'ethers';
import {BTTC_RPC_API_KEY} from 'react-native-dotenv';

import {abi, chainData, contractAddress} from '_db';

export const getUsername = async (userAddress: string): Promise<string> => {
  const {rpcUrl, chainId, chainName} = chainData;
  const provider = new ethers.providers.StaticJsonRpcProvider(
    rpcUrl(BTTC_RPC_API_KEY),
    {chainId, name: chainName},
  );

  return await new ethers.Contract(
    contractAddress,
    abi,
    provider,
  ).addressToUsername(userAddress);
};
