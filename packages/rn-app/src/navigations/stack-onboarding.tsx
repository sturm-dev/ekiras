import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Screen_Slides} from '../scenes/onboarding';
import {OnboardingStackParamList} from './constants';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const Stack_Onboarding = (): any => {
  return (
    <Stack.Navigator
      initialRouteName="Screen_Slides"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Screen_Slides" component={Screen_Slides} />
    </Stack.Navigator>
  );
};
