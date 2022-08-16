import React, {useState} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IAP, {
  Product,
  ProductPurchase,
  PurchaseError,
  SubscriptionPurchase,
} from 'react-native-iap';
import {TOKEN_NAME} from 'react-native-dotenv';

import {BackButton, ScreenSafeArea, TextByScale} from '_atoms';
import {Button, Overlay} from '_molecules';
import {
  DEVICE_WIDTH,
  MyThemeInterfaceColors,
  secondLog,
  themedStyleSheet,
} from '_utils';
import {AppStackParamList} from '_navigations';
import {validatePurchaseIos} from './validatePurchaseIos';
import Clipboard from '@react-native-clipboard/clipboard';

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
  const {params} = route;

  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [receiveCryptoLoading, setReceiveCryptoLoading] = useState(false);
  const [purchaseModalLoadingVisible, setPurchaseModalLoadingVisible] =
    useState(false);

  const validatePurchaseInServer = React.useCallback(
    async (
      receipt: string,
      purchase: ProductPurchase | SubscriptionPurchase,
    ) => {
      setPurchaseLoading(false);
      setReceiveCryptoLoading(true);

      secondLog(`params.userAddress`, params.userAddress);
      secondLog(`receipt`, !!receipt);

      try {
        const result = await validatePurchaseIos({
          userAddress: params.userAddress,
          receipt,
        });

        secondLog(`result`, result);

        if (result.status === 'ok') {
          IAP.finishTransaction(purchase);
          // TODO: integrate animations and show animation of success when purchase is finished
        } else {
          setPurchaseModalLoadingVisible(false);
          Alert.alert('Error', 'Purchase failed');
          // TODO: show toast with error

          if (result.status === 'error') {
            console.error('FAILURE! 💩');
          } else {
            throw new Error(`Unknown status: ${result.status}`);
          }
        }
      } catch (e) {
        console.log('validatePurchaseInServer error', e);
      }

      setReceiveCryptoLoading(false);
    },
    [params.userAddress],
  );

  const handleIAPPurchaseError = React.useCallback((err: PurchaseError) => {
    setPurchaseLoading(false);
    setPurchaseModalLoadingVisible(false);

    console.log(`err - purchaseErrorListener`, JSON.stringify(err, null, 2));

    if (err.code !== 'E_USER_CANCELLED') {
      Alert.alert(
        'Error',
        'Error with your purchase, error code = ' + err.code,
      );
    }
  }, []);

  React.useEffect(() => {
    IAP.initConnection()
      .catch(err => console.log('initConnection error', err))
      .then(() => {
        IAP.getProducts([consumableID])
          .catch(err => console.log('getProducts error', err))
          .then(_products => {
            if (!_products) console.log('no products');
            else setProducts(_products);
          });

        IAP.getAvailablePurchases()
          .catch(err => console.log('getPurchases error', err))
          .then(async purchases => {
            if (!purchases || purchases.length === 0)
              console.log('no purchases');
            else
              validatePurchaseInServer(
                purchases[0].transactionReceipt,
                purchases[0],
              );
          });
      });

    const purchaseErrorListener = IAP.purchaseErrorListener(
      handleIAPPurchaseError,
    );

    const purchaseUpdateListener = IAP.purchaseUpdatedListener(
      async purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) validatePurchaseInServer(receipt, purchase);
      },
    );

    return () => {
      purchaseUpdateListener.remove();
      purchaseErrorListener.remove();
    };
  }, [params.userAddress, validatePurchaseInServer, handleIAPPurchaseError]);

  const onRequestPurchase = () => {
    setPurchaseLoading(true);
    setPurchaseModalLoadingVisible(true);
    IAP.requestPurchase(consumableID);
  };

  // TODO: show modal when making purchase
  // TODO: hide modal when purchase is finished
  // TODO: show friendly loading when "verifying purchase in decentralized server to receive the crypto"
  // TODO: show big message of success when purchase in finished

  return (
    <ScreenSafeArea>
      <BackButton
        onPress={purchaseLoading ? () => null : () => navigation.goBack()}
      />
      <View style={styles.container}>
        {!products || !products.length ? <ActivityIndicator /> : null}
        {products.map(product => (
          <>
            {/* TODO: create condition to show this if dev */}
            <Button
              text="Copy test user pass (only work in iPhone connected with xcode)"
              onPress={() => {
                Clipboard.setString('lqkAND4S9K');
                Alert.alert('Pass copied to clipboard!');
              }}
              numberOfLines={2}
            />
            <Button
              key={product.productId}
              text={`Buy some ${TOKEN_NAME} for ${product.price} ${product.currency}`}
              onPress={onRequestPurchase}
              numberOfLines={2}
              style={{height: 80}}
            />
          </>
        ))}
      </View>
      {purchaseModalLoadingVisible ? (
        <Overlay isVisible overlayStyle={styles.modal} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                {purchaseLoading ? (
                  <ActivityIndicator />
                ) : (
                  <TextByScale>✅</TextByScale>
                )}
              </View>
              <View style={styles.textContainer}>
                {purchaseLoading ? (
                  <TextByScale>
                    Making the purchase on the Apple Servers...
                  </TextByScale>
                ) : (
                  <TextByScale>
                    Purchase on the Apple servers complete!
                  </TextByScale>
                )}
              </View>
            </View>
            {!purchaseLoading ? (
              <View style={styles.row}>
                <View style={styles.iconContainer}>
                  {receiveCryptoLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <TextByScale>✅</TextByScale>
                  )}
                </View>
                <View style={styles.textContainer}>
                  {receiveCryptoLoading ? (
                    <TextByScale>
                      Validating the Apple purchase on own decentralized
                      servers...
                    </TextByScale>
                  ) : (
                    <TextByScale>
                      {`Apple purchase validated & ${TOKEN_NAME} sended to the user! 🎉`}
                    </TextByScale>
                  )}
                </View>
              </View>
            ) : null}
            {!purchaseLoading && !receiveCryptoLoading ? (
              <View style={{...styles.row, justifyContent: 'center'}}>
                <Button
                  disabled={purchaseLoading || receiveCryptoLoading}
                  text="OK"
                  onPress={() => setPurchaseModalLoadingVisible(false)}
                />
              </View>
            ) : null}
          </View>
        </Overlay>
      ) : null}
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  modal: {
    flex: 1,
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#fff0',
  },
  modalContainer: {
    flex: 1,
    width: DEVICE_WIDTH,
    padding: 20,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: 20,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
}));

// https://www.youtube.com/watch?v=4JLHRV2kiCU&ab_channel=EuanMorgan
// https://react-native-iap.dooboolab.com/docs/usage_instructions/restoring_purchases
