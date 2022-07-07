import React, {useState} from 'react';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Keychain from 'react-native-keychain';

import {BackButton, ScreenSafeArea} from '_atoms';
import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {ProfileLoggedIn} from './profile-logged-in-component';
import {ProfileLoggedOut} from './profile-logged-out-component';
import {ActivityIndicator, View} from 'react-native';

export type Screen_Profile__Params = {
  updateTime?: number;
};

export type Screen_Profile__Prop = NativeStackNavigationProp<
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

  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    checkUserLogged();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserLogged = async () => {
    setUserLogged(!!(await Keychain.getGenericPassword()));
    setLoading(false);
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background} withBottomEdgeToo>
      <BackButton
        onPress={
          userLogged
            ? () =>
                navigation.navigate('Screen_Home', {
                  updateTime: new Date().getTime(),
                })
            : () => navigation.goBack()
        }
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : userLogged ? (
        <ProfileLoggedIn updateTime={params?.updateTime} />
      ) : (
        <ProfileLoggedOut />
      )}
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
