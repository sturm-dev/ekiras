import * as Keychain from 'react-native-keychain';

export const internalUse_getMnemonic = async (): Promise<string> => {
  const credentials = await Keychain.getGenericPassword();
  if (!credentials) throw new Error('no mnemonic found');

  return credentials.password;
};
