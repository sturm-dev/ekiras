import {Platform} from 'react-native';

export const ACTIVE_MORE_LOGS = true;
export const PAGINATION_SIZE = 10;
export const CUSTOM_FONT = {
  LIGHT: 'TitilliumWeb-Light',
  REGULAR: 'TitilliumWeb-Regular',
  SEMI_BOLD: 'TitilliumWeb-SemiBold',
  BOLD: 'TitilliumWeb-Bold',
};
export const testingOnIPhone = Platform.OS === 'ios' && Platform.isTesting;
