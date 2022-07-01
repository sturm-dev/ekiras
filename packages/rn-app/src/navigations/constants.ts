import {
  Screen_LoadingStart__Params,
  // ──────────────────────────────────────────────
  Screen_Slides__Params,
  // ──────────────────────────────────────────────
  Screen_Home__Params,
  Screen_CreatePost__Params,
  // ──────────────────────────────────────────────
  Screen_Profile__Params,
  Screen_CreateWallet__Params,
  Screen_ImportWallet__Params,
} from '_scenes';

export type RootStackParamList = {
  Loading_Start: Screen_LoadingStart__Params;
  Stack_Onboarding: undefined;
  Stack_App: undefined;
};

export type OnboardingStackParamList = {
  Screen_Slides: Screen_Slides__Params;
};

export type AppStackParamList = {
  Screen_Home: Screen_Home__Params;
  // ──────────────────────────────────────────────
  Screen_CreatePost: Screen_CreatePost__Params;
  // ──────────────────────────────────────────────
  Screen_Profile: Screen_Profile__Params;
  Screen_CreateWallet: Screen_CreateWallet__Params;
  Screen_ImportWallet: Screen_ImportWallet__Params;
};
