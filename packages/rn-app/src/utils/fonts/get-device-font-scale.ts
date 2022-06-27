import {PixelRatio, Platform} from 'react-native';

type fontScales = -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type iOS_fontScales =
  | '0.823'
  | '0.882'
  | '0.941'
  | '1'
  | '1.118'
  | '1.235'
  | '1.353'
  | '1.786'
  | '2.143'
  | '2.643'
  | '3.143'
  | '3.571';
type iOS_fontScalesMap<T> = {[scale in iOS_fontScales]: T};
const fontScale_iOS: iOS_fontScalesMap<number> = {
  '0.823': -3,
  '0.882': -2,
  '0.941': -1,
  '1': 0,
  '1.118': 1,
  '1.235': 2,
  '1.353': 3,
  '1.786': 4,
  '2.143': 5,
  '2.643': 6,
  '3.143': 7,
  '3.571': 8,
};

type android_fontScales =
  | '0.8500000238418579'
  | '1'
  | '1.149999976158142'
  | '1.2999999523162842';
type android_fontScalesMap<T> = {[scale in android_fontScales]: T};
const fontScale_android: android_fontScalesMap<number> = {
  '0.8500000238418579': -1,
  '1': 0,
  '1.149999976158142': 1,
  '1.2999999523162842': 2,
};

export const getDeviceFontScale = (): fontScales => {
  const fontScaleFromPixelRatio = PixelRatio.getFontScale();

  return Platform.select({
    ios: fontScale_iOS[String(fontScaleFromPixelRatio) as iOS_fontScales],
    android:
      fontScale_android[String(fontScaleFromPixelRatio) as android_fontScales],
    default: 0,
  }) as fontScales;
};
