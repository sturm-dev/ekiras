import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback} from 'react';

import {
  AppStackParamList,
  OnboardingStackParamList,
  RootStackParamList,
} from '_navigations';

export const useNavigationReset = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleResetNavigation = useCallback(
    (
      firstParam?:
        | {
            stack: 'Stack_Onboarding';
            screen?: keyof OnboardingStackParamList;
            params?: OnboardingStackParamList[keyof OnboardingStackParamList];
          }
        | {
            stack?: 'Stack_App';
            screen?: keyof AppStackParamList;
            params?: AppStackParamList[keyof AppStackParamList];
          },
    ) => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: firstParam?.stack || 'Stack_Onboarding',
            params: {
              screen: firstParam?.screen || undefined,
              params: firstParam?.params || undefined,
            },
          },
        ],
      });
    },
    [navigation],
  );

  return {handleResetNavigation};
};
