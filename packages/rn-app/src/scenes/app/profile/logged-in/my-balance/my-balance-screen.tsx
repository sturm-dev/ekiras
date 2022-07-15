import React, {useState} from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IAP, {Product} from 'react-native-iap';

import {BackButton, ScreenSafeArea} from '_atoms';
import {Button} from '_molecules';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';

const consumableID = '0.99_USD';

export type Screen_MyBalance__Params = undefined;

type Screen_MyBalance__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_MyBalance'
>;

// TODO: show warning -> sandbox test can be very slow - https://youtu.be/4JLHRV2kiCU?t=2442

export const Screen_MyBalance: React.FC<{
  route: RouteProp<{
    params: Screen_MyBalance__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_MyBalance__Prop>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {params} = route;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchased, setPurchased] = useState(false);

  React.useEffect(() => {
    IAP.initConnection()
      .catch(err => console.log('initConnection error', err))
      .then(() => {
        console.log('initConnection success');

        IAP.getProducts([consumableID])
          .catch(err => console.log('getProducts error', err))
          .then(_products => {
            if (!_products) console.log('no products');
            else setProducts(_products);
          });
      });

    const purchaseUpdateListener = IAP.purchaseUpdatedListener(purchase => {
      setLoading(false);

      try {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          console.log(`receipt`, JSON.stringify(receipt, null, 2));

          // TODO: send the receipt to the server

          // fetch('backend', {
          //   method: 'POST',
          //   body: JSON.stringify({receipt}),
          // });

          // IAP.finishTransaction(purchase);

          setPurchased(true);
        }
      } catch (err) {
        console.log('purchaseUpdatedListener error', err);
      }
    });

    return () => {
      purchaseUpdateListener.remove();
    };
  }, []);

  const onRequestPurchase = () => {
    setLoading(true);
    IAP.requestPurchase(consumableID);
  };

  return (
    <ScreenSafeArea>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Button
          text="Buy some crypto for 0.99 usd"
          onPress={onRequestPurchase}
          loading={loading}
        />
      </View>
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
}));
