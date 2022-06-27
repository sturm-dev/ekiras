import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback} from 'react';
import {
  OnboardingStackParamList,
  RootStackParamList,
} from '../navigations/constants';

export const useNavigationReset = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();

  const handleResetNavigation = useCallback(
    (firstParam?: {
      stack?: keyof RootStackParamList;
      screen?: keyof OnboardingStackParamList;
      params?: {};
    }) => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: firstParam?.stack || 'Stack_Onboarding',
            params:
              firstParam?.stack === 'Stack_App'
                ? {}
                : {
                    screen: firstParam?.screen || 'Screen_EnterEmail',
                    params: firstParam?.params,
                  },
          },
        ],
      });
    },
    [navigation],
  );

  return {handleResetNavigation};
};
