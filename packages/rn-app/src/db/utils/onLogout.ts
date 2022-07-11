import * as Keychain from 'react-native-keychain';

import {resetContractWithSigner} from './contract';
import {handleError} from './handleError';

export const onLogout = async (): Promise<{
  error?: string;
}> => {
  try {
    await Keychain.resetGenericPassword();
    resetContractWithSigner();
    return {};
  } catch (error) {
    return handleError(error);
  }
};
