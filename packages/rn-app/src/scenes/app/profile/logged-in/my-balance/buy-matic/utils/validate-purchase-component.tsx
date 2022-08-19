import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';

import IAP, {
  Product,
  ProductPurchase,
  PurchaseError,
  SubscriptionPurchase,
} from 'react-native-iap';

import {TextByScale} from '_atoms';
import {Button, Overlay} from '_molecules';
import {
  DEVICE_WIDTH,
  MyThemeInterfaceColors,
  secondLog,
  themedStyleSheet,
} from '_utils';

import {CONSUMABLE_ID, TOKEN_NAME} from 'src/config/constants';
import {validatePurchaseIos} from '../utils/validatePurchaseIos';
import {ActivityIndicator, Alert, View} from 'react-native';

interface ValidatePurchaseProps {
  userAddress: string;
  amountOfMaticToBuy: string;
}

export const ValidatePurchase: React.FC<ValidatePurchaseProps> = ({
  userAddress,
  amountOfMaticToBuy,
}: ValidatePurchaseProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [receiveCryptoLoading, setReceiveCryptoLoading] = useState(false);
  const [purchaseModalLoadingVisible, setPurchaseModalLoadingVisible] =
    useState(false);

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validatePurchaseInServer = React.useCallback(
    async (
      receipt: string,
      purchase: ProductPurchase | SubscriptionPurchase,
    ) => {
      setPurchaseLoading(false);
      setReceiveCryptoLoading(true);

      secondLog(`userAddress`, userAddress);
      secondLog(`receipt`, !!receipt);

      try {
        const result = await validatePurchaseIos({
          userAddress: userAddress,
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
    [userAddress],
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
        IAP.getProducts([CONSUMABLE_ID])
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
  }, [userAddress, validatePurchaseInServer, handleIAPPurchaseError]);

  const onRequestPurchase = () => {
    setPurchaseLoading(true);
    setPurchaseModalLoadingVisible(true);
    IAP.requestPurchase(CONSUMABLE_ID);
  };

  // TODO: show modal when making purchase
  // TODO: hide modal when purchase is finished
  // TODO: show friendly loading when "verifying purchase in decentralized server to receive the crypto"
  // TODO: show big message of success when purchase in finished

  return (
    <>
      {!products || !products.length ? <ActivityIndicator /> : null}
      {products.map(product => (
        <Button
          key={product.productId}
          onPress={onRequestPurchase}
          numberOfLines={2}
          style={{height: 80}}>
          <TextByScale>
            <TextByScale>{`Buy `}</TextByScale>
            <TextByScale color={colors.text2}>{`≈ `}</TextByScale>
            <TextByScale
              color={colors.primary}>{`${amountOfMaticToBuy}`}</TextByScale>
            <TextByScale scale="body2">{` ${TOKEN_NAME}`}</TextByScale>
            <TextByScale color={colors.text2}>{` for`}</TextByScale>
            <TextByScale
              color={colors.success}>{` ${product.price}`}</TextByScale>
            <TextByScale scale="body2">{` ${product.currency}`}</TextByScale>
          </TextByScale>
        </Button>
      ))}
      {/* MODAL WHEN VALIDATING PURCHASE ────────────────────────────────────────────────────────────────────────────────  */}
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
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
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

// sandbox test can be very slow - https://youtu.be/4JLHRV2kiCU?t=2442

// https://www.youtube.com/watch?v=4JLHRV2kiCU&ab_channel=EuanMorgan
// https://react-native-iap.dooboolab.com/docs/usage_instructions/restoring_purchases
