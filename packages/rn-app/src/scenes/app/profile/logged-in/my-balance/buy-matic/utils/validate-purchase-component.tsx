import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {CONSUMABLE_ID, TOKEN_NAME} from '_db';

import {validatePurchaseIos} from '../utils/validatePurchaseIos';
import AnimatedLottieView from 'lottie-react-native';
import {animation_checkMark, animation_loading} from 'src/assets/animations';
import {POLYGON_EXPLORE_TX_URL} from 'react-native-dotenv';

interface ValidatePurchaseProps {
  userAddress: string;
  amountOfMaticToBuy: string;
  onFinishPurchase: () => void;
}

export const ValidatePurchase: React.FC<ValidatePurchaseProps> = ({
  userAddress,
  amountOfMaticToBuy,
  onFinishPurchase,
}: ValidatePurchaseProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [receiveCryptoLoading, setReceiveCryptoLoading] = useState(false);
  const [purchaseModalLoadingVisible, setPurchaseModalLoadingVisible] =
    useState(false);

  const [purchaseResult, setPurchaseResult] = useState<any>();

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

  const viewTxOnPolygonPress = () => {
    Alert.alert(
      'Redirect to outside link',
      '\n' + 'Do you want to view your TX in polygonscan.com?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () =>
            Linking.openURL(POLYGON_EXPLORE_TX_URL + purchaseResult.txHash),
        },
      ],
    );
  };

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
            {purchaseLoading || receiveCryptoLoading ? (
              <>
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <ActivityIndicator />
                  </View>
                  <View style={styles.textContainer}>
                    {purchaseLoading ? (
                      <TextByScale>
                        Making the purchase on the Apple Servers...
                      </TextByScale>
                    ) : (
                      <>
                        <TextByScale>
                          Validating the purchase on own decentralized
                          servers...
                        </TextByScale>
                        <TextByScale
                          color={colors.text2}
                          scale="body2"
                          style={{marginTop: 3}}>
                          {'(may take approx 30 seconds)'}
                        </TextByScale>
                      </>
                    )}
                  </View>
                </View>
                <View style={styles.animationContainer}>
                  <AnimatedLottieView
                    // https://lottiefiles.com/99627-loading-blocks
                    source={animation_loading}
                    autoPlay
                    loop
                    style={{width: '90%'}}
                  />
                </View>
                <View style={styles.tipContainer}>
                  <TextByScale>{'Blockchain Tip:\n'}</TextByScale>
                  <TextByScale>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </TextByScale>
                </View>
              </>
            ) : (
              <>
                <TextByScale center scale="h2">
                  Purchase completed! 🎉
                </TextByScale>
                <View style={{...styles.animationContainer, marginTop: -10}}>
                  <AnimatedLottieView
                    // https://lottiefiles.com/519-load-complete
                    source={animation_checkMark}
                    autoPlay
                    loop={false}
                    style={{width: '90%'}}
                  />
                </View>

                <View
                  style={{
                    ...styles.row,
                    justifyContent: 'center',
                    paddingBottom: 10,
                  }}>
                  <Button
                    disabled={purchaseLoading || receiveCryptoLoading}
                    text="OK"
                    style={{width: '100%'}}
                    onPress={() => {
                      setPurchaseModalLoadingVisible(false);
                      onFinishPurchase();
                    }}
                  />
                </View>
                <TouchableOpacity onPress={viewTxOnPolygonPress}>
                  <TextByScale center scale="body2" color={colors.text2}>
                    View TX on Polygonscan
                  </TextByScale>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Overlay>
      ) : null}
    </>
  );
};

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
    paddingBottom: 0,
  },
  iconContainer: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  animationContainer: {
    marginTop: -50,
    marginBottom: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContainer: {
    alignSelf: 'center',
    width: DEVICE_WIDTH * 0.8,
    borderRadius: 10,
    backgroundColor: colors.background,
    padding: 30,
  },
}));

// sandbox test can be very slow - https://youtu.be/4JLHRV2kiCU?t=2442

// https://www.youtube.com/watch?v=4JLHRV2kiCU&ab_channel=EuanMorgan
// https://react-native-iap.dooboolab.com/docs/usage_instructions/restoring_purchases
