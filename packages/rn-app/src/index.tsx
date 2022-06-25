import React from 'react';
import {DAppProvider} from '@usedapp/core';

import _App from './App';
import {config} from './dAppProviderConfig';

export const App = (): any => {
  return (
    <DAppProvider config={config}>
      <_App />
    </DAppProvider>
  );
};
