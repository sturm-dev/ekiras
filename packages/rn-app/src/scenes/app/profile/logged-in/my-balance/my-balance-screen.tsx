import React, {useState} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IAP, {Product} from 'react-native-iap';
import {
  APP_STORE_SHARED_SECRET,
  IN_APP_PURCHASES_TEST_MODE,
} from 'react-native-dotenv';

import {BackButton, ScreenSafeArea} from '_atoms';
import {Button} from '_molecules';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {tokenName} from '_db';

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

        IAP.getAvailablePurchases()
          .catch(err => console.log('getPurchases error', err))
          .then(async purchases => {
            if (!purchases) console.log('no purchases');
            else {
              console.log(`purchases`, JSON.stringify(purchases, null, 2));

              if (purchases.length > 0)
                validateReceipt(purchases[0].transactionReceipt);
            }
          });
      });

    const purchaseErrorListener = IAP.purchaseErrorListener(err => {
      console.log(`err - purchaseErrorListener`, JSON.stringify(err, null, 2));

      Alert.alert(
        'Error',
        'Error with your purchase, error code = ' + err.code,
      );
    });

    const purchaseUpdateListener = IAP.purchaseUpdatedListener(purchase => {
      setLoading(false);

      try {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          console.log(`receipt`, JSON.stringify(receipt, null, 2));

          validateReceipt(receipt);

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
      purchaseErrorListener.remove();
    };
  }, []);

  const validateReceipt = async (receipt: string) => {
    const receiptBody = {
      'receipt-data': receipt,
      password: APP_STORE_SHARED_SECRET,
    };

    const result = await IAP.validateReceiptIos(
      receiptBody,
      IN_APP_PURCHASES_TEST_MODE,
    )
      .catch(e => console.log('validateReceipt error', e))
      .then(_receipt => {
        try {
          console.log(`_receipt`, JSON.stringify(_receipt, null, 2));
        } catch (e) {
          console.log(`e`, e, typeof e);
        }
      });

    console.log(`result`, result, typeof result);
  };

  const onRequestPurchase = () => {
    setLoading(true);
    IAP.requestPurchase(consumableID);
  };

  console.log(`products`, JSON.stringify(products, null, 2));

  return (
    <ScreenSafeArea>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        {!products || !products.length ? <ActivityIndicator /> : null}
        {products.map(product => (
          <Button
            key={product.productId}
            text={`Buy some ${tokenName} to interact inside the app for ${product.price} ${product.currency}`}
            onPress={onRequestPurchase}
            loading={loading || !products}
            numberOfLines={2}
            style={{height: 80}}
          />
        ))}
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

// https://www.youtube.com/watch?v=4JLHRV2kiCU&ab_channel=EuanMorgan
// https://react-native-iap.dooboolab.com/docs/usage_instructions/restoring_purchases
