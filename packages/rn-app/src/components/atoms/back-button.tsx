import React from 'react';
import {ActivityIndicator, Platform, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {themedStyleSheet, MyThemeInterfaceColors} from '_utils';
import {CustomIcon} from './custom-icon';

interface BackButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  loading,
}: BackButtonProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.mainContainer}>
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <CustomIcon
          name={Platform.OS === 'ios' ? 'arrow-back-ios' : 'arrow-back'}
          type="material"
          color={colors.text}
          size={22}
        />
      )}
    </TouchableOpacity>
  );
};

BackButton.defaultProps = {
  loading: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    padding: 15,
    alignItems: 'flex-start',
  },
}));
