import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {MyThemeInterfaceColors} from '../../../styles';
import {ScreenSafeArea} from '../../../components/atoms';
import {themedStyleSheet} from '../../../utils';
import {OnboardingStackParamList} from '../../../navigations/constants';
import {TextByScale} from '../../../components/atoms/text-by-scale';

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
  const colors = useTheme().colors as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Slides__Prop>();
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
        <TextByScale>Slides</TextByScale>
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
