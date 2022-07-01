import React, {useImperativeHandle} from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  TextStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {CustomIcon, IconType, TextByScale} from '_atoms';
import {isAndroid, fontSizeByScale, MyThemeInterfaceColors} from '_utils';

const InfoIcon = () => (
  <CustomIcon
    name="info"
    type="feather"
    color="gray"
    size={10}
    style={{marginRight: 3}}
  />
);

export interface TextInputProps extends RNTextInputProps {
  value: string;
  onChangeText: (_text: string) => void;
  // ────────────────────────────────────
  placeholder?: string;
  errorText?: string;
  successText?: string;
  tipText?: string;
  passwordInput?: boolean;
  emailInput?: boolean;
  mainContainerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  style?: TextStyle;
  withTopPlaceholder?: boolean;
  leftIcon?: {
    iconName: string;
    iconType: IconType;
  };
  withoutUnderline?: boolean;
  placeholderTextColor?: string;
}

export interface TextInputRef {
  focus(): void;
}

export const TextInput = React.forwardRef<TextInputRef, TextInputProps>(
  (
    {
      value,
      placeholder,
      onChangeText,
      errorText,
      successText,
      tipText,
      passwordInput,
      emailInput,
      mainContainerStyle,
      inputContainerStyle,
      style,
      withTopPlaceholder,
      leftIcon,
      withoutUnderline,
      placeholderTextColor,
      ...props
    }: TextInputProps,
    ref,
  ) => {
    const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

    const textInputRef = React.useRef<RNTextInput>();

    const [focusedInput, setFocusedInput] = React.useState(false);
    const [touched, setTouched] = React.useState(false);
    const [hidePass, setHidePass] = React.useState(true);

    const error = touched && errorText;

    const focus = () => textInputRef.current?.focus();
    useImperativeHandle(ref, () => ({focus})); // https://stackoverflow.com/a/64491870

    return (
      <View style={{...styles.mainContainer, ...mainContainerStyle}}>
        {withTopPlaceholder && placeholder && value ? (
          <TextByScale scale="body2">{placeholder}</TextByScale>
        ) : null}
        <View style={{...styles.inputContainer, ...inputContainerStyle}}>
          {leftIcon ? (
            <View style={{justifyContent: 'center'}}>
              <CustomIcon
                name={leftIcon.iconName}
                type={leftIcon.iconType}
                color={colors.text2}
                size={30}
                style={{marginRight: 10}}
              />
            </View>
          ) : null}
          <RNTextInput
            ref={textInputRef as any}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor || colors.text2}
            style={{
              color: colors.text,
              marginTop: withTopPlaceholder ? 5 : 0,
              // fontFamily: DEFAULT_FONT,
              fontSize: fontSizeByScale.h6,
              flex: 1,
              paddingHorizontal: 0,
              paddingVertical: 8,
              ...style,
            }}
            autoCorrect={false}
            value={value}
            onChangeText={_text => {
              onChangeText && onChangeText(_text);
              setTouched(true);
            }}
            onFocus={() => {
              setFocusedInput(true);
              setTouched(true);
            }}
            onBlur={() => setFocusedInput(false)}
            secureTextEntry={passwordInput && hidePass}
            keyboardType={emailInput ? 'email-address' : 'default'}
            textContentType={
              emailInput ? 'emailAddress' : passwordInput ? 'password' : 'none'
            }
            autoCapitalize={emailInput || passwordInput ? 'none' : 'words'}
            autoComplete={
              emailInput ? 'email' : passwordInput ? 'password' : 'off'
            }
            {...props}
          />
          {passwordInput ? (
            <TouchableOpacity
              style={styles.passwordEyeContainer}
              onPress={() => setHidePass(!hidePass)}>
              <CustomIcon
                type="feather"
                name={hidePass ? 'eye' : 'eye-off'}
                color={colors.text}
                size={20}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {withoutUnderline ? null : (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: error
                ? colors.error
                : focusedInput
                ? colors.text
                : colors.text2,
              marginTop: isAndroid ? -3 : 0,
            }}
          />
        )}
        {errorText ? (
          <View style={styles.errorContainer}>
            <CustomIcon
              name="error-outline"
              type="material"
              color={colors.error}
              size={15}
              style={{marginRight: 3}}
            />
            <TextByScale scale="caption" style={{color: colors.error}}>
              {errorText}
            </TextByScale>
          </View>
        ) : successText ? (
          <View style={styles.errorContainer}>
            <CustomIcon
              name="check"
              type="feather"
              color={colors.success}
              size={10}
              style={{marginRight: 3, marginTop: 2}}
            />
            <TextByScale scale="caption" style={{color: colors.success}}>
              {successText}
            </TextByScale>
          </View>
        ) : focusedInput && tipText ? (
          <View style={styles.errorContainer}>
            <InfoIcon />
            <TextByScale scale="caption" color="gray">
              {tipText}
            </TextByScale>
          </View>
        ) : null}
      </View>
    );
  },
);

TextInput.defaultProps = {
  placeholder: undefined,
  errorText: undefined,
  successText: undefined,
  tipText: undefined,
  passwordInput: false,
  emailInput: false,
  mainContainerStyle: {},
  inputContainerStyle: {},
  style: {},
  withTopPlaceholder: true,
  leftIcon: undefined,
  withoutUnderline: undefined,
  placeholderTextColor: undefined,
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  passwordEyeContainer: {
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});
