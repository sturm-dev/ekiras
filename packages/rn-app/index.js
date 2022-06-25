import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {App} from './src';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
