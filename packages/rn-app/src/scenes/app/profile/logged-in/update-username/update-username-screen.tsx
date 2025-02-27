/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, CustomKeyboardAvoidingView, ScreenSafeArea} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button, LoaderFullScreen, TextInput} from '_molecules';
import {updateUsername, loadLocalData} from '_db';

export type Screen_UpdateUsername__Params = {
  username: string;
};

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

  const [myAddress, setMyAddress] = useState('');

  const navigation = useNavigation<Screen_UpdateUsername__Prop>();
  const {params} = route;

  const [username, setUsername] = useState(params.username);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    getLocalData();
  }, []);

  const getLocalData = async () => {
    const _myAddress = await loadLocalData('myAddress');
    setMyAddress(_myAddress);
  };

  const onUpdateUsername = async () => {
    setLoading(true);
    const {error} = await updateUsername({
      newUsername: username,
      userAddress: myAddress,
    });
    setLoading(false);

    if (error) {
      if (error === 'gas required exceeds allowance') {
        Alert.alert("You don't have enough gas");
      } else Alert.alert('Error', error);
    } else {
      Alert.alert(
        'Possible delay to see the changes in the posts',
        `\nBetween the blockchain data and "The graph" data there is a few seconds delay.`,
      );
      navigation.navigate('Screen_Profile', {
        updateTime: new Date().getTime(),
      });
    }
  };

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton onPress={loading ? () => null : () => navigation.goBack()} />
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <TextInput
            value={username}
            onChangeText={loading ? () => null : setUsername}
            placeholder="username"
            autoCapitalize="none"
          />
          <Button
            loading={loading}
            text="Update username"
            onPress={onUpdateUsername}
            style={{marginTop: 30}}
            disabled={username === params.username}
          />
          <View style={{flex: 0.5}} />
        </View>
      </CustomKeyboardAvoidingView>
      {/* ───────────────────────────────────────────────────────────────── */}
      {loading ? <LoaderFullScreen /> : null}
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
  addressContainer: {
    width: '100%',
    alignItems: 'center',
  },
}));
