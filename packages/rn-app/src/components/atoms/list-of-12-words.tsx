import React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {TextByScale} from '_atoms';
import {themedStyleSheet, MyThemeInterfaceColors} from '_utils';

interface ListOf12WordsProps {
  words: string[];
  grayWords?: boolean;
}

export const ListOf12Words: React.FC<ListOf12WordsProps> = ({
  words,
  grayWords,
}: ListOf12WordsProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.column}>
        {words.map((word, i) =>
          i <= 5 ? (
            <View key={i} style={styles.wordContainer}>
              <TextByScale
                scale="h4"
                color={grayWords ? colors.text2 : colors.text}>{`${
                i + 1
              }. ${word.toLowerCase()}`}</TextByScale>
            </View>
          ) : null,
        )}
      </View>
      <View style={{width: 10}} />
      <View style={styles.column}>
        {words.map((word, i) =>
          i > 5 ? (
            <View key={i} style={styles.wordContainer}>
              <TextByScale
                scale="h4"
                color={grayWords ? colors.text2 : colors.text}>{`${
                i + 1
              }. ${word.toLowerCase()}`}</TextByScale>
            </View>
          ) : null,
        )}
      </View>
    </View>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    padding: 10,
  },
  wordContainer: {},
  column: {flex: 1},
}));
