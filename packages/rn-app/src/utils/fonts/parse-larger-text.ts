import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {getDeviceFontScale} from './get-device-font-scale';

export const parseLargerText = ({
  defaultInPx,
  _4,
  _5,
  _6,
  _7,
  _8,
}: {
  defaultInPx: number;
  _4: number;
  _5: number;
  _6: number;
  _7: number;
  _8: number;
}): number => {
  switch (getDeviceFontScale()) {
    case 4:
      return wp(_4);
    case 5:
      return wp(_5);
    case 6:
      return wp(_6);
    case 7:
      return wp(_7);
    case 8:
      return wp(_8);
    default:
      return defaultInPx;
  }
};
