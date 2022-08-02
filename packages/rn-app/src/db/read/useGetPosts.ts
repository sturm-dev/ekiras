import {useEffect, useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {Alert} from 'react-native';

import {PostInterface} from '../DBInterfaces';

// https://thegraph.com/docs/en/querying/querying-from-an-application/
// TODO: use params for custom getPosts query
// TODO: get posts orderBy upVotes
// TODO: get next 10 posts

const POSTS_QUERY = gql`
  query Posts {
    posts(first: 10, orderBy: upVotesCount, orderDirection: desc) {
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

export const useGetPosts = (params = {}) => {
  console.log(`params`, params);

  const [posts, setPosts] = useState<PostInterface[]>([]);
  const {data, loading, refetch, error} = useQuery(POSTS_QUERY);

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
