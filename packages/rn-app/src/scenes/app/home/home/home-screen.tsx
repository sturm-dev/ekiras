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
import {getUserAddress, useGetPosts} from '_db';

import {PAGINATION_SIZE} from 'src/config/constants';

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

  const {posts, loading, refetch, getMore, limitReached, updatePost} =
    useGetPosts({
      paginationSize: PAGINATION_SIZE,
    });

  const [voteInProgress, setVoteInProgress] = useState(false);
  const [myAddress, setMyAddress] = useState('');
  const [oldUpdateTime, setOldUpdateTime] = useState(0);
  const [loadingUserAddress, setLoadingUserAddress] = useState(true);

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    // TODO: transform to: useGetUserAddress
    getAndSetUserAddress();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // do refresh when go back to this screen and updateTime is changed
  useEffect(() => {
    if (params?.updateTime && params.updateTime !== oldUpdateTime) {
      setOldUpdateTime(params?.updateTime);
      refetch();
    }
  }, [params?.updateTime, refetch, oldUpdateTime]);

  useEffect(() => {
    if (params?.redirectTo) {
      navigation.navigate(params.redirectTo);
    }
  }, [params?.redirectTo, navigation]);

  useEffect(() => {
    if (!loading && limitReached) {
      Alert.alert('No new results');
    }
  }, [loading, limitReached]);

  const getAndSetUserAddress = async () => {
    const {userAddress, error} = await getUserAddress();
    if (!error) await setMyAddress(userAddress);

    setLoadingUserAddress(false);
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flex: 1, padding: 10}}>
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
        {(!posts.length && loading) || loadingUserAddress ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={({item}) => (
              <PostPreview
                post={item}
                refreshPosts={refetch}
                myAddress={myAddress}
                setVoteInProgress={setVoteInProgress}
                voteInProgress={voteInProgress}
                updatePost={updatePost}
              />
            )}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingTop: 20, paddingBottom: 50}}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListFooterComponent={
              <Button
                onPress={getMore}
                loading={loading}
                text="Get more posts"
                style={{
                  marginVertical: 30,
                  width: '80%',
                  alignSelf: 'center',
                }}
              />
            }
          />
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
