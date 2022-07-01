import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {TextByScale} from '_atoms';
import {themedStyleSheet, MyThemeInterfaceColors} from '_utils';

interface ExampleComponentProps {
  onPress?: () => void;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  onPress,
}: ExampleComponentProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();
  }, []);

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onPress}>
      <TextByScale>ExampleComponent</TextByScale>
    </TouchableOpacity>
  );
};

ExampleComponent.defaultProps = {
  onPress: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'red',
  },
}));
