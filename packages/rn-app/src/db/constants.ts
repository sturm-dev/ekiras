export const emptyAddress = '0x0000000000000000000000000000000000000000';
export const listOfErrors = [
  'no mnemonic found',
  // solidity ────────────────────
  'gas required exceeds allowance', // no balance enough
  'post not created yet',
  'the author cannot vote',
  'only one downVote for post',
  'only one upVote for post',
  'username already used',
  'only the author can delete his posts',
  // alchemy ──────────────────────────────
  'Your app has exceeded its compute units per second capacity',
];

export const ESTIMATE_COST_ENDPOINT = '/estimate-tx-costs';
export const VALIDATE_PURCHASE_ENDPOINT = '/validate-purchase-ios';
export const IN_APP_PRODUCT_PRICE = 0.99;
export const CONSUMABLE_ID = '0.99_USD';
export const TOKEN_NAME = 'MATIC';
