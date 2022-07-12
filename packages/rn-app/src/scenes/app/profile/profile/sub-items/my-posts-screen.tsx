import React, {useState} from 'react';
import {ActivityIndicator, Alert, FlatList, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, ScreenSafeArea} from '_atoms';
import {Button} from '_molecules';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {getMyPosts, PostInterface} from '_db';
import {PostPreview} from '_componentsForThisApp';

// TODO: refresh posts after delete
// TODO: show loading when fetching posts
// TODO: show disabled the vote buttons
// TODO: reutilize the post preview component (move to components)
// TODO: organize files inside "profile folder"

export type Screen_MyPosts__Params = {
  userAddress: string;
};

type Screen_MyPosts__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_MyPosts'
>;

export const Screen_MyPosts: React.FC<{
  route: RouteProp<{
    params: Screen_MyPosts__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_MyPosts__Prop>();
  const {params} = route;

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostInterface[]>([]);

  const [amountOfPosts, setAmountOfPosts] = useState(10);
  const [getMorePostsLoading, setGetMorePostsLoading] = useState(false);

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    console.log(
      `params.userAddress`,
      params.userAddress,
      typeof params.userAddress,
    );

    onGetMyPosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGetMyPosts = async (amountOfPostsToQuery?: number) => {
    const {posts: _posts, error} = await getMyPosts(amountOfPostsToQuery);
    setLoading(false);

    console.log(`_posts`, JSON.stringify(_posts, null, 2));

    if (error) Alert.alert('Error', error);
    else setPosts(_posts);
  };

  const getMorePosts = async () => {
    setGetMorePostsLoading(true);
    onGetMyPosts(amountOfPosts + 10);
    setAmountOfPosts(amountOfPosts + 10);
  };

  return (
    <ScreenSafeArea>
      <BackButton onPress={loading ? () => null : () => navigation.goBack()} />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        ) : (
          <>
            <FlatList
              data={posts}
              renderItem={({item}) => (
                <PostPreview post={item} myAddress={params.userAddress} />
              )}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingTop: 20, paddingBottom: 50}}
              ItemSeparatorComponent={() => <View style={{height: 15}} />}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
