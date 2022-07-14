import React from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IAP from 'react-native-iap';

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

  React.useEffect(() => {
    IAP.getProducts([consumableID])
      .then(products => {
        console.log(`products`, JSON.stringify(products, null, 2));
      })
      .catch(err => {
        console.log(err);
      });

    const purchaseUpdateListener = IAP.purchaseUpdatedListener(purchase => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        console.log(`receipt`, JSON.stringify(receipt, null, 2));

        // fetch('backend', {
        //   method: 'POST',
        //   body: JSON.stringify({receipt}),
        // });

        IAP.finishTransaction(purchase);
      }
    });

    return () => {
      purchaseUpdateListener.remove();
    };
  }, []);

  return (
    <ScreenSafeArea>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Button
          text="Buy some crypto for 0.99 usd"
          onPress={() => IAP.requestPurchase(consumableID)}
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
