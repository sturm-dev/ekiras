import {Screen_LoadingStart__Params} from '../scenes/loading-start';
import {Screen_Home__Params} from '../scenes/app';
import {Screen_Slides__Params} from '../scenes/onboarding';

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
};
