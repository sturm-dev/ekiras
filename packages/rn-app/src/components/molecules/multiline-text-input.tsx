import React from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {
  getPercentageInHex,
  themedStyleSheet,
  MyThemeInterfaceColors,
  fontSizeByScale,
} from '_utils';

import {TextInput, TextInputProps} from './text-input';

interface MultilineTextInputProps extends TextInputProps {
  inputRef?: any;
}

export const MultilineTextInput: React.FC<MultilineTextInputProps> = ({
  inputRef,
  ...props
}: MultilineTextInputProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  return (
    <View style={styles.inputTextBox}>
      <TextInput
        ref={inputRef}
        multiline
        numberOfLines={10}
        style={{
          height: 100,
          fontSize: fontSizeByScale.body2,
        }}
        withTopPlaceholder={false}
        mainContainerStyle={{
          margin: 0,
          paddingTop: 5,
        }}
        withoutUnderline
        placeholderTextColor={colors.text + getPercentageInHex(40)}
        {...props}
      />
    </View>
  );
};

MultilineTextInput.defaultProps = {
  inputRef: undefined,
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  inputTextBox: {
    borderWidth: 2,
    borderColor: colors.text2,
    borderRadius: 5,
  },
}));
