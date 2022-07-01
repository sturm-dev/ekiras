import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {CustomIcon, TextByScale} from '_atoms';
import {themedStyleSheet, MyThemeInterfaceColors, shortAccountId} from '_utils';

interface PostPreviewProps {
  user: {
    id: string;
    username: string;
  };
  text: string;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  user,
  text,
}: PostPreviewProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.userImage} />
        <View>
          <TextByScale>{user.username}</TextByScale>
          <TextByScale scale="caption">{shortAccountId(user.id)}</TextByScale>
        </View>
      </View>
      <View style={styles.body}>
        <TextByScale>{text}</TextByScale>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <CustomIcon name="thumbs-up" type="feather" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <CustomIcon name="thumbs-down" type="feather" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

PostPreview.defaultProps = {
  user: undefined,
  text: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.text2,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: 'violet',
    marginRight: 10,
  },
  body: {
    padding: 10,
  },
  footer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#ffffff10',
  },
}));
