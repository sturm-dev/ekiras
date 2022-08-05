export const shortAccountId = (accountId: string): string => {
  let _accountId = accountId.toLowerCase();
  const firstPart = _accountId.substring(0, 5);
  const lastPart = _accountId.substring(_accountId.length - 4);
  return `${firstPart}...${lastPart}`;
};
