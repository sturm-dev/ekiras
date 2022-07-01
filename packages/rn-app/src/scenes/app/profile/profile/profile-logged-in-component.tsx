import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {CustomIcon, TextByScale} from '_atoms';
import {
  themedStyleSheet,
  MyThemeInterfaceColors,
  shortAccountId,
  getPercentageInHex,
} from '_utils';
import {SafeAreaView} from 'react-native-safe-area-context';

interface ProfileLoggedInProps {
  userId: string;
  username: string;
}

export const ProfileLoggedIn: React.FC<ProfileLoggedInProps> = ({
  userId,
  username,
}: ProfileLoggedInProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();
  }, []);

  const Item = ({text, onPress}: {text: string; onPress?: () => void}) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <TextByScale>{text}</TextByScale>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* • • • • • */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerSubContainer}>
          <View style={styles.userImage} />
          <View style={{flex: 1}}>
            <TextByScale>{username}</TextByScale>
            <TextByScale scale="caption" color={colors.text2}>
              {shortAccountId(userId)}
            </TextByScale>
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
        <Item text="My Posts" />
        <View style={styles.separator} />
        <Item text="My Posts" />
        <View style={styles.separator} />
        <Item text="My Posts" />
        <View style={styles.separator} />
        <Item text="My Posts" />
      </View>
      {/* • • • • • */}
      <SafeAreaView edges={['bottom']}>
        <TouchableOpacity style={styles.footer}>
          <TextByScale color={colors.text2}>Log out</TextByScale>
        </TouchableOpacity>
      </SafeAreaView>
      {/* • • • • • */}
    </ScrollView>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
