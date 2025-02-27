// import {DefaultTheme, DarkTheme} from '@react-navigation/native';

export interface MyThemeInterfaceColors {
  primary: string; // The primary color of the app used to tint various elements. (brand color).
  accent: string; // secondary color for your app which complements the primary color.
  background: string; // The color of various backgrounds, such as background color for the screens.
  background2: string;
  // surface: string; // background color for elements containing content, such as cards.
  // card: string; // The background color of card-like elements, such as headers, tab bars etc.
  text: string; // The text color of various elements.
  text2: string;
  // disabled: string; // color for disabled elements.
  // placeholder: string; // color for placeholder text, such as input placeholder.
  // backdrop: string; // color for backdrops of various components such as modals.
  // border: string; // The color of borders, e.g. header border, tab bar border etc.
  // onSurface: string; // background color for snackbars
  // notification: string; // The color of Tab Navigator badge.
  // -----------------------------------
  button_bg: string;
  border: string;
  // -----------------------------------
  success: string;
  info: string;
  error: string;
}

const primaryColor = '#7b4add';

export const MyLightTheme: {
  dark: boolean;
  colors: MyThemeInterfaceColors;
} = {
  // ...DefaultTheme,
  dark: false,
  colors: {
    // ...DarkTheme.colors,
    // -----------------------------------
    primary: primaryColor,
    accent: '#1A4D2E',
    background: '#0f1216',
    background2: '#FAF3E3',
    text: '#d9d9d9',
    text2: '#888888',
    // -----------------------------------
    button_bg: '#151a1f',
    border: '#2a3035',
    // -----------------------------------
    success: '#2ACA9C',
    info: '#ebb434',
    error: '#EB5353',
  },
};

export const MyDarkTheme: {
  dark: boolean;
  colors: MyThemeInterfaceColors;
} = {
  // ...DarkTheme,
  dark: true,
  colors: {
    // ...DarkTheme.colors,
    // -----------------------------------
    primary: primaryColor,
    accent: '#1A4D2E',
    background: '#0f1216',
    background2: '#FAF3E3',
    text: '#d9d9d9',
    text2: '#888888',
    // -----------------------------------
    button_bg: '#151a1f',
    border: '#2a3035',
    // -----------------------------------
    success: '#2ACA9C',
    info: '#ebb434',
    error: '#EB5353',
  },
};
