import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {OnboardingStackParamList} from '_navigations';
import {Screen_Slides} from '_scenes';

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
