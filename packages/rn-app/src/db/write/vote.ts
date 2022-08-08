import * as ethers from 'ethers';
import {gql} from '@apollo/client';

import {handleError, contractWithSigner, PostInterface} from '_db';
import {cache} from 'src';

export const vote = async ({
  post,
  voteIsTypeUp,
  gasPrice,
}: {
  post: PostInterface;
  voteIsTypeUp: boolean;
  gasPrice?: string;
}): Promise<{
  error?: string;
}> => {
  try {
    const contract = await contractWithSigner();

    const tx = await contract.votePost(
      post.id,
      voteIsTypeUp,
      gasPrice
        ? {gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei')}
        : undefined,
    );
    console.log(`tx.hash`, tx.hash);

    await new Promise<void>(res => contract.on('VoteEvent', res));
    console.log('VoteEvent');

    cache.modify({
      fields: {
        posts(existingPosts = []) {
          const updatedPostRef = cache.writeFragment({
            data: {
              __typename: 'Post',
              id: '14',
              upVotesCount: '13',
              downVotesCount: '14',
            },
            fragment: gql`
              fragment NewPost on Post {
                id
                upVotesCount
                downVotesCount
              }
            `,
          });

          // TODO: not add duplicate item to array

          console.log(
            `[...existingPosts, updatedPostRef]`,
            JSON.stringify([...existingPosts, updatedPostRef], null, 2),
          );

          return [...existingPosts, updatedPostRef];
        },
      },
    });

    return {};
  } catch (error) {
    return handleError(error);
  }
};
