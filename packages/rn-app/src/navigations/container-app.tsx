import React from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Stack_App, Stack_Onboarding} from './';
import {MyDarkTheme, MyLightTheme} from '../styles';
import {RootStackParamList} from './constants';
import {Screen_LoadingStart} from '../scenes/loading-start';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Container_App = (): any => {
  const scheme = useColorScheme(); // get from device theme used
  const theme = scheme === 'dark' ? MyDarkTheme : MyLightTheme;

  return (
    <>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Loading_Start"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Loading_Start" component={Screen_LoadingStart} />
          <Stack.Screen name="Stack_Onboarding" component={Stack_Onboarding} />
          <Stack.Screen name="Stack_App" component={Stack_App} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
