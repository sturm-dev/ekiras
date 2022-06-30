import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ContainerApp} from '_navigations';

export const App = (): any => {
  return (
    <SafeAreaProvider>
      <ContainerApp />
    </SafeAreaProvider>
  );
};
