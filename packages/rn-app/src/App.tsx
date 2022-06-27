/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import * as ethers from 'ethers';
import multicallAbi from './multicall.json';
import {bttcChain} from './bttcChain';
import {formatBTT} from './formatBTT';

const Section: React.FC<{
  children: React.ReactNode;
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    tryConnecting();
  }, []);

  // TODO: events https://youtu.be/yk7nVp5HTCk?t=4329

  const tryConnecting = async () => {
    const address1 = '0xbe921007385971d169a4596ECC175A91f8710a56';
    const address2 = '0xDdaCAe39c023cc587eAB8AE4E7183670620BE231';

    const {rpcUrl, chainId, chainName} = bttcChain;
    const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl, {
      chainId,
      name: chainName,
    });

    const privateKey =
      '0x83bad6e68a6c1dddce3e66c4c84e1f26fc3a142e1dedbcb68e7bdcd1db85324c';

    const wallet = new ethers.Wallet(privateKey, provider);

    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log(
      '────────────────────────────────────────────────────────────────────────────────',
    );
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();

    const contractResult = formatBTT(
      await new ethers.Contract(
        '0x365aEf443783331c487Eaf8C576A248f15e221c5',
        multicallAbi,
        provider,
        // wallet,
      ).getEthBalance(address1),
    );

    console.log(`contractResult`, contractResult, typeof contractResult);

    console.log();
    console.log('───────────────────────────────────────');
    console.log();

    const senderBalanceBefore = formatBTT(
      (await provider.getBalance(address1))._hex,
    );
    const receiverBalanceBefore = formatBTT(
      (await provider.getBalance(address2))._hex,
    );

    console.log(
      `senderBalanceBefore`,
      senderBalanceBefore,
      typeof senderBalanceBefore,
    );
    console.log(
      `receiverBalanceBefore`,
      receiverBalanceBefore,
      typeof receiverBalanceBefore,
    );

    const valueToSend = ethers.utils.parseEther('1');
    const valueToSendInBtt = formatBTT(valueToSend._hex);

    console.log(`valueToSendInBtt`, valueToSendInBtt, typeof valueToSendInBtt);

    const tx = await wallet.sendTransaction({to: address2, value: valueToSend});

    await tx.wait();
    console.log(`tx`, JSON.stringify(tx, null, 2));

    const senderBalanceAfter = formatBTT(
      (await provider.getBalance(address1))._hex,
    );
    const receiverBalanceAfter = formatBTT(
      (await provider.getBalance(address2))._hex,
    );

    console.log(
      `senderBalanceAfter`,
      senderBalanceAfter,
      typeof senderBalanceAfter,
    );
    console.log(
      `receiverBalanceAfter`,
      receiverBalanceAfter,
      typeof receiverBalanceAfter,
    );

    const totalCostOfTxInBtt = senderBalanceBefore - senderBalanceAfter;

    console.log(
      `totalCostOfTxInBtt`,
      totalCostOfTxInBtt,
      typeof totalCostOfTxInBtt,
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
