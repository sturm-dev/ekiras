import React from 'react';
import {Alert, Image, Linking, TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import {POLYGON_EXPLORE_ADDRESS_URL} from 'react-native-dotenv';

import {BackButton, CustomIcon, ScreenSafeArea, TextByScale} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button} from '_molecules';
import {SMALL_INTERACTION_COST_APPROX} from '_db';

import {animation_currency} from 'src/assets/animations';
import {image_coin, image_polygon} from 'src/assets/images';
import {TOKEN_NAME} from 'src/config/constants';

export type Screen_MyBalance__Params = {
  userAddress: string;
  balance: string;
};

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
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const navigation = useNavigation<Screen_MyBalance__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPolygonBalancePress = () => {
    Alert.alert(
      'Redirect to outside link',
      '\n' + 'Do you want to view your account balance in polygonscan.com?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () =>
            Linking.openURL(POLYGON_EXPLORE_ADDRESS_URL + params.userAddress),
        },
      ],
    );
  };

  const showMoreInfoAboutApproxAmountOfVotes = () => {
    Alert.alert(
      'Approx costs',
      '\n' +
        '- One vote costs approx: ' +
        parseFloat(SMALL_INTERACTION_COST_APPROX) +
        ' ' +
        TOKEN_NAME +
        '\n\n' +
        '- The creation of one post costs approx: ' +
        parseFloat(SMALL_INTERACTION_COST_APPROX) * 100 +
        ' ' +
        TOKEN_NAME +
        '\n',
      [{text: 'OK'}],
    );
  };

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TextByScale scale="h5">My Balance:</TextByScale>
        </View>
        <View style={styles.myBalance}>
          <View style={styles.row}>
            <Image source={image_coin} style={{width: 40, height: 40}} />
            <TextByScale style={{marginLeft: 5, textAlign: 'right'}} scale="h5">
              {`≈ ${
                parseFloat(params.balance) /
                parseFloat(SMALL_INTERACTION_COST_APPROX)
              } votes`}
            </TextByScale>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={showMoreInfoAboutApproxAmountOfVotes}>
              <CustomIcon
                color={colors.text2}
                name="info"
                type="simple-line-icon"
                size={20}
              />
            </TouchableOpacity>
          </View>
          <View style={{height: 15}} />
          <TouchableOpacity style={styles.row} onPress={onPolygonBalancePress}>
            <Image source={image_polygon} style={{width: 40, height: 40}} />
            <TextByScale
              style={{
                marginLeft: 10,
                textAlign: 'right',
              }}>
              <TextByScale scale="h5">{params.balance}</TextByScale>
              <TextByScale scale="h5">{` ${TOKEN_NAME}`}</TextByScale>
            </TextByScale>
          </TouchableOpacity>
        </View>

        <View style={styles.animationContainer}>
          <LottieView
            // https://assets8.lottiefiles.com/packages/lf20_ikaawl5v.json
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
              userAddress: params.userAddress,
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
    padding: 20,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoModalButton: {
    marginLeft: 8,
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
