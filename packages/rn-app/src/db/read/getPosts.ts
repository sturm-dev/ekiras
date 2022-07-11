import * as ethers from 'ethers';

import {
  PostInterface,
  contractWithoutSigner,
  handleError,
  emptyAddress,
} from '_db';

export const getPosts = async (
  amountOfPosts: number = 10,
): Promise<{
  posts: PostInterface[];
  error?: string;
}> => {
  try {
    const posts: PostInterface[] = [];

    await Promise.all(
      Array.from({length: amountOfPosts}).map(
        async (e, i) => await contractWithoutSigner.posts(i),
      ),
    )
      .then(values => {
        values.forEach((value, i) => {
          if (value[0] !== emptyAddress) {
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
    return {posts: [], ...handleError(error)};
  }
};
