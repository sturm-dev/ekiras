import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
// import {APP_STORE_CONNECT_TEST_USER_PASS} from 'react-native-dotenv';

import {BackButton, ScreenSafeArea, TextByScale} from '_atoms';
import {
  formatToDecimals,
  MyThemeInterfaceColors,
  themedStyleSheet,
} from '_utils';
import {AppStackParamList} from '_navigations';
import {
  IN_APP_PRODUCT_PRICE,
  SMALL_INTERACTION_COST_APPROX,
  TOKEN_NAME,
} from '_db';
import {Button} from '_molecules';

import {image_polygon} from 'src/assets/images';
import {testingOnIPhone} from 'src/config/constants';
import {estimateTxCosts} from './utils/estimateTxCosts';
import {ValidatePurchase} from './utils/validate-purchase-component';

export type Screen_BuyMatic__Params = {
  userAddress: string;
};

type Screen_BuyMatic__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_BuyMatic'
>;

type EstimatedResultsType = {
  usdPrice: string;
  gasPrices: {
    standard: string;
    fast: string;
    fastWithTip: string;
  };
  estimatedCostsInMatic: {
    saveTxId: string;
    sendBalanceToUser: string;
    appleFee: string;
    serverFee: string;
    totalCostOfTx: string;
  };
  estimatedMaticToSend: string;
};

