import React, {useState} from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, CustomKeyboardAvoidingView, ScreenSafeArea} from '_atoms';
import {
  mockData_username,
  MyThemeInterfaceColors,
  themedStyleSheet,
} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button, TextInput} from '_molecules';

export type Screen_UpdateUsername__Params = undefined;

type Screen_UpdateUsername__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_UpdateUsername'
>;

export const Screen_UpdateUsername: React.FC<{
  route: RouteProp<{
    params: Screen_UpdateUsername__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_UpdateUsername__Prop>();
  const {params} = route;

  const [username, setUsername] = useState(mockData_username);

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
  }, []);

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton onPress={() => navigation.goBack()} />
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="username"
          />
          <Button
            text="Update username"
            onPress={() => navigation.goBack()}
            style={{marginTop: 30}}
          />
          <View style={{flex: 0.5}} />
        </View>
      </CustomKeyboardAvoidingView>
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
}));
