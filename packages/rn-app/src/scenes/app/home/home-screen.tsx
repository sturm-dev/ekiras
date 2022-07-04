import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as ethers from 'ethers';

import {CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {AppStackParamList} from '_navigations';
import {
  bttcChain,
  mockData_lorem,
  mockData_userId,
  mockData_username,
  MyThemeInterfaceColors,
  themedStyleSheet,
} from '_utils';

import {PostPreview} from './post-preview-component';

export type Screen_Home__Params = undefined;

// ────────────────────────────────────────────────────────────────────────────────

type itemType = {
  id: number;
  user: {
    userId: string;
    username: string;
  };
  text: string;
};

// ───────────────────────────────────

const listOfItems: itemType[] = [];
[0, 1, 2].forEach((e, i) =>
  listOfItems.push({
    id: i,
    user: {userId: mockData_userId, username: mockData_username},
    text: mockData_lorem,
  }),
);

// ────────────────────────────────────────────────────────────────────────────────

type Screen_Home__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_Home'
>;

export const Screen_Home: React.FC<{
  route: RouteProp<{
    params: Screen_Home__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_Home__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
    // eslint-disable-next-line react-hooks/exhaustive-deps

    connectWithSmartContract();
  }, []);

  // TODO: try https://github.com/rkalis/truffle-plugin-verify
  // TODO: try this
  const connectWithSmartContract = async () => {
    const {rpcUrl, chainId, chainName} = bttcChain;
    const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl, {
      chainId,
      name: chainName,
    });

    await new ethers.Contract(
      '0x2cc65f5649Bf9DC2b5347DeB36B1f50D595CB6A1',
      require('./abi.json'),
      provider,
      // wallet,
    ).posts(0);
  };

  return (
    <ScreenSafeArea colorStatusBar={colors.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextByScale style={{flex: 1, padding: 10}} scale="h3">
            Just Feedback
          </TextByScale>
          <TouchableOpacity
            onPress={() => navigation.navigate('Screen_CreatePost')}
            style={{padding: 10}}>
            <CustomIcon name="add" type="material" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Screen_Profile')}
            style={{padding: 10}}>
            <CustomIcon name="ios-person-sharp" type="ionicon" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={listOfItems}
          renderItem={({
            item: {
              text,
              user: {userId, username},
            },
          }) => <PostPreview user={{id: userId, username}} text={text} />}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingTop: 20, paddingBottom: 50}}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
        />
      </View>
    </ScreenSafeArea>
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
  },
}));
