import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  Screen_BuyMatic,
  Screen_CreatePost,
  Screen_CreateWallet,
  Screen_Home,
  Screen_ImportWallet,
  Screen_MyBalance,
  Screen_MyPosts,
  Screen_MyPublicAddress,
  Screen_Profile,
  Screen_UpdateUsername,
} from '_scenes';
import {AppStackParamList} from '_navigations';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const Stack_App = (): any => {
  return (
    <Stack.Navigator
      initialRouteName="Screen_Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Screen_Home" component={Screen_Home} />
      <Stack.Screen name="Screen_CreatePost" component={Screen_CreatePost} />
      <Stack.Screen name="Screen_Profile" component={Screen_Profile} />
      <Stack.Screen
        name="Screen_CreateWallet"
        component={Screen_CreateWallet}
      />
      <Stack.Screen
        name="Screen_ImportWallet"
        component={Screen_ImportWallet}
      />
      <Stack.Screen
        name="Screen_UpdateUsername"
        component={Screen_UpdateUsername}
      />
      <Stack.Screen
        name="Screen_MyPublicAddress"
        component={Screen_MyPublicAddress}
      />
      <Stack.Screen name="Screen_MyPosts" component={Screen_MyPosts} />
      <Stack.Screen name="Screen_MyBalance" component={Screen_MyBalance} />
      <Stack.Screen name="Screen_BuyMatic" component={Screen_BuyMatic} />
    </Stack.Navigator>
  );
};
