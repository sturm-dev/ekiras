import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Jazzicon from 'react-native-jazzicon';
import DeviceInfo from 'react-native-device-info';

import {TextByScale} from '_atoms';
import {
  themedStyleSheet,
  MyThemeInterfaceColors,
  shortAccountId,
  getPercentageInHex,
} from '_utils';
import {useNavigationReset} from '_hooks';

import {getUsername, onLogout, loadLocalData} from '_db';

import {image_polygon} from 'src/assets/images';
import {Screen_Profile__Prop} from '../profile-screen';
import {REPO_GITHUB_URL} from 'src/config/constants';

interface ProfileLoggedInProps {
  updateTime?: number;
}

export const ProfileLoggedIn: React.FC<ProfileLoggedInProps> = ({
  updateTime,
}: ProfileLoggedInProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [myAddress, setMyAddress] = useState('');
  const [myBalance, setMyBalance] = useState('');

  const navigation = useNavigation<Screen_Profile__Prop>();

  const {handleResetNavigation} = useNavigationReset();

  // ────────────────────────────────────────────────────────────────────────────────
  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [logOutLoading, setLogOutLoading] = useState(false);
  // ────────────────────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ────────────────────────────────────────────────────────────────────────────────
  const [oldUpdateTime, setOldUpdateTime] = useState(0);
  // do refresh when go back to this screen and updateTime is changed
  useEffect(() => {
    if (updateTime && updateTime !== oldUpdateTime) {
      setOldUpdateTime(updateTime);

      // The refresh logic ─────────────────────────────────────────────────────────────────
      getUserInfo();
      // The refresh logic ─────────────────────────────────────────────────────────────────
    }
  }, [updateTime, oldUpdateTime]);
  // ────────────────────────────────────────────────────────────────────────────────

  // ────────────────────────────────────────────────────────────────────────────────

  const getUserInfo = async () => {
    setUsernameLoading(true);

    const _myAddress = await loadLocalData('myAddress');
    setMyAddress(_myAddress);
    const _myBalance = await loadLocalData('myBalance');
    setMyBalance(_myBalance);

    const {username: _username, error: getUsernameError} = await getUsername(
      _myAddress,
    );

    if (getUsernameError) {
      Alert.alert('Error', getUsernameError);
      setUsernameLoading(false);
    } else {
      setUsername(_username);
      setUsernameLoading(false);
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

  const onAboutPress = () => {
    Alert.alert(
      'We ❤️ open Source',
      '\n' +
        'Do you want to view the project on GitHub?' +
        '\n\n\n' +
        'Ekiras v' +
        DeviceInfo.getVersion() +
        ' - ' +
        'Build ' +
        DeviceInfo.getBuildNumber(),
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => Linking.openURL(REPO_GITHUB_URL),
        },
      ],
    );
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
          activeOpacity={usernameLoading ? 1 : 0.8}
          onPress={() =>
            usernameLoading
              ? null
              : navigation.navigate('Screen_UpdateUsername', {username})
          }>
          <Jazzicon
            size={30}
            address={myAddress}
            containerStyle={{marginRight: 10}}
          />
          <View style={{flex: 1}}>
            {usernameLoading ? (
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
                  {shortAccountId(myAddress)}
                </TextByScale>
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.amountOfCredits}
          onPress={() => navigation.navigate('Screen_MyBalance')}>
          <Image source={image_polygon} style={{width: 30, height: 30}} />
          <TextByScale
            scale="caption"
            color={colors.text2}
            style={{marginTop: 6}}>
            {myBalance}
          </TextByScale>
        </TouchableOpacity>
      </View>
      {/* • • • • • */}
      <View style={styles.body}>
        <Item
          text="See my public address"
          onPress={() => navigation.navigate('Screen_MyPublicAddress')}
        />
        <View style={styles.separator} />
        <Item
          text="My Posts"
          onPress={() => navigation.navigate('Screen_MyPosts')}
        />
        <View style={styles.separator} />
        <Item text="About" onPress={onAboutPress} />
      </View>
      {/* • • • • • */}
      <SafeAreaView edges={['bottom']}>
        <TouchableOpacity
          style={styles.footer}
          onPress={logOutLoading ? () => null : handleLogout}
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
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: colors.text2 + getPercentageInHex(50),
    width: '95%',
    alignSelf: 'center',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}));
