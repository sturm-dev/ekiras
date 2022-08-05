import {useEffect, useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {Alert} from 'react-native';

import {PostInterface} from '../DBInterfaces';
import {addArrayOfObjectsToArrayIfIdNotExists} from '_utils';

// https://thegraph.com/docs/en/querying/querying-from-an-application/
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

export const useGetPosts = ({paginationSize}: {paginationSize: number}) => {
  const [oldPosts, setOldPosts] = useState<PostInterface[]>([]);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const {data, loading, refetch, error} = useQuery(POSTS_QUERY, {
    variables: {first: paginationSize, skip: oldPosts.length},
  });
  const [getMorePressed, setGetMorePressed] = useState(false);

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

  const allCurrentPosts: PostInterface[] =
    addArrayOfObjectsToArrayIfIdNotExists([...oldPosts], [...posts]);

  const getMore = () => {
    setGetMorePressed(true);
    setOldPosts(allCurrentPosts);
    refetch();
  };

  return {
    posts: allCurrentPosts,
    loading,
    refetch,
    getMore,
    error,
    noMore: getMorePressed && !loading && posts.length === 0,
  };
};
