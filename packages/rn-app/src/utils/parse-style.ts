import {StyleProp, TextStyle, ViewStyle} from 'react-native';

// this fixes that style can be [] or {}
export const parseStyle = (
  style: StyleProp<TextStyle> | StyleProp<ViewStyle>,
): object => {
  let styleParsed = {};
  if (Array.isArray(style)) {
    style.forEach(s => Object.assign(styleParsed, s));
  } else styleParsed = style as object;

  return styleParsed;
};
