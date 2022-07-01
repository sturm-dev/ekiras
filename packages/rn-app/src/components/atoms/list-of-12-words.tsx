import React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {TextByScale} from '_atoms';
import {themedStyleSheet, MyThemeInterfaceColors} from '_utils';

interface ListOf12WordsProps {
  words: string[];
}

export const ListOf12Words: React.FC<ListOf12WordsProps> = ({
  words,
}: ListOf12WordsProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.column}>
        {words.map((word, i) =>
          i <= 5 ? (
            <View key={i} style={styles.wordContainer}>
              <TextByScale scale="h3">{`${i + 1}. ${word}`}</TextByScale>
            </View>
          ) : null,
        )}
      </View>
      <View style={{width: 15}} />
      <View style={styles.column}>
        {words.map((word, i) =>
          i > 5 ? (
            <View key={i} style={styles.wordContainer}>
              <TextByScale scale="h3">{`${i + 1}. ${word}`}</TextByScale>
            </View>
          ) : null,
        )}
      </View>
    </View>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    padding: 15,
  },
  wordContainer: {},
  column: {flex: 1},
}));
