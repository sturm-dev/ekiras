import * as ethers from 'ethers';
import {DYNAMIC_DATA_CONTRACT_ADDRESS} from 'react-native-dotenv';

import {dynamicDataAbi, provider} from '_db';

export const getAkashNodeEndpoint = async () => {
  let akashNodeEndpoint = await new ethers.Contract(
    DYNAMIC_DATA_CONTRACT_ADDRESS,
    dynamicDataAbi,
    provider,
  ).akashNodeUrl();

  if (!(akashNodeEndpoint as string).includes('://'))
    akashNodeEndpoint = 'http://' + akashNodeEndpoint;

  return akashNodeEndpoint;
};
