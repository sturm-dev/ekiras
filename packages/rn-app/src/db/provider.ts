import * as ethers from 'ethers';

import {RPC_FULL_URL} from './utils/handleEnvVars';

export const provider = new ethers.providers.JsonRpcProvider(RPC_FULL_URL);
