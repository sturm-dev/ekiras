import React from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, ScreenSafeArea, TextByScale} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button} from '_molecules';

export type Screen_MyBalance__Params = {
  userAddress: string;
};

type Screen_MyBalance__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_MyBalance'
>;

export const Screen_MyBalance: React.FC<{
  route: RouteProp<{
    params: Screen_MyBalance__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_MyBalance__Prop>();
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
        <TextByScale>Screen_MyBalance screen</TextByScale>

        <Button
          text="Buy Matic →"
          onPress={() =>
            navigation.navigate('Screen_BuyMatic', {
              userAddress: params.userAddress,
            })
          }
        />
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
