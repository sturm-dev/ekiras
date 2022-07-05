import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as ethers from 'ethers';

import {CustomIcon, TextByScale} from '_atoms';
import {
  themedStyleSheet,
  MyThemeInterfaceColors,
  shortAccountId,
  getPercentageInHex,
} from '_utils';
import {useNavigationReset} from '_hooks';

import {Screen_Profile__Prop} from './profile-screen';
import {getUsername} from '_db';

interface ProfileLoggedInProps {
  updateTime?: number;
}

export const ProfileLoggedIn: React.FC<ProfileLoggedInProps> = ({
  updateTime,
}: ProfileLoggedInProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Profile__Prop>();

  const {handleResetNavigation} = useNavigationReset();

  const [userAddress, setUserAddress] = useState('');
  const [userAddressOrUsernameLoading, setUserAddressOrUsernameLoading] =
    useState(true);
  const [username, setUsername] = useState('');
  const [logOutLoading, setLogOutLoading] = useState(false);

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // do refresh after update username
  useEffect(() => {
    getUserInfo();
  }, [updateTime]);

  const getUserInfo = async () => {
    setUserAddressOrUsernameLoading(true);
    // ────────────────────────────────────────────────────────────────────────────────
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) return;

    const accountFromMnemonic = ethers.Wallet.fromMnemonic(
      credentials.password,
    );

    setUserAddress(accountFromMnemonic.address);
    setUsername(await getUsername(accountFromMnemonic.address));
    // ────────────────────────────────────────────────────────────────────────────────
    setUserAddressOrUsernameLoading(false);
  };

  const Item = ({text, onPress}: {text: string; onPress?: () => void}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <TextByScale>{text}</TextByScale>
      </TouchableOpacity>
    );
  };

  const onLogout = async () => {
    setLogOutLoading(true);
    await Keychain.resetGenericPassword();
    handleResetNavigation({stack: 'Stack_App', screen: 'Screen_Home'});
  };

  return (
    <ScrollView style={styles.container}>
      {/* • • • • • */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSubContainer}
          onPress={() =>
            navigation.navigate('Screen_UpdateUsername', {
              userAddress,
              username,
            })
          }>
          <View style={styles.userImage} />
          <View style={{flex: 1}}>
            {userAddressOrUsernameLoading ? (
              <ActivityIndicator
                size="small"
                style={{alignSelf: 'flex-start'}}
              />
            ) : (
              <>
                <TextByScale>{username}</TextByScale>
                <TextByScale scale="caption" color={colors.text2}>
                  {shortAccountId(userAddress)}
                </TextByScale>
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.amountOfCredits}>
          <CustomIcon type="octicon" name="comment" color={colors.text} />
          <TextByScale
            scale="caption"
            style={{marginTop: 5}}
            color={colors.text2}>
            320
          </TextByScale>
        </TouchableOpacity>
      </View>
      {/* • • • • • */}
      <View style={styles.body}>
        <Item text="See my public address" />
        <View style={styles.separator} />
        <Item text="My Posts" />
      </View>
      {/* • • • • • */}
      <SafeAreaView edges={['bottom']}>
        <TouchableOpacity
          style={styles.footer}
          onPress={logOutLoading ? () => null : onLogout}
          activeOpacity={logOutLoading ? 1 : 0.8}>
          {logOutLoading ? (
            <ActivityIndicator size="large" color={colors.text} />
          ) : (
            <TextByScale color={colors.text2}>Log out</TextByScale>
          )}
        </TouchableOpacity>
      </SafeAreaView>
      {/* • • • • • */}
    </ScrollView>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  headerSubContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: 'violet',
    marginRight: 15,
  },
  amountOfCredits: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  body: {
    padding: 10,
    flex: 1,
  },
  item: {
    paddingVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.text2 + getPercentageInHex(50),
    width: '100%',
    alignSelf: 'center',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}));