export const Screen_BuyMatic: React.FC<{
  route: RouteProp<{
    params: Screen_BuyMatic__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_BuyMatic__Prop>();
  const {params} = route;

  const [loading, setLoading] = useState(true);
  const [estimatedResults, setEstimatedResults] =
    useState<EstimatedResultsType>();

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    getEstimateTxCosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEstimateTxCosts = async () => {
    const {estimatedTxCosts, error} = await estimateTxCosts();

    console.log(`estimatedTxCosts`, JSON.stringify(estimatedTxCosts, null, 2));

    setLoading(false);
    if (error) Alert.alert('Error estimating costs', error);
    else setEstimatedResults(estimatedTxCosts);
  };

  const formatted = (value: string | number = '') => formatToDecimals(value, 4);

  if (loading)
    return (
      <View style={styles.flexContainer}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton onPress={() => navigation.goBack()} />
      {!estimatedResults ? (
        <View style={styles.flexContainer}>
          <TextByScale scale="h0">🤷</TextByScale>
          <TextByScale>Error when try to get estimated costs</TextByScale>
          <Button
            style={{marginTop: 25}}
            text="Go back and try again"
            onPress={() => navigation.goBack()}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <View
              style={{
                ...styles.row,
                marginBottom: 5,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={testingOnIPhone ? 1 : 0.8}
                onPress={
                  testingOnIPhone
                    ? () =>
                        // Clipboard.setString(APP_STORE_CONNECT_TEST_USER_PASS)
                        Clipboard.setString('lqkAND4S9K') // TODO: remove this
                    : () => null
                }>
                <Image
                  source={image_polygon}
                  style={{width: 25, height: 25, marginRight: 5}}
                />
              </TouchableOpacity>
              <TextByScale>
                <TextByScale scale="h5">{`${TOKEN_NAME}`}</TextByScale>
                <TextByScale scale="h4">{` ≈ `}</TextByScale>
                <TextByScale scale="h4" color={colors.success}>{`💵 ${formatted(
                  estimatedResults.usdPrice,
                )}`}</TextByScale>
                <TextByScale scale="h5">{` USD`}</TextByScale>
              </TextByScale>
            </View>
            <View style={styles.feesContainer}>
              {/*  */}
              <TextByScale>
                <TextByScale color={colors.success}>
                  {IN_APP_PRODUCT_PRICE}
                </TextByScale>
                <TextByScale scale="body2">{` USD`}</TextByScale>
                <TextByScale color={colors.text2}>{` ≈ `}</TextByScale>
                <TextByScale color={colors.primary}>
                  {formatted(
                    IN_APP_PRODUCT_PRICE *
                      parseFloat(estimatedResults.usdPrice),
                  )}
                </TextByScale>
                <TextByScale scale="body2">{` ${TOKEN_NAME}`}</TextByScale>
              </TextByScale>
              {/*  */}
              <TextByScale style={{marginTop: 10}}>
                <TextByScale scale="body2" color={colors.text2}>
                  Current gas prices
                </TextByScale>
                <TextByScale scale="caption" color={colors.text2}>
                  {' (50-70 normal)'}
                </TextByScale>
              </TextByScale>
              <View style={styles.lineSpacer} />
              {/*  */}
              <TextByScale>
                <TextByScale color={colors.primary}>
                  {formatted(estimatedResults.gasPrices.standard)}
                </TextByScale>
                <TextByScale scale="body2">{' fast'}</TextByScale>
                <TextByScale color={colors.text2}>{' - '}</TextByScale>
                <TextByScale color={colors.primary}>
                  {formatted(estimatedResults.gasPrices.fast)}
                </TextByScale>
                <TextByScale scale="body2">{' rapid'}</TextByScale>
              </TextByScale>
              {/*  */}
              <TextByScale
                style={{marginTop: 10}}
                scale="body2"
                color={colors.text2}>
                Buy Matic Fees
              </TextByScale>
              <View style={styles.lineSpacer} />
              {/*  */}
              <TextByScale>
                <TextByScale color={colors.primary}>{`${formatted(
                  estimatedResults.estimatedCostsInMatic.appleFee,
                )}`}</TextByScale>
                <TextByScale scale="body2">{` ${TOKEN_NAME} - Apple (15%)`}</TextByScale>
              </TextByScale>
              {/*  */}
              <TextByScale>
                <TextByScale color={colors.primary}>{`${formatted(
                  estimatedResults.estimatedCostsInMatic.serverFee,
                )}`}</TextByScale>
                <TextByScale scale="body2">{` ${TOKEN_NAME} - Server`}</TextByScale>
              </TextByScale>
              {/*  */}
              <TextByScale>
                <TextByScale color={colors.primary}>{`${formatted(
                  parseFloat(
                    estimatedResults.estimatedCostsInMatic.sendBalanceToUser,
                  ) +
                    parseFloat(estimatedResults.estimatedCostsInMatic.saveTxId),
                )}`}</TextByScale>
                <TextByScale scale="body2">{` ${TOKEN_NAME} - Tx gas`}</TextByScale>
              </TextByScale>
              {/*  */}
              <TextByScale
                style={{marginTop: 10}}
                scale="body2"
                color={colors.text2}>
                Total Fee
              </TextByScale>
              <View style={styles.lineSpacer} />
              {/*  */}
              <TextByScale>
                <TextByScale color={colors.primary}>{`${formatted(
                  estimatedResults.estimatedCostsInMatic.totalCostOfTx,
                )}`}</TextByScale>
                <TextByScale scale="body2">{` ${TOKEN_NAME}`}</TextByScale>
                <TextByScale color={colors.text2}>{` ≈ `}</TextByScale>
                <TextByScale color={colors.success}>{`${formatted(
                  parseFloat(
                    estimatedResults.estimatedCostsInMatic.totalCostOfTx,
                  ) / parseFloat(estimatedResults.usdPrice),
                )}`}</TextByScale>
                <TextByScale scale="body2">{` USD`}</TextByScale>
              </TextByScale>
            </View>
            <View style={styles.row}>
              <View style={styles.box}>
                <TextByScale center>Your</TextByScale>
                <TextByScale>
                  <TextByScale
                    color={
                      colors.success
                    }>{`${IN_APP_PRODUCT_PRICE}`}</TextByScale>
                  <TextByScale scale="body2">{` USD`}</TextByScale>
                </TextByScale>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TextByScale scale="h1">≈</TextByScale>
              </View>
              <View style={styles.box}>
                <TextByScale>
                  <TextByScale center color={colors.primary}>{`${formatted(
                    estimatedResults.estimatedMaticToSend,
                  )}`}</TextByScale>
                  <TextByScale
                    center
                    scale="body2">{` ${TOKEN_NAME}`}</TextByScale>
                </TextByScale>
                <TextByScale>
                  <TextByScale center>{`or ≈ `}</TextByScale>
                  <TextByScale center color={colors.info}>{`${parseInt(
                    (
                      parseFloat(estimatedResults.estimatedMaticToSend) /
                      parseFloat(SMALL_INTERACTION_COST_APPROX)
                    ).toString(),
                    10,
                  )}`}</TextByScale>
                  <TextByScale center>{` votes`}</TextByScale>
                </TextByScale>
              </View>
            </View>
          </View>
          <ValidatePurchase
            amountOfMaticToBuy={formatted(
              estimatedResults.estimatedMaticToSend,
            )}
            userAddress={params.userAddress}
            onFinishPurchase={() =>
              navigation.navigate('Screen_MyBalance', {
                updateTime: new Date().getTime(),
              })
            }
          />
        </View>
      )}
    </ScreenSafeArea>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feesContainer: {
    borderWidth: 2,
    borderColor: colors.border,
    margin: 10,
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
  },
  lineSpacer: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
    marginBottom: 5,
  },
  box: {
    borderWidth: 2,
    borderColor: colors.border,
    margin: 10,
    marginTop: 5,
    padding: 20,
    borderRadius: 10,
  },
}));
