import React from 'react';

import {useGetPolygonGasPrices} from '../read';

const initialValues: {
  gasPrices: string[] | undefined;
} = {
  gasPrices: undefined,
};

export const GasPricesContext = React.createContext(initialValues);

export const GasPricesProvider = ({children}: {children: any}) => {
  const [gasPrices] = useGetPolygonGasPrices({
    url: 'https://gasstation-mainnet.matic.network/v2',
  });

  return (
    <GasPricesContext.Provider value={{gasPrices}}>
      {children}
    </GasPricesContext.Provider>
  );
};
