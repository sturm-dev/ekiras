import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Jazzicon from 'react-native-jazzicon';

import {TextByScale} from '_atoms';
import {
  themedStyleSheet,
  MyThemeInterfaceColors,
  shortAccountId,
  getPercentageInHex,
  formatToDecimals,
} from '_utils';
import {useNavigationReset} from '_hooks';

import {getBalance, getUserAddress, getUsername, onLogout} from '_db';

import {image_polygon} from 'src/assets/images';
import {Screen_Profile__Prop} from '../profile-screen';

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

  // ────────────────────────────────────────────────────────────────────────────────
  const [userAddress, setUserAddress] = useState('');
  const [username, setUsername] = useState('');
  const [userAddressOrUsernameLoading, setUserAddressOrUsernameLoading] =
    useState(true);
  // ────────────────────────
  const [userBalance, setUserBalance] = useState('0');
  const [userBalanceLoading, setUserBalanceLoading] = useState(true);
  // ────────────────────────
  const [logOutLoading, setLogOutLoading] = useState(false);
  // ────────────────────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // do refresh after update username
  useEffect(() => {
    getUserInfo();
  }, [updateTime]);

  useEffect(() => {
    getUserBalance(userAddress);
  }, [userAddress]);

  // ────────────────────────────────────────────────────────────────────────────────

  const getUserInfo = async () => {
    setUserAddressOrUsernameLoading(true);
    const {userAddress: _userAddress, error: getUserAddressError} =
      await getUserAddress();

    if (getUserAddressError) {
      Alert.alert('Error', getUserAddressError);
      setUserAddressOrUsernameLoading(false);
    } else {
      setUserAddress(_userAddress);
      const {username: _username, error: getUsernameError} = await getUsername(
        _userAddress,
      );

      if (getUsernameError) {
        Alert.alert('Error', getUsernameError);
        setUserAddressOrUsernameLoading(false);
      } else {
        setUsername(_username);
        setUserAddressOrUsernameLoading(false);
      }
    }
  };

  const getUserBalance = async (_userAddress: string) => {
    if (_userAddress) {
      setUserBalanceLoading(true);
      const {balance, error} = await getBalance(_userAddress);
      setUserBalanceLoading(false);

      if (error) Alert.alert('Error', error);
      else setUserBalance(formatToDecimals(balance));
    }
  };

  const handleLogout = async () => {
    setLogOutLoading(true);
    const {error} = await onLogout();

    if (error) {
      setLogOutLoading(false);
      Alert.alert('Error', error);
    } else {
      handleResetNavigation({stack: 'Stack_App', screen: 'Screen_Home'});
    }
  };

  // ──────────────────────────────────────────────────────────────

  const Item = ({text, onPress}: {text: string; onPress?: () => void}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <TextByScale>{text}</TextByScale>
      </TouchableOpacity>
    );
  };

  // ────────────────────────────────────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container}>
      {/* • • • • • */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSubContainer}
          onPress={() =>
            userAddressOrUsernameLoading
              ? null
              : navigation.navigate('Screen_UpdateUsername', {
                  userAddress,
                  username,
                })
          }>
          <Jazzicon
            size={30}
            address={userAddress}
            containerStyle={{marginRight: 10}}
          />
          <View style={{flex: 1}}>
            {userAddressOrUsernameLoading ? (
              <ActivityIndicator
                size="small"
                style={{alignSelf: 'flex-start'}}
              />
            ) : (
              <>
                {username ? <TextByScale>{username}</TextByScale> : null}
                <TextByScale
                  scale={username ? 'caption' : 'body1'}
                  color={username ? colors.text2 : colors.text}>
                  {shortAccountId(userAddress)}
                </TextByScale>
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.amountOfCredits}
          onPress={() =>
            userAddressOrUsernameLoading
              ? null
              : navigation.navigate('Screen_MyBalance', {
                  userAddress,
                  balance: userBalance,
                })
          }>
          <Image source={image_polygon} style={{width: 30, height: 30}} />
          {userBalanceLoading ? (
            <ActivityIndicator
              size="large"
              style={{transform: [{scale: 0.4}]}}
            />
          ) : (
            <TextByScale
              scale="caption"
              color={colors.text2}
              style={{marginTop: 6}}>
              {userBalance}
            </TextByScale>
          )}
        </TouchableOpacity>
      </View>
      {/* • • • • • */}
      <View style={styles.body}>
        <Item
          text="See my public address"
          onPress={() =>
            userAddressOrUsernameLoading
              ? null
              : navigation.navigate('Screen_MyPublicAddress', {userAddress})
          }
        />
        <View style={styles.separator} />
        <Item
          text="My Posts"
          onPress={() =>
            userAddressOrUsernameLoading
              ? null
              : navigation.navigate('Screen_MyPosts', {userAddress})
          }
        />
      </View>
      {/* • • • • • */}
      <SafeAreaView edges={['bottom']}>
        <TouchableOpacity
          style={styles.footer}
          onPress={
            logOutLoading || userAddressOrUsernameLoading
              ? () => null
              : handleLogout
          }
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
