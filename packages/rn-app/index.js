import React from 'react';
import {AppRegistry} from 'react-native';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
// import { persistCache } from 'apollo3-cache-persist'

import {App} from './src';
import {name as appName} from './app.json';

const cache = new InMemoryCache();

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sturmenta/just-feedback',
  cache,
  defaultOptions: {watchQuery: {fetchPolicy: 'cache-and-network'}},
});

const _App = () => {
  // const [loadingCache, setLoadingCache] = useState(true)

  // useEffect(() => {
  //   persistCache({
  //     cache,
  //     storage: AsyncStorage,
  //   }).then(() => setLoadingCache(false))
  // }, [])

  // if (loadingCache) {
  //   return <AppLoading />
  // }

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

AppRegistry.registerComponent(appName, () => _App);
