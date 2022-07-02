import React from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {ScreenSafeArea, TextByScale} from '_atoms';
import {OnboardingStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {useNavigationReset} from '_hooks';

export type Screen_Slides__Params = undefined;

type Screen_Slides__Prop = NativeStackNavigationProp<
  OnboardingStackParamList,
  'Screen_Slides'
>;

export const Screen_Slides: React.FC<{
  route: RouteProp<{
    params: Screen_Slides__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Slides__Prop>();
  const {params} = route;

  const {handleResetNavigation} = useNavigationReset();

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      handleResetNavigation({
        stack: 'Stack_App',
        screen: 'Screen_Home',
      });
    }, 1000);
  }, [handleResetNavigation]);

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        <TextByScale>Slides</TextByScale>
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
}));
