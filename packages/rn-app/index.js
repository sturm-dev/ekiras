/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {AppRegistry, ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {persistCache} from 'apollo3-cache-persist';

import {App} from './src';
import {name as appName} from './app.json';
import {MyDarkTheme} from '_utils';

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sturmenta/just-feedback',
  cache,
  defaultOptions: {watchQuery: {fetchPolicy: 'cache-and-network'}},
});

const _App = () => {
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
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

AppRegistry.registerComponent(appName, () => _App);

// https://thegraph.com/hosted-service/subgraph/sturmenta/just-feedback?selected=playground - test queries
// https://github.com/GraphQLGuide/guide-react-native/blob/a958f89618be7deed24de9fa990b62549d39bcf1/App.js#L28
