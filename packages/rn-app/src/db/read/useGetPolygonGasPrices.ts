import {useCallback, useEffect, useState} from 'react';
// import cheerio from 'cheerio';

export const useGetPolygonGasPrices = ({url}: {url: string}) => {
  const [prices, setPrices] = useState<number[]>();

  const getPrices = useCallback(() => {
    fetch(url)
      .then((response: any) => response.text())
      .then((data: any) => {
        setPrices([1, 2, 3]);

        console.log(`data`, data);
      });
  }, [url]);

  useEffect(() => {
    getPrices();
  }, [getPrices]);

  return [prices];
};
