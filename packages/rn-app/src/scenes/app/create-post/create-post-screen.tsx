import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  BackButton,
  CustomIcon,
  CustomKeyboardAvoidingView,
  ScreenSafeArea,
  TextByScale,
} from '_atoms';
import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {Button, MultilineTextInput} from '_molecules';
import {SafeAreaView} from 'react-native-safe-area-context';

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

  // ────────────────────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.header}>
            <TextByScale scale="h3">Create Post</TextByScale>
          </View>
          <View style={styles.body}>
            <MultilineTextInput value={text} onChangeText={setText} />
          </View>
          <SafeAreaView edges={['bottom']}>
            <View style={styles.footer}>
              <Button onPress={() => null} text="Create post" />
            </View>
          </SafeAreaView>
        </View>
      </CustomKeyboardAvoidingView>
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
  },
}));
