import React from 'react';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, ScreenSafeArea} from '_atoms';
import {AppStackParamList} from '_navigations';
import {
  mockData_loggedIn,
  mockData_userId,
  mockData_username,
  MyThemeInterfaceColors,
  themedStyleSheet,
} from '_utils';
import {ProfileLoggedIn} from './profile-logged-in-component';
import {ProfileLoggedOut} from './profile-logged-out-component';

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

  return (
    <ScreenSafeArea colorStatusBar={colors.background} withBottomEdgeToo>
      <BackButton onPress={() => navigation.goBack()} />
      {mockData_loggedIn ? (
        <ProfileLoggedIn
          userId={mockData_userId}
          username={mockData_username}
        />
      ) : (
        <ProfileLoggedOut />
      )}
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({}));
