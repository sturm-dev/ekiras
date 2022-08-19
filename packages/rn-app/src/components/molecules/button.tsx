import React, {ReactElement} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  TextStyle,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {CustomIcon, IconType, TextByScale} from '_atoms';
import {
  parseStyle,
  themedStyleSheet,
  MyThemeInterfaceColors,
  fontSizeScales,
  getPercentageInHex,
} from '_utils';

// props with eslint disable are used in the end of file inside of themedStyleSheet
interface ButtonProps {
  onPress: any;
  // ────────────────────────────────────────────────────────────────────────────────
  text?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textScale?: fontSizeScales;
  icon?: string;
  iconType?: IconType;
  loading?: boolean;
  autoWidth?: boolean;
  background?: string;
  color?: string;
  size?: 'xs' | 'small' | 'medium' | 'large';
  children?: ReactElement;
  iconSize?: number;
  locked?: boolean;
  disabled?: boolean;
  numberOfLines?: number;
}

const sizes = {
  xs: {height: 30, fontSize: 'body2'},
  small: {height: 48, fontSize: 'body1'},
  medium: {height: 52, fontSize: 'body1'},
  large: {height: 56, fontSize: 'h6'},
};

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const {
    color,
    onPress,
    style,
    text,
    textScale,
    iconType,
    icon,
    loading,
    children,
    iconSize,
    locked,
    disabled,
    numberOfLines,
  } = props;
  const styles = useStyles(props);

  const _color =
    color ||
    (props.locked || props.disabled
      ? colors.text + getPercentageInHex(30)
      : colors.text);

  const buttonContent = () => {
    const {size} = props;

    if (loading) return <ActivityIndicator size="small" color="white" />;
    else {
      return (
        <>
          {(!!icon || !!locked) && (
            <CustomIcon
              name={icon || 'lock'}
              size={iconSize}
              color={_color}
              type={iconType as IconType}
              style={{marginRight: text ? 5 : 0}}
            />
          )}
          {!!text && (
            <TextByScale
              scale={
                textScale || (sizes[size || 'large'].fontSize as fontSizeScales)
              }
              numberOfLines={numberOfLines || 1}
              style={styles.buttonText}
              color={_color}>
              {text}
            </TextByScale>
          )}
          {children}
        </>
      );
    }
  };

  return Platform.OS === 'ios' ? (
    <TouchableOpacity
      activeOpacity={loading || disabled ? 1 : 0.8}
      onPress={loading || disabled ? undefined : onPress}>
      <View
        style={{
          ...styles.buttonContainer,
          ...(numberOfLines && numberOfLines > 1
            ? {height: 'auto', paddingVertical: 13}
            : {}),
          marginVertical: 8,
          ...(parseStyle(style) as object),
        }}>
        {buttonContent()}
      </View>
    </TouchableOpacity>
  ) : (
    <View style={styles.androidWrapper}>
      <TouchableNativeFeedback
        onPress={loading || disabled ? undefined : onPress}
        background={TouchableNativeFeedback.Ripple('rgba(0,0,0,.08)', false)}>
        <View style={styles.buttonContainer}>{buttonContent()}</View>
      </TouchableNativeFeedback>
    </View>
  );
};

const useStyles = themedStyleSheet(
  (colors: MyThemeInterfaceColors, props: ButtonProps) => ({
    androidWrapper: {
      borderRadius: 50,
      overflow: 'hidden',
      marginVertical: 8,
      ...(parseStyle(props.style) as object),
    },
    buttonContainer: {
      height: sizes[props.size || 'large'].height,
      borderRadius: 50,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      alignSelf: props.autoWidth ? 'auto' : 'center',
      backgroundColor: props.background || colors.button_bg,
      borderColor:
        colors.primary +
        getPercentageInHex(props.locked || props.disabled ? 30 : 100),
      borderWidth: 2,
    },
    buttonText: {
      // fontFamily: DEFAULT_FONT,
      textAlign: 'center',
      marginLeft: props.icon ? 8 : 0,
      ...(parseStyle(props.textStyle) as object),
    },
  }),
);

Button.defaultProps = {
  text: '',
  icon: '',
  iconType: undefined,
  textScale: undefined,
  style: {},
  textStyle: {},
  loading: false,
  background: undefined,
  color: undefined,
  children: undefined,
  autoWidth: true,
  size: 'large',
  iconSize: 18,
  locked: false,
  disabled: false,
};
