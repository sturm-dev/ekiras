import React from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {MyDarkTheme, MyLightTheme} from '_utils';
import {Screen_LoadingStart} from '_scenes';
import {Stack_Onboarding, Stack_App, RootStackParamList} from '_navigations';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ContainerApp = (): any => {
  const scheme = useColorScheme(); // get from device theme used
  const theme = scheme === 'dark' ? MyDarkTheme : MyLightTheme;

  return (
    <>
      <NavigationContainer theme={theme as any}>
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
