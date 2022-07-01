import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {AppStackParamList} from '_navigations';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';

import {PostPreview} from './post-preview-component';

export type Screen_Home__Params = undefined;

// ────────────────────────────────────────────────────────────────────────────────

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.`;

const userId = '0x365aEf443783331c487Eaf8C576A248f15e221c5';
const username = 'Nathan Michael';

// ───────────────────────────────────

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
  listOfItems.push({id: i, user: {userId, username}, text: lorem}),
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
  }, []);

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
