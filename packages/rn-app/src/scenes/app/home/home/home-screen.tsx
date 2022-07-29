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
import {Button} from '_molecules';
import {PostPreview} from '_componentsForThisApp';

import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {getPosts, getUserAddress, PostInterface} from '_db';

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
  const [loading, setLoading] = useState(true);
  const [voteInProgress, setVoteInProgress] = useState(false);
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
    onGetPosts();
  }, [params?.updateTime]);

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

  const onGetPosts = async (
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
    onGetPosts(amountOfPosts + 10);
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
              renderItem={({item}) => (
                <PostPreview
                  post={item}
                  refreshPosts={() => onGetPosts(amountOfPosts, true)}
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
