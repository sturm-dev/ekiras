import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import {
  ONLY_DEV__SEED_1,
  ONLY_DEV__SEED_2,
  ONLY_DEV__SEED_3,
  ONLY_DEV__SEED_4,
} from 'react-native-dotenv';

import {CustomIcon, TextByScale} from '_atoms';
import {themedStyleSheet, MyThemeInterfaceColors} from '_utils';
import {useNavigationReset} from '_hooks';

import {Screen_Profile__Prop} from '../profile-screen';
import {loadLocalData} from 'src/db/local';

const devSeeds = [
  ONLY_DEV__SEED_1,
  ONLY_DEV__SEED_2,
  ONLY_DEV__SEED_3,
  ONLY_DEV__SEED_4,
];

interface ProfileLoggedOutProps {}

export const ProfileLoggedOut: React.FC<
  ProfileLoggedOutProps
> = ({}: ProfileLoggedOutProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Profile__Prop>();

  const [devMode, setDevMode] = useState('');

  const {handleResetNavigation} = useNavigationReset();

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    getLocalData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocalData = async () => {
    const _devMode = await loadLocalData('devMode');
    setDevMode(_devMode);
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Screen_ImportWallet')}>
        <CustomIcon
          name="account-check"
          type="material-community"
          style={styles.icon}
          size={50}
        />
        <TextByScale style={styles.text} scale="h5">
          I already have a account created in crypto space
        </TextByScale>
      </TouchableOpacity>
      <TouchableOpacity
        style={{...styles.card, marginTop: 0}}
        onPress={() => navigation.navigate('Screen_CreateWallet')}>
        <CustomIcon
          name="account-plus"
          type="material-community"
          style={styles.icon}
          size={50}
        />
        <TextByScale style={styles.text} scale="h5">
          Create a new account
        </TextByScale>
      </TouchableOpacity>
      {devMode ? (
        <View style={styles.fastLogInContainer_onlyDevTesting}>
          {[1, 2, 3, 4].map(i => (
            <TouchableOpacity
              key={i}
              style={styles.fastLogIn_onlyDevTesting}
              onPress={async () => {
                await Keychain.setGenericPassword('', devSeeds[i - 1]);
                handleResetNavigation({
                  stack: 'Stack_App',
                  screen: 'Screen_Home',
                });
              }}>
              <TextByScale>{i}</TextByScale>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

ProfileLoggedOut.defaultProps = {
  onPress: undefined,
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff10',
    margin: 20,
    borderRadius: 10,
    padding: 35,
  },
  icon: {
    marginRight: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  fastLogInContainer_onlyDevTesting: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fastLogIn_onlyDevTesting: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff10',
  },
}));
