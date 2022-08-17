import React from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, ScreenSafeArea, TextByScale} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';

export type Screen_Example__Params = undefined;

type Screen_Example__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_Example'
>;

// TODO:
// 1 - replace "Example" coincidences with screen name
// 2 - add this file to export in ../index
// 3 - add screen name & screen params to constants
// 4 - add this screen to current stack

export const Screen_Example: React.FC<{
  route: RouteProp<{
    params: Screen_Example__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Example__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenSafeArea>
      <BackButton onPress={() => navigation.goBack()} />
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
