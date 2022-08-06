import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {persistCache} from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-community/async-storage';

import 'react-native-get-random-values';

import {ContainerApp} from '_navigations';
import {MyDarkTheme} from '_utils';
import {GasPricesProvider} from '_db';

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sturmenta/just-feedback',
  cache,
  defaultOptions: {watchQuery: {fetchPolicy: 'cache-and-network'}},
});

export const App = (): any => {
  const [loadingCache, setLoadingCache] = useState(true);

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []);

  if (loadingCache) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: MyDarkTheme.colors.background,
        }}>
        <ActivityIndicator size="large" color={MyDarkTheme.colors.text} />
      </View>
    );
  }

  return (
    <GasPricesProvider>
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <ContainerApp />
        </SafeAreaProvider>
      </ApolloProvider>
    </GasPricesProvider>
  );
};

// https://thegraph.com/hosted-service/subgraph/sturmenta/just-feedback?selected=playground - test queries
// https://github.com/GraphQLGuide/guide-react-native/blob/a958f89618be7deed24de9fa990b62549d39bcf1/App.js#L28
