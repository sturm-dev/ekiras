import React from 'react';
import {useTheme} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';

import {themedStyleSheet, MyThemeInterfaceColors, DEVICE_WIDTH} from '_utils';
import {animation_loading} from 'src/assets/animations';
import {Overlay} from './overlay';
import {TextByScale} from '../atoms/text-by-scale';

interface LoaderFullScreenProps {}

export const LoaderFullScreen: React.FC<
  LoaderFullScreenProps
> = ({}: LoaderFullScreenProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Overlay
      isVisible
      onBackdropPress={() => null}
      overlayStyle={styles.mainContainer}
      animationType="fade">
      <View style={styles.animationContainer}>
        <LottieView
          source={animation_loading}
          autoPlay
          loop
          style={{width: '90%'}}
        />
      </View>

      <View style={styles.tipContainer}>
        <TextByScale>{'Blockchain Tip:\n'}</TextByScale>
        <TextByScale>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </TextByScale>
      </View>
    </Overlay>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#fff0',
  },
  animationContainer: {
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
