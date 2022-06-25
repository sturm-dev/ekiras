import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {App} from './src';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// TODO: check this because are async & in the `useDapp` lib are sync
window = {localStorage: {}};
window.localStorage.setItem = AsyncStorage.setItem;
window.localStorage.removeItem = AsyncStorage.removeItem;
window.localStorage.getItem = AsyncStorage.getItem;

// TODO: check how affect this to the app & try to pass a event dispatcher
document = {};
document.addEventListener = () => {};
