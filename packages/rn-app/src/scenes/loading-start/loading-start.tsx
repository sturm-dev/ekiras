import React, {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useTheme, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useNavigationReset} from '_hooks';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';

export type Screen_LoadingStart__Params = undefined;

export const Screen_LoadingStart: React.FC<{
  route: RouteProp<{
    params: Screen_LoadingStart__Params;
  }>;
}> = () => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const {handleResetNavigation} = useNavigationReset();

  useEffect(() => {
    setTimeout(() => {
      handleResetNavigation({screen: 'Screen_Slides'});
    }, 1000);
  }, [handleResetNavigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ActivityIndicator size="large" color={colors.text} />
    </SafeAreaView>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
}));
