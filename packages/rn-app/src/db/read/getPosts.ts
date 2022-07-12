import * as ethers from 'ethers';

import {
  PostInterface,
  contractWithoutSigner,
  handleError,
  postOwnerIsNotEmptyAddress,
  formatPost,
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

    const values = await Promise.all(
      postsIndexes.map(async e => await contractWithoutSigner.posts(e)),
    );

    values.forEach(value =>
      postOwnerIsNotEmptyAddress(value) ? posts.push(formatPost(value)) : null,
    );

    return {posts};
  } catch (error) {
    return {posts: [], ...handleError(error)};
  }
};
