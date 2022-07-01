import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {CustomIcon, TextByScale} from '_atoms';
import {themedStyleSheet, MyThemeInterfaceColors} from '_utils';

interface ProfileLoggedOutProps {}

export const ProfileLoggedOut: React.FC<
  ProfileLoggedOutProps
> = ({}: ProfileLoggedOutProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.card}>
        <CustomIcon
          name="wallet-outline"
          type="ionicon"
          style={styles.icon}
          size={50}
        />
        <TextByScale style={styles.text} scale="h5">
          I already have a wallet created in crypto space
        </TextByScale>
      </TouchableOpacity>
      <TouchableOpacity style={{...styles.card, marginTop: 0}}>
        <CustomIcon name="add" type="material" style={styles.icon} size={50} />
        <TextByScale style={styles.text} scale="h5">
          Create a new wallet
        </TextByScale>
      </TouchableOpacity>
    </View>
  );
};

ProfileLoggedOut.defaultProps = {
  onPress: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
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
}));
