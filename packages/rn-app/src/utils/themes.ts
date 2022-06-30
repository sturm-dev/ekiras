import {DefaultTheme, DarkTheme} from '@react-navigation/native';

export interface MyThemeInterfaceColors {
  primary: string; // The primary color of the app used to tint various elements. (brand color).
  accent: string; // secondary color for your app which complements the primary color.
  background: string; // The color of various backgrounds, such as background color for the screens.
  background2: string;
  surface: string; // background color for elements containing content, such as cards.
  card: string; // The background color of card-like elements, such as headers, tab bars etc.
  text: string; // The text color of various elements.
  text2: string;
  disabled: string; // color for disabled elements.
  placeholder: string; // color for placeholder text, such as input placeholder.
  backdrop: string; // color for backdrops of various components such as modals.
  border: string; // The color of borders, e.g. header border, tab bar border etc.
  onSurface: string; // background color for snackbars
  notification: string; // The color of Tab Navigator badge.
  // -----------------------------------
  button_bg: string;
  header_bg: string;
  // -----------------------------------
  success: string;
  info: string;
  error: string;
  // -----------------------------------
  bg_green: string;
}

export const MyLightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    // -----------------------------------
    primary: '#df9b36',
    accent: '#222222',
    background: '#fff',
    background2: '#fff',
    surface: '#222222',
    card: '#222222',
    text: '#222222',
    text2: '#888888',
    disabled: '#df9b3670',
    placeholder: '#222222',
    backdrop: '#222222',
    border: '#222222',
    onSurface: '#222222',
    notification: '#222222',
    // -----------------------------------
    button_bg: '#c48525',
    // -----------------------------------
    success: '#2ACA9C',
    info: '#ebb434',
    error: '#e46959',
    // -----------------------------------
    bg_green: '#378a5d',
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    // -----------------------------------
    primary: '#e4fd85',
    accent: '#222222',
    background: '#111111',
    background2: '#1f1f1f',
    surface: '#222222',
    card: '#222222',
    text: '#d9d9d9',
    text2: '#888888',
    disabled: '#df9b3670',
    placeholder: '#BDBEBD',
    backdrop: '#222222',
    border: '#222222',
    onSurface: '#222222',
    notification: '#222222',
    // -----------------------------------
    button_bg: '#c48525',
    // -----------------------------------
    success: '#2ACA9C',
    info: '#ebb434',
    error: '#e46959',
    // -----------------------------------
    bg_green: '#378a5d',
  },
};
