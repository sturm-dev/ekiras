import React, {ReactNode} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  ViewStyle,
  KeyboardAvoidingView,
  ModalProps as RN_ModalProps,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '@react-navigation/native';

import {themedStyleSheet, MyThemeInterfaceColors} from '_utils';

interface OverlayProps extends RN_ModalProps {
  children: ReactNode;
  isVisible: boolean;
  fullScreen?: boolean;
  backdropStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  onBackdropPress?: () => void;
  withKeyboardingAvoidingView?: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({
  children,
  isVisible,
  fullScreen,
  backdropStyle,
  overlayStyle,
  onBackdropPress,
  withKeyboardingAvoidingView,
  ...rest
}: OverlayProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = () => (
    <>
      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.absolute} />
        <BlurView style={styles.absolute} blurType="dark" blurAmount={1} />
        <TouchableWithoutFeedback
          onPress={onBackdropPress}
          testID="RNE__Overlay__backdrop">
          <View
            testID="backdrop"
            style={StyleSheet.flatten([styles.absolute, backdropStyle])}
          />
        </TouchableWithoutFeedback>
        <View
          style={StyleSheet.flatten([
            styles.overlay,
            fullScreen && styles.fullscreen,
            overlayStyle,
          ])}>
          {children}
        </View>
      </View>
    </>
  );

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onBackdropPress}
      transparent
      {...rest}>
      {withKeyboardingAvoidingView ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          {content()}
        </KeyboardAvoidingView>
      ) : (
        content()
      )}
    </Modal>
  );
};

Overlay.defaultProps = {
  fullScreen: false,
  onBackdropPress: undefined,
  backdropStyle: {},
  overlayStyle: {},
  withKeyboardingAvoidingView: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreen: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 10,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(0, 0, 0, .3)',
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 4,
      },
    }),
  },
}));
