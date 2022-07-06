import {Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';

export const getMnemonic = async (): Promise<string> => {
  const credentials = await Keychain.getGenericPassword();
  if (!credentials) {
    Alert.alert('Error', 'No mnemonic saved on Keychain');
    return '';
  }

  return credentials.password;
};
