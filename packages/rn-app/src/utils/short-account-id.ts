export const shortAccountId = (accountId: string): string => {
  const firstPart = accountId.substring(0, 5);
  const lastPart = accountId.substring(accountId.length - 4);
  return `${firstPart}...${lastPart}`;
};
