import React, {useEffect, useState} from 'react';
import {Alert, Image, Linking, TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import {POLYGON_EXPLORE_ADDRESS_URL} from 'react-native-dotenv';

import {BackButton, CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {
  formatToDecimals,
  MyThemeInterfaceColors,
  themedStyleSheet,
} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button} from '_molecules';
import {
  getBalance,
  VOTE_COST_APPROX,
  TOKEN_NAME,
  CREATE_POST_COST_APPROX,
} from '_db';

import {animation_currency} from 'src/assets/animations';
import {image_polygon} from 'src/assets/images';
import {loadLocalData} from 'src/db/local';

export type Screen_MyBalance__Params =
  | {
      updateTime?: number;
    }
  | undefined;

type Screen_MyBalance__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_MyBalance'
>;

export const Screen_MyBalance: React.FC<{
  route: RouteProp<{
    params?: Screen_MyBalance__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_MyBalance__Prop>();
  const {params} = route;

  const [myAddress, setMyAddress] = useState('');
  const [myBalance, setMyBalance] = useState('');
  const [myUpdatedBalance, setMyUpdatedBalance] = useState('');

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    getLocalData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocalData = async () => {
    const _myAddress = await loadLocalData('myAddress');
    setMyAddress(_myAddress);
    const _myBalance = await loadLocalData('myBalance');
    setMyBalance(_myBalance);
  };

  // ────────────────────────────────────────────────────────────────────────────────
  const [oldUpdateTime, setOldUpdateTime] = useState(0);
  // do refresh when go back to this screen and updateTime is changed
  useEffect(() => {
    if (params?.updateTime && params.updateTime !== oldUpdateTime) {
      setOldUpdateTime(params?.updateTime);

      // The refresh logic ─────────────────────────────────────────────────────────────────
      refetchUserBalance(myAddress);
      // The refresh logic ─────────────────────────────────────────────────────────────────
    }
  }, [params?.updateTime, oldUpdateTime, myAddress]);
  // ────────────────────────────────────────────────────────────────────────────────

  const refetchUserBalance = async (userAddress: string) => {
    if (userAddress) {
      const {balance, error} = await getBalance(userAddress);

      if (error) Alert.alert('Error getting user balance', error);
      else setMyUpdatedBalance(balance);
    }
  };

  const onPolygonBalancePress = () => {
    Alert.alert(
      'Redirect to outside link',
      '\n' + 'Do you want to view your account balance in polygonscan.com?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () =>
            Linking.openURL(POLYGON_EXPLORE_ADDRESS_URL + myAddress),
        },
      ],
    );
  };

  const showMoreInfoAboutApproxAmountOfVotes = () => {
    Alert.alert(
      'Approx costs',
      '\n' +
        '- One vote costs approx: ' +
        parseFloat(VOTE_COST_APPROX) +
        ' ' +
        TOKEN_NAME +
        '\n\n' +
        '- The creation of one post costs approx: ' +
        parseFloat(CREATE_POST_COST_APPROX) +
        ' ' +
        TOKEN_NAME +
        '\n',
      [{text: 'OK'}],
    );
  };

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton
        onPress={() =>
          navigation.navigate('Screen_Profile', {
            updateTime: new Date().getTime(),
          })
        }
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TextByScale scale="h5">My Balance:</TextByScale>
        </View>
        <View style={styles.myBalance}>
          <TouchableOpacity style={styles.row} onPress={onPolygonBalancePress}>
            <Image source={image_polygon} style={{width: 40, height: 40}} />
            <TextByScale style={{marginLeft: 10}}>
              <TextByScale scale="h6">
                {myUpdatedBalance || myBalance}
              </TextByScale>
              <TextByScale scale="body1">{` ${TOKEN_NAME}`}</TextByScale>
            </TextByScale>
          </TouchableOpacity>
          <View style={{height: 15}} />
          <View style={styles.row}>
            <TextByScale style={{marginHorizontal: 8}} scale="body1">
              {'≈'}
            </TextByScale>
          </View>
          <TouchableOpacity
            style={styles.row}
            onPress={showMoreInfoAboutApproxAmountOfVotes}>
            <TextByScale scale="h6">
              {`${formatToDecimals(
                parseFloat(myUpdatedBalance || myBalance) /
                  parseFloat(VOTE_COST_APPROX),
                2,
              )} votes`}
            </TextByScale>
            <View style={styles.infoModalButton}>
              <CustomIcon
                color={colors.text2}
                name="info"
                type="simple-line-icon"
                size={15}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.animationContainer}>
          <LottieView
            // https://lottiefiles.com/69760-currency
            source={animation_currency}
            autoPlay
            loop
            style={{width: '80%'}}
          />
        </View>

        <Button
          text={`Buy ${TOKEN_NAME} →`}
          onPress={() =>
            navigation.navigate('Screen_BuyMatic', {
              userAddress: myAddress,
            })
          }
          style={{width: '80%', alignSelf: 'center'}}
        />
      </View>
    </ScreenSafeArea>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  myBalance: {
    borderWidth: 2,
    borderColor: colors.border,
    margin: 10,
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoModalButton: {
    marginLeft: 5,
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
