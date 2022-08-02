import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {gql, useQuery} from '@apollo/client';

import {CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {Button} from '_molecules';
import {PostPreview} from '_componentsForThisApp';

import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {getUserAddress, PostInterface} from '_db';

// TODO: useGetPosts with params & error handling
// https://thegraph.com/docs/en/querying/querying-from-an-application/
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

export type Screen_Home__Params = {
  updateTime?: number;
  redirectTo?: keyof AppStackParamList;
};

type Screen_Home__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_Home'
>;

export const Screen_Home: React.FC<{
  route: RouteProp<{
    params: Screen_Home__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Home__Prop>();
  const {params} = route;

  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [voteInProgress, setVoteInProgress] = useState(false);

  const [myAddress, setMyAddress] = useState('');

  const {data, loading, refetch} = useQuery(POSTS_QUERY);

  useEffect(() => {
    if (data) {
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
  }, [data]);

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    getAndSetUserAddress();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // do refresh when go back to this screen and updateTime is changed
  // and get when this screen is opened
  useEffect(() => {
    refetch();
  }, [params?.updateTime, refetch]);

  useEffect(() => {
    if (params?.redirectTo) {
      navigation.navigate(params.redirectTo);
    }
  }, [params?.redirectTo, navigation]);

  console.log('re-render home');

  const getAndSetUserAddress = async () => {
    const {userAddress, error} = await getUserAddress();
    if (!error) setMyAddress(userAddress);
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flex: 1, padding: 10, flexDirection: 'row'}}>
            <TextByScale scale="h3">Just Feedback</TextByScale>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Screen_CreatePost')}
            style={{padding: 10}}>
            <CustomIcon name="add" type="material" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Screen_Profile', {})}
            style={{padding: 10}}>
            <CustomIcon name="ios-person-sharp" type="ionicon" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        ) : (
          <>
            <FlatList
              data={posts}
              renderItem={({item}) => (
                <PostPreview
                  post={item}
                  refreshPosts={() => refetch()}
                  myAddress={myAddress}
                  setVoteInProgress={setVoteInProgress}
                  voteInProgress={voteInProgress}
                />
              )}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingTop: 20, paddingBottom: 50}}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
              ListFooterComponent={
                <Button
                  onPress={() => console.warn('get more posts')}
                  loading={false}
                  text="Get more posts"
                  style={{
                    marginVertical: 30,
                    width: '80%',
                    alignSelf: 'center',
                  }}
                />
              }
            />
          </>
        )}
      </View>
    </ScreenSafeArea>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
