import {useEffect, useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {Alert} from 'react-native';

import {PostInterface} from '../DBInterfaces';

// https://thegraph.com/docs/en/querying/querying-from-an-application/
// TODO: use params for custom getPosts query
// TODO: get posts orderBy upVotes
// TODO: get next 10 posts

// https://thegraph.com/docs/en/querying/graphql-api/#pagination
// https://hasura.io/docs/latest/queries/postgres/query-filters/#greater-than-or-less-than-operators-_gt-_lt-_gte-_lte
const POSTS_QUERY = gql`
  query Posts($first: Int!, $skip: Int) {
    posts(
      orderBy: upVotesCount
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      id
      createdDate
      author {
        id
        username
      }
      text
      upVotesCount
      downVotesCount
    }
  }
`;

export const useGetPosts = ({
  first,
  skip = 0,
}: {
  first: number;
  skip?: number;
}) => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const {data, loading, refetch, error} = useQuery(POSTS_QUERY, {
    variables: {first, skip},
  });

  useEffect(() => {
    if (error) {
      console.log(`error`, error);
      Alert.alert('Get posts error', error.message);
    } else if (data) {
      const _posts: PostInterface[] = [];

      data.posts.forEach((post: PostInterface) => {
        const _post: PostInterface = {
          id: post.id,
          createdDate: post.createdDate,
          author: {
            id: post.author.id,
            username: post.author.username,
          },
          text: post.text,
          downVotesCount: post.downVotesCount,
          upVotesCount: post.upVotesCount,
        };

        _posts.push(_post);
      });

      setPosts(_posts);
    }
  }, [data, error]);

  return {posts, loading, refetch, error};
};
