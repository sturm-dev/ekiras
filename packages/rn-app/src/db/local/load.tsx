import AsyncStorage from '@react-native-community/async-storage';

import {listOfKeys} from './list-of-keys';

export const loadLocalData = async (dataKey: listOfKeys): Promise<string> => {
  try {
    const value = (await AsyncStorage.getItem(dataKey)) || '';
    return value;
  } catch (error) {
    console.log(error);
    return '';
  }
};
