declare module 'react-native-dotenv' {
  export const MAINNET: 'true' | 'false';
  //
  export const MAINNET__RPC_FULL_URL: string;
  export const TESTNET__RPC_FULL_URL: string;
  //
  export const MAINNET__CONTRACT_ADDRESS: string;
  export const TESTNET__CONTRACT_ADDRESS: string;
  //
  export const TOKEN_NAME: string;
  //
  export const MAINNET__SMALL_INTERACTION_COST_APPROX: string;
  export const TESTNET__SMALL_INTERACTION_COST_APPROX: string;
  //
  export const ONLY_DEV__SEED_1: string;
  export const ONLY_DEV__SEED_2: string;
  export const ONLY_DEV__SEED_3: string;
  export const ONLY_DEV__SEED_4: string;
  //
  export const IN_APP_PURCHASES_TEST_MODE: 'true' | 'false';
  export const APP_STORE_SHARED_SECRET: string;
  //
  export const AKASH_NODE_ENDPOINT: string;
  //
  export const POLYGON_GAS_PRICE_ORACLE_URL: string;
}
