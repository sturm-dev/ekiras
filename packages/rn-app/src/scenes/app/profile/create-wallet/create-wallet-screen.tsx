import React from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, ListOf12Words, ScreenSafeArea, TextByScale} from '_atoms';
import {arrayOf12Words, MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button} from '_molecules';
import {useNavigationReset} from '_hooks';

export type Screen_CreateWallet__Params = undefined;

type Screen_CreateWallet__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_CreateWallet'
>;

export const Screen_CreateWallet: React.FC<{
  route: RouteProp<{
    params: Screen_CreateWallet__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_CreateWallet__Prop>();
  const {params} = route;

  const {handleResetNavigation} = useNavigationReset();

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
  }, []);

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <TextByScale scale="h3">Your wallet was created! 🎉</TextByScale>
        <TextByScale
          style={{marginTop: 10, marginBottom: 25}}
          color={colors.text2}>
          Write this 12 words in paper and save in a safe place
        </TextByScale>
        <ListOf12Words words={arrayOf12Words} />
        <Button
          text="Continue"
          style={{marginTop: 30}}
          onPress={() =>
            handleResetNavigation({
              stack: 'Stack_App',
              screen: 'Screen_Home',
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
    padding: 20,
  },
}));
