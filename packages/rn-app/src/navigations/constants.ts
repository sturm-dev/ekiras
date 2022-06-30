import {
  Screen_Home__Params,
  Screen_LoadingStart__Params,
  Screen_Profile__Params,
  Screen_Slides__Params,
} from '_scenes';

export type RootStackParamList = {
  Loading_Start: Screen_LoadingStart__Params;
  Stack_Onboarding: undefined;
  Stack_App: undefined;
};

export type OnboardingStackParamList = RootStackParamList & {
  Screen_Slides: Screen_Slides__Params;
};

export type AppStackParamList = RootStackParamList & {
  Screen_Home: Screen_Home__Params;
  Screen_Profile: Screen_Profile__Params;
};
