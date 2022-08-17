export const formatToDecimals = (_number: number, decimals = 4) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(_number);
};
