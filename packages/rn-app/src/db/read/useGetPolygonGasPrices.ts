import {useCallback, useEffect, useState} from 'react';
import cheerio from 'cheerio';

export const useGetPolygonGasPrices = ({url}: {url: string}) => {
  const [prices, setPrices] = useState<number[]>();

  const getPrices = useCallback(() => {
    fetch(url)
      .then((response: any) => response.text())
      .then((data: any) => {
        let $ = cheerio.load(data);

        const standard = $('#standardgas').text();
        const fast = $('#fastgas').text();
        const rapid = $('#rapidgas').text();

        const formatPrice = (priceInText: string) =>
          parseFloat(priceInText.replace(/[^0-9.]/g, ''));

        setPrices([
          formatPrice(standard),
          formatPrice(fast),
          formatPrice(rapid),
        ]);
      });
  }, [url]);

  useEffect(() => {
    setInterval(getPrices, 3000);
  }, [getPrices]);

  return [prices];
};
