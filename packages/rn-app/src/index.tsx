import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Container_App as ContainerApp} from './navigations';

export const App = (): any => {
  return (
    <SafeAreaProvider>
      <ContainerApp />
    </SafeAreaProvider>
  );
};
