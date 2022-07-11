import * as Keychain from 'react-native-keychain';

import {handleError} from './handleError';

export const onLogout = async (): Promise<{
  error?: string;
}> => {
  try {
    await Keychain.resetGenericPassword();
    return {};
  } catch (error) {
    return handleError(error);
  }
};
