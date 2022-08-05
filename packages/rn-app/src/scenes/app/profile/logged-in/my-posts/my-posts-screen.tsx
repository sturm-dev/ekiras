import React, {useEffect} from 'react';
import {ActivityIndicator, Alert, FlatList, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, ScreenSafeArea, TextByScale} from '_atoms';
import {Button} from '_molecules';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {useGetPosts} from '_db';
import {PostPreview} from '_componentsForThisApp';
import {useNavigationReset} from '_hooks';

import {PAGINATION_SIZE} from 'src/config/constants';

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

  const {handleResetNavigation} = useNavigationReset();

  const {posts, loading, refetch, getMore, noMore} = useGetPosts({
    paginationSize: PAGINATION_SIZE,
    authorId: params.userAddress,
  });

  useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && noMore) {
      Alert.alert('No new results');
    }
  }, [loading, noMore]);

  return (
    <ScreenSafeArea>
      <BackButton onPress={loading ? () => null : () => navigation.goBack()} />
      <View style={styles.container}>
        {!posts.length && loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        ) : (
          <>
            <FlatList
              data={posts}
              ListEmptyComponent={
                <View style={styles.noPostsContainer}>
                  <TextByScale scale="h3" center>
                    No posts created by you were found
                  </TextByScale>
                  <TextByScale scale="h0">🤷</TextByScale>
                </View>
              }
              renderItem={({item}) => (
                <PostPreview
                  post={item}
                  myAddress={params.userAddress}
                  refreshPosts={refetch}
                />
              )}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingTop: 20, paddingBottom: 50}}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
              ListFooterComponent={
                !posts.length ? (
                  <Button
                    onPress={() =>
                      handleResetNavigation({
                        stack: 'Stack_App',
                        screen: 'Screen_Home',
                        params: {redirectTo: 'Screen_CreatePost'},
                      })
                    }
                    text="Create post"
                    style={styles.button}
                  />
                ) : (
                  <Button
                    onPress={getMore}
                    loading={loading}
                    text="Get more posts"
                    style={styles.button}
                  />
                )
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
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 30,
    width: '80%',
    alignSelf: 'center',
  },
  noPostsContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
}));
