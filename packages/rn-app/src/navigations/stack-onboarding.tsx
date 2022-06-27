import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Screen_Register} from '../scenes/onboarding';
import {OnboardingStackParamList} from './constants';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const Stack_Onboarding = (): any => {
  return (
    <Stack.Navigator
      initialRouteName="Screen_Register"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Screen_Register" component={Screen_Register} />
    </Stack.Navigator>
  );
};
