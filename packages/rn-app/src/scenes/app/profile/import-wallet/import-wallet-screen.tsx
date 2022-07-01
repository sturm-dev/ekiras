import React, {useState} from 'react';
import {View} from 'react-native';
import {useNavigation, RouteProp, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  BackButton,
  CustomKeyboardAvoidingView,
  ListOf12Words,
  ScreenSafeArea,
  TextByScale,
} from '_atoms';
import {MyThemeInterfaceColors, themedStyleSheet} from '_utils';
import {AppStackParamList} from '_navigations';
import {Button, TextInput} from '_molecules';
import {useNavigationReset} from '_hooks';

export type Screen_ImportWallet__Params = undefined;

type Screen_ImportWallet__Prop = NativeStackNavigationProp<
  AppStackParamList,
  'Screen_ImportWallet'
>;

export const Screen_ImportWallet: React.FC<{
  route: RouteProp<{
    params: Screen_ImportWallet__Params;
  }>;
}> = ({route}) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [words, setWords] = useState<string[]>([]);
  const [word, setWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);

  const navigation = useNavigation<Screen_ImportWallet__Prop>();
  const {params} = route;

  const {handleResetNavigation} = useNavigationReset();

  React.useEffect(() => {
    // delete all this console.log - is for not showing error of unused vars
    if (!colors) console.log();
    if (!navigation) console.log();
    if (!params) console.log();
  }, []);

  return (
    <ScreenSafeArea withBottomEdgeToo>
      <BackButton
        onPress={
          wordIndex === 12
            ? () => {
                setWord(words[wordIndex - 1]);
                setWordIndex(wordIndex - 1);
              }
            : () => navigation.goBack()
        }
      />
      <CustomKeyboardAvoidingView>
        {wordIndex === 12 ? (
          <View style={styles.finishContainer}>
            <TextByScale scale="h3" center style={{marginBottom: 20}}>
              The 12 words of your existing wallet:
            </TextByScale>
            <ListOf12Words words={words} grayWords />
            <Button
              text="Import wallet"
              style={{marginTop: 30}}
              onPress={() =>
                handleResetNavigation({
                  stack: 'Stack_App',
                  screen: 'Screen_Home',
                })
              }
            />
          </View>
        ) : (
          <View style={styles.container}>
            <TextInput
              placeholder={`${wordIndex + 1}º word`}
              value={word}
              onChangeText={newWord => setWord(newWord.toLowerCase())}
            />
            <View style={styles.buttonsContainer}>
              {words.length > 0 ? (
                <Button
                  onPress={() => {
                    setWord(words[wordIndex - 1]);
                    setWordIndex(wordIndex - 1);
                  }}
                  icon="arrow-back-ios"
                  iconType="material"
                  autoWidth={false}
                  style={{
                    width: 60,
                    height: 60,
                    marginTop: 40,
                    marginRight: 15,
                  }}
                  disabled={wordIndex === 0}
                />
              ) : null}
              <Button
                onPress={() => {
                  if (wordIndex === words.length) {
                    const newWords = [...words, word];
                    setWords(newWords);
                    setWord('');
                  } else {
                    const newWords = [...words];
                    newWords[wordIndex] = word;
                    setWords(newWords);

                    setWord(words[wordIndex + 1]);
                  }
                  setWordIndex(wordIndex + 1);
                }}
                icon="arrow-forward-ios"
                iconType="material"
                autoWidth={false}
                style={{width: 60, height: 60, marginTop: 40}}
                disabled={
                  !word ||
                  word.includes(' ') ||
                  word.length < 4 ||
                  word.length > 9
                }
              />
            </View>
          </View>
        )}
      </CustomKeyboardAvoidingView>
    </ScreenSafeArea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  finishContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
}));
