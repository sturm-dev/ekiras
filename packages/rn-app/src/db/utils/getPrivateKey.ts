import * as Keychain from 'react-native-keychain';
import * as ethers from 'ethers';

export const getPrivateKey = async (): Promise<string> => {
  const credentials = await Keychain.getGenericPassword();
  if (!credentials) {
    console.error('No private key found');
    return '';
  }

  return ethers.Wallet.fromMnemonic(credentials.password).privateKey;
};
