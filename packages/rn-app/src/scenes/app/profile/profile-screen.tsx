import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {AppStackParamList} from '_navigations';
import {
  getPercentageInHex,
  MyThemeInterfaceColors,
  shortAccountId,
  themedStyleSheet,
} from '_utils';
import {SafeAreaView} from 'react-native-safe-area-context';

// ────────────────────────────────────────────────────────────────────────────────

const userId = '0x365aEf443783331c487Eaf8C576A248f15e221c5';
const username = 'Nathan Michael';

// ────────────────────────────────────────────────────────────────────────────────

export type Screen_Profile__Params = undefined;

type Screen_Profile__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_Profile'
>;

export const Screen_Profile: React.FC<{
  route: RouteProp<{
    params: Screen_Profile__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Profile__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Item = ({text, onPress}: {text: string; onPress?: () => void}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <TextByScale>{text}</TextByScale>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        {/* • • • • • */}
        <BackButton onPress={() => navigation.goBack()} />
        {/* • • • • • */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerSubContainer}>
            <View style={styles.userImage} />
            <View style={{flex: 1}}>
              <TextByScale>{username}</TextByScale>
              <TextByScale scale="caption" color={colors.text2}>
                {shortAccountId(userId)}
              </TextByScale>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.amountOfCredits}>
            <CustomIcon type="octicon" name="comment" color={colors.text} />
            <TextByScale
              scale="caption"
              style={{marginTop: 5}}
              color={colors.text2}>
              320
            </TextByScale>
          </TouchableOpacity>
        </View>
        {/* • • • • • */}
        <View style={styles.body}>
          <Item text="My Posts" />
          <View style={styles.separator} />
          <Item text="My Posts" />
          <View style={styles.separator} />
          <Item text="My Posts" />
        </View>
        {/* • • • • • */}
        <SafeAreaView edges={['bottom']}>
          <TouchableOpacity style={styles.footer}>
            <TextByScale color={colors.text2}>Log out</TextByScale>
          </TouchableOpacity>
        </SafeAreaView>
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
    paddingLeft: 10,
  },
  headerSubContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: 'violet',
    marginRight: 15,
  },
  amountOfCredits: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  body: {
    padding: 10,
    flex: 1,
  },
  item: {
    paddingVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.text2 + getPercentageInHex(50),
    width: '100%',
    alignSelf: 'center',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}));
