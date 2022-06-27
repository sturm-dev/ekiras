import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {MyThemeInterfaceColors} from '../styles';

export const themedStyleSheet =
  <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>, V>(
    styles: T | ((colors: MyThemeInterfaceColors, props: V) => T),
  ) =>
  (props: V = {} as any): T => {
    const colors = useTheme().colors as MyThemeInterfaceColors;
    const css = typeof styles === 'function' ? styles(colors, props) : styles;

    return StyleSheet.create(css);
  };
