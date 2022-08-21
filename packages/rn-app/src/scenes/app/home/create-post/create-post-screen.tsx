import React from 'react';
import {Alert, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';

import {
  BackButton,
  CustomKeyboardAvoidingView,
  ScreenSafeArea,
  TextByScale,
} from '_atoms';
import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {Button, LoaderFullScreen, MultilineTextInput} from '_molecules';
import {createPost, getUsername, PostInterface} from '_db';
import {loadLocalData} from 'src/db/local';

export type Screen_CreatePost__Params = undefined;

type Screen_CreatePost__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_CreatePost'
>;

export const Screen_CreatePost: React.FC<{
  route: RouteProp<{
    params: Screen_CreatePost__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_CreatePost__Prop>();
  const {params} = route;

  // ────────────────────────────────────────────────────────────────────────────────

  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // ────────────────────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreatePost = async () => {
    const userAddress = await loadLocalData('myAddress');

    setLoading(true);
    const {error, newPostId} = await createPost({text, userAddress});
    setLoading(false);

    if (error) {
      if (error === 'no mnemonic found') {
        Alert.alert('You need to log-in to interact with the app');
      } else if (error === 'gas required exceeds allowance') {
        Alert.alert("You don't have enough gas");
      } else Alert.alert('Error', error);
    } else {
      const {username} = await getUsername(userAddress);

      const newPost: PostInterface = {
        id: newPostId,
        createdDate: dayjs().unix(),
        text,
        author: {id: userAddress, username},
        downVotesCount: 0,
        upVotesCount: 0,
      };

      navigation.navigate('Screen_Home', {
        updateTime: new Date().getTime(),
        createLocalPost: newPost,
      });
    }
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background} withBottomEdgeToo>
      <BackButton onPress={loading ? () => null : () => navigation.goBack()} />
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TextByScale scale="h3">Create Post</TextByScale>
          </View>
          <View style={styles.body}>
            <MultilineTextInput
              value={text}
              onChangeText={loading ? () => null : setText}
              autoCapitalize="none"
            />
            <TextByScale
              color={colors.text2}
              scale="caption"
              center
              style={{marginTop: 5}}>
              {`note: you need to be logged & have balance \nto create a post`}
            </TextByScale>
          </View>
          <View style={styles.footer}>
            <Button
              onPress={onCreatePost}
              text="Create post"
              disabled={!text || text.length < 10 || text.length > 140}
              loading={loading}
            />
          </View>
        </View>
      </CustomKeyboardAvoidingView>
      {/* ───────────────────────────────────────────────────────────────── */}
      {loading ? <LoaderFullScreen /> : null}
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
    alignItems: 'center',
    padding: 10,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  footer: {
    width: '80%',
    alignSelf: 'center',
    paddingBottom: 15,
  },
}));
