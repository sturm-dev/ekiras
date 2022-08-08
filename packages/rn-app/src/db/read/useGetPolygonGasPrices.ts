import {useCallback, useEffect, useState} from 'react';

export const useGetPolygonGasPrices = ({url}: {url: string}) => {
  const [prices, setPrices] = useState<string[] | undefined>();

  const getPrices = useCallback(() => {
    fetch(url)
      .catch(error => console.log(`getPrices error`, error))
      .then(response => response?.json())
      .then(json => {
        const formatter = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        if (json) {
          setPrices([
            formatter.format(json.safeLow.maxFee),
            formatter.format(json.standard.maxFee),
            formatter.format(json.fast.maxFee),
          ]);
        }
      });
  }, [url]);

  useEffect(() => {
    // setInterval(getPrices, 5000);
    getPrices;
  }, [getPrices]);

  return [prices];
};

// TODO: remove cheerio
// TODO: remove this
