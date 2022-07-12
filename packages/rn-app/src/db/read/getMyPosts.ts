import * as ethers from 'ethers';

import {
  PostInterface,
  contractWithoutSigner,
  handleError,
  emptyAddress,
  getUserAddress,
} from '_db';

export const getMyPosts = async (
  amountOfPosts: number = 10,
): Promise<{
  posts: PostInterface[];
  error?: string;
}> => {
  try {
    const posts: PostInterface[] = [];

    const postsIndexes = Array.from({length: amountOfPosts}).map((e, i) => i);

    const {userAddress, error} = await getUserAddress();
    if (error) throw new Error(error);

    await Promise.all(
      postsIndexes.map(async e => {
        try {
          return ethers.BigNumber.from(
            (await contractWithoutSigner.addressToPostIds(userAddress, e))._hex,
          ).toNumber();
        } catch (_error) {
          if (!(_error as any).toString().includes('execution reverted')) {
            throw new Error(_error as string);
          }
        }
      }),
    )
      .then(async _values => {
        const myPostsIds = _values.filter(e => e !== undefined);
        console.log(`myPostsIds`, myPostsIds, typeof myPostsIds);

        await Promise.all(
          myPostsIds.map(async e => await contractWithoutSigner.posts(e)),
        )
          .then(values => {
            values.forEach(value => {
              if (value[1] !== emptyAddress) {
                posts.push({
                  id: ethers.BigNumber.from(value[0]._hex).toNumber(),
                  author: value[1],
                  text: value[2],
                  upVotesCount: ethers.BigNumber.from(value[3]._hex).toNumber(),
                  downVotesCount: ethers.BigNumber.from(
                    value[4]._hex,
                  ).toNumber(),
                });
              }
            });
          })
          .catch(e => {
            console.log(`e`, e, typeof e);
            throw new Error(e);
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
