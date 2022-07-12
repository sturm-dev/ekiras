import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {getPosts, getUserAddress, PostInterface} from '_db';

import {PostPreview} from './post-preview-component';
import {Button} from '_molecules';

export type Screen_Home__Params = {
  updateTime?: number;
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
  const [loading, setLoading] = useState(true);
  const [refreshingPosts, setRefreshPosts] = useState(false);

  const [amountOfPosts, setAmountOfPosts] = useState(10);
  const [getMorePostsLoading, setGetMorePostsLoading] = useState(false);

  const [myAddress, setMyAddress] = useState('');

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
    setLoading(true);
    setPosts([]);
    getSomePosts();
  }, [params?.updateTime]);

  const getAndSetUserAddress = async () => {
    const {userAddress, error} = await getUserAddress();
    if (!error) setMyAddress(userAddress);
  };

  const getSomePosts = async (
    amountOfPostsToQuery?: number,
    isRefreshPosts?: boolean,
  ) => {
    if (isRefreshPosts) setRefreshPosts(true);
    const {posts: _posts, error} = await getPosts(amountOfPostsToQuery);
    if (isRefreshPosts) setRefreshPosts(false);
    setLoading(false);
    setGetMorePostsLoading(false);

    if (error) Alert.alert('Error', error);
    else setPosts(_posts);
  };

  const getMorePosts = async () => {
    setGetMorePostsLoading(true);
    getSomePosts(amountOfPosts + 10);
    setAmountOfPosts(amountOfPosts + 10);
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flex: 1, padding: 10, flexDirection: 'row'}}>
            <TextByScale scale="h3">Just Feedback</TextByScale>
            {refreshingPosts ? (
              <ActivityIndicator size="small" style={{marginLeft: 5}} />
            ) : null}
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
              renderItem={({
                item: {id, author, text, downVotesCount, upVotesCount},
              }) => (
                <PostPreview
                  id={id}
                  userAddress={author}
                  text={text}
                  votes={{up: upVotesCount, down: downVotesCount}}
                  refreshPosts={() => getSomePosts(amountOfPosts, true)}
                  myAddress={myAddress}
                />
              )}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingTop: 20, paddingBottom: 50}}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              ListFooterComponent={
                <Button
                  onPress={getMorePosts}
                  loading={getMorePostsLoading}
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
    paddingHorizontal: 10,
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
