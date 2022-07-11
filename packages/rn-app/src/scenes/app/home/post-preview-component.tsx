/* eslint-disable react-hooks/exhaustive-deps */

import React, {useState} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {CustomIcon, TextByScale} from '_atoms';
import {themedStyleSheet, MyThemeInterfaceColors, shortAccountId} from '_utils';
import {getUsername, vote} from '_db';

interface PostPreviewProps {
  id: number;
  userAddress: string;
  text: string;
  votes: {
    up: number;
    down: number;
  };
  refreshPosts: () => void;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  id,
  userAddress,
  text,
  votes,
  refreshPosts,
}: PostPreviewProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [username, setUsername] = useState('');
  const [loadingUsername, setLoadingUsername] = React.useState(true);

  const [loadingUpVote, setLoadingUpVote] = React.useState(false);
  const [loadingDownVote, setLoadingDownVote] = React.useState(false);

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    getAndSetUsername();
  }, []);

  const getAndSetUsername = async () => {
    const {username: _username, error} = await getUsername(userAddress);
    setLoadingUsername(false);

    if (error) Alert.alert('Error', error);
    else setUsername(_username);
  };

  const onVote = async (type: 'up' | 'down') => {
    type === 'up' ? setLoadingUpVote(true) : setLoadingDownVote(true);

    const {error} = await vote(id, type === 'up');
    type === 'up' ? setLoadingUpVote(false) : setLoadingDownVote(false);

    if (error) {
      if (error === 'no mnemonic found') {
        Alert.alert('You need to log-in to interact with the app');
      } else Alert.alert('Error', error);
    } else refreshPosts();
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.userImage} />
        <View>
          {loadingUsername ? (
            <ActivityIndicator size="small" style={{alignSelf: 'flex-start'}} />
          ) : (
            <>
              {username ? <TextByScale>{username}</TextByScale> : null}
              <TextByScale
                scale={username ? 'caption' : 'body1'}
                color={username ? colors.text2 : colors.text}>
                {shortAccountId(userAddress)}
              </TextByScale>
            </>
          )}
        </View>
      </View>
      <View style={styles.body}>
        <TextByScale>{text}</TextByScale>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={
            !(loadingUpVote || loadingDownVote)
              ? () => onVote('up')
              : () => null
          }
          activeOpacity={loadingUpVote || loadingDownVote ? 1 : 0.8}>
          {loadingUpVote ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <CustomIcon name="thumbs-up" type="feather" />
              <TextByScale
                style={{marginLeft: 10}}
                scale="caption"
                color={colors.text2}>
                {`${votes.up}`}
              </TextByScale>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={
            !(loadingUpVote || loadingDownVote)
              ? () => onVote('down')
              : () => null
          }
          activeOpacity={loadingUpVote || loadingDownVote ? 1 : 0.8}>
          {loadingDownVote ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <CustomIcon name="thumbs-down" type="feather" />
              <TextByScale
                style={{marginLeft: 10}}
                scale="caption"
                color={colors.text2}>
                {`${votes.down}`}
              </TextByScale>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#ffffff10',
  },
}));
