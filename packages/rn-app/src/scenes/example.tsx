import React from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {ScreenSafeArea, TextByScale} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';

export type Screen_Example__Params = undefined;

type Screen_Example__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_Example'
>;

// TODO:
// 1 - add this file to export in ../index
// 2 - add screen name & screen params to constants
// 3 - add this screen to current stack

export const Screen_Example: React.FC<{
  route: RouteProp<{
    params: Screen_Example__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Example__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
  }, []);

  return (
    <ScreenSafeArea>
      <View style={styles.container}>
        <TextByScale>Screen_Example screen</TextByScale>
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
}));
