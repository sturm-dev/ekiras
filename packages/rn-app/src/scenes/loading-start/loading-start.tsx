import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTheme, RouteProp} from '@react-navigation/native';

import {useNavigationReset} from '_hooks';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {ScreenSafeArea} from '_atoms';

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
    <ScreenSafeArea withBottomEdgeToo>
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    </ScreenSafeArea>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
}));
