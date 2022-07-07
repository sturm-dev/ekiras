import * as Keychain from 'react-native-keychain';

import {handleSolidityErrors} from './handleSolidityErrors';

export const onLogout = async (): Promise<{
  error?: string;
}> => {
  try {
    await Keychain.resetGenericPassword();
    return {};
  } catch (error) {
    return handleSolidityErrors(error);
  }
};
