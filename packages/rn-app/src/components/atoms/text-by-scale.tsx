import {useTheme} from '@react-navigation/native';
import React, {ReactChild, ReactElement} from 'react';
import {
  StyleProp,
  Text as RN_Text,
  TextProps as RN_TextProps,
  TextStyle,
} from 'react-native';
import {CUSTOM_FONT} from 'src/config/constants';

import {
  MyThemeInterfaceColors,
  parseStyle,
  fontSizeByScale,
  fontSizeScales,
} from '_utils';

export interface TextByScaleProps extends RN_TextProps {
  children: ReactElement | string | number | (string | false | ReactChild)[];
  bold?: boolean;
  underline?: boolean;
  center?: boolean;
  scale?: fontSizeScales;
  style?: StyleProp<TextStyle>;
  color?: string;
}

export const TextByScale: React.FC<TextByScaleProps> = ({
  children,
  scale,
  bold,
  underline,
  style,
  color,
  center,
  ...props
}: TextByScaleProps) => {
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  return (
    <RN_Text
      {...props}
      style={{
        ...(bold ? {fontWeight: 'bold'} : {}),
        ...(underline ? {textDecorationLine: 'underline'} : {}),
        ...(center ? {textAlign: 'center'} : {}),
        fontFamily: CUSTOM_FONT.REGULAR,
        letterSpacing: 0.5,
        fontSize: fontSizeByScale[scale as fontSizeScales],
        color: color || colors.text,
        lineHeight: fontSizeByScale[scale as fontSizeScales] * 1.5,
        ...(parseStyle(style) as object),
      }}>
      {children}
    </RN_Text>
  );
};

TextByScale.defaultProps = {
  style: {},
  bold: false,
  center: false,
  scale: 'body1',
  color: undefined,
  underline: undefined,
};
