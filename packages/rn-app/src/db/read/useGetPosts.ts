import {useEffect, useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {Alert} from 'react-native';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';

import {PostInterface} from '../DBInterfaces';
import {addObjectsToArrayIfIdNotExists} from '_utils';

export const useGetPosts = ({
  paginationSize,
  authorId,
}: {
  paginationSize: number;
  authorId?: string;
}) => {
  const [oldPosts, setOldPosts] = useState<PostInterface[]>([]);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [getMorePressed, setGetMorePressed] = useState(false);

  const {data, loading, refetch, error} = useQuery(
    gql`
      ${jsonToGraphQLQuery(
        {
          query: {
            posts: {
              __args: {
                orderBy: 'createdDate',
                orderDirection: 'desc',
                skip: oldPosts.length,
                first: paginationSize,
                ...(authorId ? {where: {author: authorId.toLowerCase()}} : {}),
              },
              id: true,
              createdDate: true,
              author: {
                id: true,
                username: true,
              },
              text: true,
              upVotesCount: true,
              downVotesCount: true,
            },
          },
        },
        {pretty: true},
      )}
    `,
  );

  useEffect(() => {
    if (error) {
      console.log(`error`, error);
      Alert.alert('Get posts error', error.message);
    } else if (data) {
      const _posts: PostInterface[] = [];

      data.posts.forEach((post: any) => {
        const _post: PostInterface = {
          id: parseInt(post.id, 10),
          createdDate: parseInt(post.createdDate, 10),
          author: {
            id: post.author.id,
            username: post.author.username,
          },
          text: post.text,
          downVotesCount: parseInt(post.downVotesCount, 10),
          upVotesCount: parseInt(post.upVotesCount, 10),
        };

        _posts.push(_post);
      });

      setPosts(_posts);
    }
  }, [data, error]);

  const allCurrentPosts: PostInterface[] = addObjectsToArrayIfIdNotExists(
    [...oldPosts],
    [...posts],
  );

  const getMore = () => {
    setGetMorePressed(true);
    setOldPosts(allCurrentPosts);
    refetch();
  };

  const onRefetch = () => {
    setGetMorePressed(false);
    refetch();
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // make local changes until `the graph` has the data updated

  const updatePost = (post: PostInterface) => {
    const insideOldPosts = oldPosts.findIndex(_post => _post.id === post.id);
    const insidePosts = posts.findIndex(_post => _post.id === post.id);

    if (insideOldPosts !== -1) {
      const arrayCopy = [...oldPosts];
      arrayCopy[insideOldPosts] = post;
      setOldPosts(arrayCopy);
    } else if (insidePosts !== -1) {
      const arrayCopy = [...posts];
      arrayCopy[insidePosts] = post;
      setPosts(arrayCopy);
    }
  };

  const createPost = (post: PostInterface) => setOldPosts([...oldPosts, post]);

  return {
    posts: allCurrentPosts,
    loading,
    refetch: onRefetch,
    getMore,
    error,
    limitReached: getMorePressed && !loading && posts.length === 0,
    editPosts: {
      updatePost,
      createPost,
    },
  };
};

// use of jsonToGraphQLQuery for dynamic use of where clause inside graphql query

// resources:
// https://thegraph.com/docs/en/querying/graphql-api/#pagination
// https://hasura.io/docs/latest/queries/postgres/query-filters/#greater-than-or-less-than-operators-_gt-_lt-_gte-_lte
