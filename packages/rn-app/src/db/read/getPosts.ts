import * as ethers from 'ethers';

import {
  abi,
  provider,
  PostInterface,
  contractAddress,
  handleSolidityErrors,
} from '_db';

export const getPosts = async (
  amountOfPosts: number,
): Promise<{
  posts: PostInterface[];
  error?: string;
}> => {
  try {
    const posts: PostInterface[] = [];

    if (!amountOfPosts) console.log();
    // TODO: make the amountOfPosts work with this get

    await Promise.all(
      [
        0, 1, 2, 3, 4,
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        // 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      ].map(
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
      })
      .catch(e => {
        console.log(`e`, e, typeof e);
        throw new Error(e);
      });

    return {posts};
  } catch (error) {
    return {posts: [], ...handleSolidityErrors(error)};
  }
};
