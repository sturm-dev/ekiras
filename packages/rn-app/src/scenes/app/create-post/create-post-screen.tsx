import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Icon, ScreenSafeArea, TextByScale} from '_atoms';
import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';

export type Screen_CreatePost__Params = undefined;

type Screen_CreatePost__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_CreatePost'
>;

export const Screen_CreatePost: React.FC<{
  route: RouteProp<{
    params: Screen_CreatePost__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_CreatePost__Prop>();
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
        <TextByScale>Create Post</TextByScale>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row'}}>
          <Icon name="arrow-back" size={24} color={colors.text} />
          <TextByScale>Go Back</TextByScale>
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
