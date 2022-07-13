import React from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';

import {BackButton, ScreenSafeArea, TextByScale} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';

export type Screen_MyPublicAddress__Params = {
  userAddress: string;
};

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

  const navigation = useNavigation<Screen_MyPublicAddress__Prop>();
  const {params} = route;

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenSafeArea>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <TextByScale
          style={{marginTop: 10, marginLeft: 20, marginBottom: 10}}
          scale="h3">
          My public address:
        </TextByScale>
        <TouchableOpacity
          style={styles.addressContainer}
          onPress={() => {
            Clipboard.setString(params.userAddress);
            Alert.alert('Public address copied to clipboard!');
          }}>
          <TextByScale numberOfLines={2} scale="h3">
            {params.userAddress.substring(0, params.userAddress.length / 2) +
              `\n` +
              params.userAddress.substring(
                params.userAddress.length / 2,
                params.userAddress.length,
              )}
          </TextByScale>
        </TouchableOpacity>
        <TextByScale color={colors.text2} scale="caption" center>
          note: touch to copy on clipboard
        </TextByScale>
      </View>
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: colors.text2,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginVertical: 30,
  },
}));
