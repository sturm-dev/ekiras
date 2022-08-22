import {useEffect, useState} from 'react';
import {gql, useLazyQuery} from '@apollo/client';
import {Alert} from 'react-native';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import dayjs from 'dayjs';

import {addObjectsToArrayIfIdNotExists} from '_utils';
import {PostInterface} from '../DBInterfaces';
import {loadLocalData} from '../local';

// const logThePosts = (text: string, _posts: PostInterface[]) => {
//   const newPosts: any[] = [];
//   _posts.forEach((post: PostInterface) => {
//     newPosts.push({
//       id: post.id,
//       text: post.text,
//     });
//   });

//   console.log(text, JSON.stringify(newPosts, null, 2));
// };

const mergePosts = (
  _old: PostInterface[],
  _new: PostInterface[],
  showTrendingPosts: boolean,
) =>
  sortArray(
    addObjectsToArrayIfIdNotExists([..._old], [..._new]),
    showTrendingPosts,
  );

const sortArray = (
  _array: PostInterface[],
  showTrendingPosts: boolean,
): PostInterface[] => {
  return showTrendingPosts
    ? _array.sort((a, b) => b.upVotesCount - a.upVotesCount)
    : _array.sort((a, b) => b.createdDate - a.createdDate);
};

const last3Days = dayjs().unix() - 86400 * 3;

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

  const [onFetch, setOnFetch] = useState(false);
  const [localPosts, setLocalPosts] = useState<PostInterface[]>([]);

  const [showTrendingPosts, setShowTrendingPosts] = useState(false);

  const [getPosts, {data, loading, refetch, error}] = useLazyQuery(
    gql`
      ${jsonToGraphQLQuery(
        {
          query: {
            posts: {
              __args: {
                orderBy: showTrendingPosts ? 'upVotesCount' : 'createdDate',
                orderDirection: 'desc',
                skip: oldPosts.length,
                first: paginationSize,
                ...(authorId
                  ? {where: {author: authorId.toLowerCase()}}
                  : showTrendingPosts
                  ? {where: {createdDate_gt: last3Days}}
                  : {}),
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

  const getLocalData = async () => {
    const _showTrendingPosts = await loadLocalData('showTrendingPosts');
    setShowTrendingPosts(!!_showTrendingPosts);
  };

  useEffect(() => {
    getLocalData();
  }, []);

  useEffect(() => {
    if (error) {
      console.log(`error`, error);
      Alert.alert('Get posts error', error.message);
    } else if (onFetch && data?.posts) {
      setOnFetch(false);

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

      const someOldPostInNewPost = _posts.some((post: PostInterface) =>
        oldPosts.some((oldPost: PostInterface) => oldPost.id === post.id),
      );

      if (_posts.length) {
        if (someOldPostInNewPost) {
          const oldPostsWithoutNewPosts = [...oldPosts].filter(
            oldPost =>
              !_posts.some(
                (newPost: PostInterface) => oldPost.id === newPost.id,
              ),
          );

          setOldPosts(
            mergePosts(oldPostsWithoutNewPosts, _posts, showTrendingPosts),
          );
        } else {
          setOldPosts(mergePosts(oldPosts, _posts, showTrendingPosts));
        }
        setLocalPosts(mergePosts(oldPosts, _posts, showTrendingPosts));
      }
      setPosts(_posts);
    }
  }, [
    onFetch,
    data?.posts,
    error,
    oldPosts,
    refetch,
    posts,
    showTrendingPosts,
  ]);

  const onGetPosts = async () => {
    console.log(`[1;33m -- onGetPosts --[0m`); // log in yellow
    setGetMorePressed(false);

    await getLocalData();

    await setLocalPosts([]);
    await setOldPosts([]);
    await setPosts([]);

    setTimeout(async () => {
      setOnFetch(true);
      await getPosts();
    }, 100);
  };

  const getMore = () => {
    console.log(`[1;33m -- onGetMorePosts --[0m`); // log in yellow

    setOnFetch(true);
    setGetMorePressed(true);

    refetch();
  };

  const onRefetch = () => {
    console.log(`[1;33m -- onRefetchPosts --[0m`); // log in yellow

    setOnFetch(true);
    setGetMorePressed(false);

    refetch();
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // make local changes until `the graph` has the data updated

  const updateLocalPost = (post: PostInterface) => {
    console.log('updateLocalPost');
    const postIndex = localPosts.findIndex(_post => _post.id === post.id);

    if (postIndex !== -1) {
      const arrayCopy = [...localPosts];
      arrayCopy[postIndex] = post;
      setLocalPosts(arrayCopy);
    }
  };

  const createLocalPost = (post: PostInterface) => {
    console.log('createLocalPost');
    setLocalPosts(sortArray([...localPosts, post], showTrendingPosts));
  };

  const removeLocalPost = (post: PostInterface) => {
    console.log('removeLocalPost');
    const postIndex = localPosts.findIndex(_post => _post.id === post.id);

    if (postIndex !== -1)
      setLocalPosts(
        sortArray(
          [...localPosts].filter(obj => post.id !== obj.id),
          showTrendingPosts,
        ),
      );
  };

  return {
    getPosts: onGetPosts,
    posts: localPosts,
    loading: loading || onFetch,
    refetch: onRefetch,
    getMore,
    error,
    limitReached: getMorePressed && !loading && posts.length === 0,
    editLocalPosts: {
      updateLocalPost,
      createLocalPost,
      removeLocalPost,
    },
  };
};

// use of jsonToGraphQLQuery for dynamic use of where clause inside graphql query

// resources:
// https://thegraph.com/docs/en/querying/graphql-api/#pagination
// https://hasura.io/docs/latest/queries/postgres/query-filters/#greater-than-or-less-than-operators-_gt-_lt-_gte-_lte
