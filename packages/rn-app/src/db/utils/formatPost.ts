import * as ethers from 'ethers';

import {PostInterface} from '../DBInterfaces';

// TODO: do with new format
export const formatPost = (value: any): PostInterface => {
  return {
    id: ethers.BigNumber.from(value[0]._hex).toNumber(),
    createdDate: ethers.BigNumber.from(value[1]._hex).toNumber(),
    author: value[2],
    text: value[3],
    upVotesCount: ethers.BigNumber.from(value[4]._hex).toNumber(),
    downVotesCount: ethers.BigNumber.from(value[5]._hex).toNumber(),
  };
};
