import React from 'react';

import {useGetPolygonGasPrices} from '../read';

const initialValues: {
  gasPrices: number[] | undefined;
} = {
  gasPrices: [0, 0, 0],
};

export const GasPricesContext = React.createContext(initialValues);

export const GasPricesProvider = ({children}: {children: any}) => {
  const [gasPrices] = useGetPolygonGasPrices({
    url: 'https://polygonscan.com/gastracker',
  });

  return (
    <GasPricesContext.Provider value={{gasPrices}}>
      {children}
    </GasPricesContext.Provider>
  );
};
