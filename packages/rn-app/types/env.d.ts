declare module 'react-native-dotenv' {
  export const MAINNET: 'true' | 'false';
  //
  export const MAINNET__RPC_FULL_URL: string;
  export const TESTNET__RPC_FULL_URL: string;
  //
  export const MAINNET__CONTRACT_ADDRESS: string;
  export const TESTNET__CONTRACT_ADDRESS: string;
  //
  export const MAINNET__VOTE_COST_APPROX: string;
  export const TESTNET__VOTE_COST_APPROX: string;
  //
  export const MAINNET__CREATE_POST_COST_APPROX: string;
  export const TESTNET__CREATE_POST_COST_APPROX: string;
  //
  export const ONLY_DEV__SEED_1: string;
  export const ONLY_DEV__SEED_2: string;
  export const ONLY_DEV__SEED_3: string;
  export const ONLY_DEV__SEED_4: string;
  //
  export const IN_APP_PURCHASES_TEST_MODE: 'true' | 'false';
  export const APP_STORE_SHARED_SECRET: string;
  //
  export const DYNAMIC_DATA_CONTRACT_ADDRESS: string;
  //
  export const POLYGON_GAS_PRICE_ORACLE_URL: string;
  export const POLYGON_EXPLORE_TX_URL: string;
  export const POLYGON_EXPLORE_ADDRESS_URL: string;
  //
  export const APP_STORE_CONNECT_TEST_USER_PASS: string;
}
