export const getPercentageInHex = (percentage: number): string => {
  if (percentage >= 0 && percentage <= 100) {
    const preHexNumber = (percentage * 255) / 100;
    const hexNumber = preHexNumber
      .toString(16)
      .split('.')[0]
      .padStart(2, '0')
      .replace('f0', 'ff');

    return hexNumber;
  }
  return 'ff';
};
