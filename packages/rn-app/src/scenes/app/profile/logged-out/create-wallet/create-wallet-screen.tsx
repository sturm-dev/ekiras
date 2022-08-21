/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as ethers from 'ethers';
import * as Keychain from 'react-native-keychain';

import {BackButton, ListOf12Words, ScreenSafeArea, TextByScale} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
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

  const [loading, setLoading] = useState(true);
  const [mnemonic, setMnemonic] = useState(['']);
  const [saveWalletLoading, setSaveWalletLoading] = useState(false);

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    createWallet();
  }, []);

  const createWallet = async () => {
    setTimeout(() => {
      const wallet = ethers.Wallet.createRandom();
      setMnemonic(wallet.mnemonic.phrase.split(' '));
      setLoading(false);
    }, 1000);
  };

  const onLogInWithNewWallet = async () => {
    setSaveWalletLoading(true);
    await Keychain.setGenericPassword('', mnemonic.join(' '));

    Alert.alert(
      'Your account is ready! 🎉',
      'note: you will need to add balance to your account to be able to interact.',
      [
        {
          text: 'OK',
          onPress: () => {
            handleResetNavigation({stack: 'Stack_App', screen: 'Screen_Home'});
          },
        },
      ],
    );
  };

  return (
    <ScreenSafeArea withBottomEdgeToo>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : (
        <>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.container}>
            <TextByScale scale="h3">Your account was created! 🎉</TextByScale>
            <TextByScale
              style={{marginTop: 10, marginBottom: 25}}
              color={colors.text2}>
              Write this 12 words in paper and save in a safe place, with only
              this words anyone can access your account.
            </TextByScale>
            <ListOf12Words words={mnemonic} />
            <Button
              loading={saveWalletLoading}
              text="I have already written the words"
              style={{marginTop: 30, paddingHorizontal: 50}}
              numberOfLines={3}
              onPress={onLogInWithNewWallet}
            />
          </View>
        </>
      )}
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
