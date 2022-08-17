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
  Screen_UpdateUsername__Params,
  Screen_MyPublicAddress__Params,
  Screen_MyPosts__Params,
  Screen_MyBalance__Params,
  Screen_BuyMatic__Params,
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
  Screen_UpdateUsername: Screen_UpdateUsername__Params;
  Screen_MyPublicAddress: Screen_MyPublicAddress__Params;
  Screen_MyPosts: Screen_MyPosts__Params;
  Screen_MyBalance: Screen_MyBalance__Params;
  Screen_BuyMatic: Screen_BuyMatic__Params;
};
