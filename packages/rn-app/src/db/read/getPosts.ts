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

    const postIndex = ethers.BigNumber.from(
      (await contractWithoutSigner.postIndex())._hex,
    ).toNumber();

    // return ${amountOfPosts} indexes sorted descending by index -> 32, 31, 30, ...
    const postsIndexes = Array.from({length: postIndex})
      .map((e, i) => i)
      .reverse()
      .map((e, i) => (i < amountOfPosts ? e : null))
      .filter(e => e !== null);

    await Promise.all(
      postsIndexes.map(async e => await contractWithoutSigner.posts(e)),
    )
      .then(values => {
        values.forEach(value => {
          if (value[1] !== emptyAddress) {
            posts.push({
              id: ethers.BigNumber.from(value[0]._hex).toNumber(),
              author: value[1],
              text: value[2],
              upVotesCount: ethers.BigNumber.from(value[3]._hex).toNumber(),
              downVotesCount: ethers.BigNumber.from(value[4]._hex).toNumber(),
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
