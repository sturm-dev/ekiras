import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {MyThemeInterfaceColors} from '../../../styles';
import {ScreenSafeArea} from '../../../components/atoms';
import {themedStyleSheet} from '../../../utils';
import {OnboardingStackParamList} from '../../../navigations/constants';
import {TextByScale} from '../../../components/atoms/text-by-scale';

export type Screen_Register__Params = undefined;

type Screen_Register__Prop = NativeStackNavigationProp<
  OnboardingStackParamList,
  'Screen_Register'
>;

export const Screen_Register: React.FC<{
  route: RouteProp<{
    params: Screen_Register__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Register__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        <TextByScale>Register</TextByScale>
        <TouchableOpacity onPress={() => navigation.navigate('Stack_App')}>
          <TextByScale>Go To Home</TextByScale>
        </TouchableOpacity>
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
