import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BackButton, ScreenSafeArea} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';

import {estimateTxCosts} from './utils/estimateTxCosts';
import {ValidatePurchase} from './utils/validate-purchase-component';

export type Screen_BuyMatic__Params = {
  userAddress: string;
};

type Screen_BuyMatic__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_BuyMatic'
>;

export const Screen_BuyMatic: React.FC<{
  route: RouteProp<{
    params: Screen_BuyMatic__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_BuyMatic__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getEstimateTxCosts();
  }, []);

  const getEstimateTxCosts = async () => {
    const {estimatedTxCosts, error} = await estimateTxCosts();
    if (error) Alert.alert('Error', error);
    else {
      console.log(
        `estimatedTxCosts`,
        JSON.stringify(estimatedTxCosts, null, 2),
      );
    }
  };

  console.log(`params`, params);

  // "usdPrice": "0.837069",
  // "gasPrices": {
  //   "standard": "39.1",
  //   "fast": "39.6",
  //   "fastWithTip": "40.1"
  // },
  // "estimatedCostsInMatic": {
  //   "saveTxId": "0.00189047",
  //   "sendBalanceToUser": "0.00084210",
  //   "appleFee": "0.12430475",
  //   "serverFee": "0.03811119",
  //   "totalCostOfTx": "0.16514851"
  // },
  // "estimatedMaticToSend": "0.66354980"

  return (
    <ScreenSafeArea>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <ValidatePurchase userAddress={params.userAddress} />
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
