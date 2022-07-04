import React, {useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {getPosts, PostInterface} from '_db';

import {PostPreview} from './post-preview-component';

export type Screen_Home__Params = undefined;

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

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    getSomePosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSomePosts = async () => {
    const _posts = await getPosts(10);
    setPosts(_posts);

    console.log(`posts`, JSON.stringify(posts, null, 2));
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextByScale style={{flex: 1, padding: 10}} scale="h3">
            Just Feedback
          </TextByScale>
          <TouchableOpacity
            onPress={() => navigation.navigate('Screen_CreatePost')}
            style={{padding: 10}}>
            <CustomIcon name="add" type="material" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Screen_Profile')}
            style={{padding: 10}}>
            <CustomIcon name="ios-person-sharp" type="ionicon" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={posts}
          renderItem={({
            item: {id, text, author, downVotesCount, upVotesCount},
          }) => (
            <PostPreview
              id={id}
              user={{address: author, username: ''}}
              text={text}
              votes={{up: upVotesCount, down: downVotesCount}}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 50}}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
        />
      </View>
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
}));
