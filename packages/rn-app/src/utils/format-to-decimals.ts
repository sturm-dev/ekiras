export const formatToDecimals = (value: number | string = '', decimals = 4) => {
  return parseFloat(
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(typeof value === 'string' ? parseFloat(value) : value),
  ).toString();
};
