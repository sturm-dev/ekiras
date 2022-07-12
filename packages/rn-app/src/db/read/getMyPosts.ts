import * as ethers from 'ethers';

import {
  PostInterface,
  contractWithoutSigner,
  handleError,
  postOwnerIsNotEmptyAddress,
  getUserAddress,
  formatPost,
} from '_db';

export const getMyPosts = async (
  amountOfPosts: number = 10,
): Promise<{
  posts: PostInterface[];
  error?: string;
}> => {
  try {
    const posts: PostInterface[] = [];

    const indexesToGet = Array.from({length: amountOfPosts}).map((e, i) => i); // 0, 1, 2, ...

    const {userAddress, error} = await getUserAddress();
    if (error) throw new Error(error);

    const postsIds = (
      await Promise.all(
        indexesToGet.map(async index => {
          try {
            return ethers.BigNumber.from(
              (await contractWithoutSigner.addressToPostIds(userAddress, index))
                ._hex,
            ).toNumber();
          } catch (_error) {
            if (!(_error as any).toString().includes('execution reverted'))
              throw new Error(_error as string);
          }
        }),
      )
    ).filter(e => e !== undefined);

    const values = await Promise.all(
      postsIds.map(async e => await contractWithoutSigner.posts(e)),
    );

    values.forEach(value =>
      postOwnerIsNotEmptyAddress(value) ? posts.push(formatPost(value)) : null,
    );

    return {posts};
  } catch (error) {
    return {posts: [], ...handleError(error)};
  }
};
