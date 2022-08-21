import AsyncStorage from '@react-native-community/async-storage';

import {listOfKeys} from './list-of-keys';

export const saveLocalData = async (dataKey: listOfKeys, value: string) => {
  try {
    await AsyncStorage.setItem(dataKey, value);
  } catch (error) {
    console.log(error);
  }
};
