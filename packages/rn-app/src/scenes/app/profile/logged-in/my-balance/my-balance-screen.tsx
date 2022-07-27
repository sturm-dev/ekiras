import React, {useState} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IAP, {Product} from 'react-native-iap';
import {TOKEN_NAME} from 'react-native-dotenv';

import {BackButton, ScreenSafeArea} from '_atoms';
import {Button} from '_molecules';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {validatePurchaseIos} from './validatePurchaseIos';

const consumableID = '0.99_USD';

export type Screen_MyBalance__Params = {
  userAddress: string;
};

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
  // const [purchased, setPurchased] = useState(false);

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
            console.log(`\n\n [1;33m -[0m Get available purchases\n\n`);

            if (!purchases) console.log('no purchases');
            else {
              console.log(`purchases`, JSON.stringify(purchases, null, 2));

              if (purchases.length > 0) {
                const result = await validatePurchaseIos({
                  userAddress: params.userAddress,
                  receipt: purchases[0].transactionReceipt,
                });

                if (result.status === 'ok') {
                  // IAP.finishTransaction(purchase);
                  // setPurchased(true);

                  console.error('SUCCESS! 🎉');
                }
              }
            }
          });
      });

    const purchaseErrorListener = IAP.purchaseErrorListener(err => {
      setLoading(false);
      console.log(`err - purchaseErrorListener`, JSON.stringify(err, null, 2));

      // {
      //   "debugMessage": "The operation couldn’t be completed. (SKErrorDomain error 2.)",
      //   "message": "The operation couldn’t be completed. (SKErrorDomain error 2.)",
      //   "responseCode": "2",
      //   "code": "E_USER_CANCELLED",
      //   "productId": "0.99_USD"
      // }

      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert(
          'Error',
          'Error with your purchase, error code = ' + err.code,
        );
      }
    });

    const purchaseUpdateListener = IAP.purchaseUpdatedListener(
      async purchase => {
        setLoading(false);

        console.log(`\n\n [1;33m -[0m Purchase update listener\n\n`);

        try {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            console.log(`receipt`, JSON.stringify(receipt, null, 2));

            const result = await validatePurchaseIos({
              receipt,
              userAddress: params.userAddress,
            });

            if (result.status === 'ok') {
              console.error('SUCCESS! 🎉');
              // setPurchased(true);

              IAP.finishTransaction(purchase);
            } else if (result.status === 'error') {
              console.error('FAILURE! 💩');
            }
          }
        } catch (err) {
          console.log('purchaseUpdatedListener error', err);
        }
      },
    );

    return () => {
      purchaseUpdateListener.remove();
      purchaseErrorListener.remove();
    };
  }, [params]);

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
            text={`Buy some ${TOKEN_NAME} to interact inside the app for ${product.price} ${product.currency}`}
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
