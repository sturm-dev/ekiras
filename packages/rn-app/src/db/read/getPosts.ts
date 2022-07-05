import * as ethers from 'ethers';
import {BTTC_RPC_API_KEY} from 'react-native-dotenv';

import {abi, chainData, PostInterface, contractAddress} from '_db';

export const getPosts = async (
  amountOfPosts: number,
): Promise<PostInterface[]> => {
  console.log(`amountOfPosts`, amountOfPosts, typeof amountOfPosts);

  // TODO: make the amountOfPosts work with this get

  const {rpcUrl, chainId, chainName} = chainData;
  const provider = new ethers.providers.StaticJsonRpcProvider(
    rpcUrl(BTTC_RPC_API_KEY),
    {chainId, name: chainName},
  );

  const posts: PostInterface[] = [];

  return Promise.all(
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      async e =>
        await new ethers.Contract(contractAddress, abi, provider).posts(e),
    ),
  )
    .then(values => {
      values.forEach((value, i) => {
        if (value[0] !== '0x0000000000000000000000000000000000000000') {
          posts.push({
            id: i,
            author: value[0],
            text: value[1],
            upVotesCount: ethers.BigNumber.from(value[2]._hex).toNumber(),
            downVotesCount: ethers.BigNumber.from(value[3]._hex).toNumber(),
          });
        }
      });

      return posts;
    })
    .catch(e => {
      console.log(`e`, e, typeof e);
      return posts;
    });
};
