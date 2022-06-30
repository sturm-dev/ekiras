import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Screen_Home, Screen_Profile} from '_scenes';
import {AppStackParamList} from '_navigations';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const Stack_App = (): any => {
  return (
    <Stack.Navigator
      initialRouteName="Screen_Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Screen_Home" component={Screen_Home} />
      <Stack.Screen name="Screen_Profile" component={Screen_Profile} />
    </Stack.Navigator>
  );
};
