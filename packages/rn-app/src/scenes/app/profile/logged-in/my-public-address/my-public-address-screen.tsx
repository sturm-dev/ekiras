import React, {useState} from 'react';
import {Alert, Linking, TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import {POLYGON_EXPLORE_ADDRESS_URL} from 'react-native-dotenv';

import {BackButton, ScreenSafeArea, TextByScale} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button} from '_molecules';
import {loadLocalData} from '_db';

export type Screen_MyPublicAddress__Params = undefined;

type Screen_MyPublicAddress__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_MyPublicAddress'
>;

export const Screen_MyPublicAddress: React.FC<{
  route: RouteProp<{
    params: Screen_MyPublicAddress__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [myAddress, setMyAddress] = useState('');

  const navigation = useNavigation<Screen_MyPublicAddress__Prop>();
  const {params} = route;

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
  };

  const onPolygonscanPress = () => {
    Alert.alert(
      'Redirect to outside link',
      '\n' + 'Do you want to view your account in polygonscan.com?',
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

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TextByScale scale="h5">My public address:</TextByScale>
        </View>
        <TouchableOpacity
          style={styles.addressContainer}
          onPress={() => {
            Clipboard.setString(myAddress);
            Alert.alert('Public address copied to clipboard!');
          }}>
          <TextByScale numberOfLines={2} scale="h3">
            {myAddress.substring(0, myAddress.length / 2) +
              '\n' +
              myAddress.substring(myAddress.length / 2, myAddress.length)}
          </TextByScale>
        </TouchableOpacity>

        <Button
          text="See account in Polygonscan"
          onPress={onPolygonscanPress}
          style={{
            width: '80%',
            alignSelf: 'center',
            marginTop: 50,
            marginBottom: 100,
          }}
        />
      </View>
    </ScreenSafeArea>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  addressContainer: {
    borderWidth: 2,
    borderColor: colors.border,
    margin: 10,
    marginTop: 5,
    padding: 20,
    borderRadius: 10,
  },
}));
