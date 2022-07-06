const values = {
  K: 1000,
  M: 1000000,
  B: 1000000000,
};

export const formatBigNumber = (numberToFormat: number): string => {
  let numberParsed;

  Object.keys(values).forEach(_letter => {
    const letter = _letter as keyof typeof values;
    const value: number = values[letter];

    if (numberToFormat / value < 999 && numberToFormat / value > 1)
      numberParsed = `${
        Math.round((numberToFormat / value) * 100) / 100
      } ${letter}`;
  });

  return numberParsed || (Math.round(numberToFormat * 100) / 100).toString();
};
