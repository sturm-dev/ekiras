import {useCallback, useEffect, useState} from 'react';
import cheerio from 'cheerio';

export const useGetPolygonGasPrices = ({url}: {url: string}) => {
  const [prices, setPrices] = useState<number[] | undefined>();

  const getPrices = useCallback(() => {
    fetch(url)
      .catch(error => console.log(`getPrices scrapper error`, error))
      .then((response: any) => response.text())
      .then((data: any) => {
        let $ = cheerio.load(data);

        const standard = $('#standardgas').text();
        const fast = $('#fastgas').text();
        const rapid = $('#rapidgas').text();

        const formatPrice = (priceInText: string) =>
          parseFloat(priceInText.replace(/[^0-9.]/g, ''));

        if (standard && fast && rapid) {
          setPrices([
            formatPrice(standard),
            formatPrice(fast),
            formatPrice(rapid),
          ]);
        } else setPrices(undefined);
      });
  }, [url]);

  useEffect(() => {
    getPrices();
    // setInterval(getPrices, 3000);
  }, [getPrices]);

  return [prices];
};

// TODO: this logic not more working - web block after a while getting the prices
