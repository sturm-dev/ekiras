/* eslint-disable react-hooks/exhaustive-deps */

import React, {useState} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {CustomIcon, TextByScale} from '_atoms';
import {
  themedStyleSheet,
  MyThemeInterfaceColors,
  shortAccountId,
  DEVICE_WIDTH,
} from '_utils';
import {deletePost, getUsername, vote} from '_db';
import {Overlay} from '_molecules';

// TODO: not allow to vote if another vote is in progress

interface PostPreviewProps {
  id: number;
  userAddress: string;
  text: string;
  votes: {
    up: number;
    down: number;
  };
  refreshPosts: () => void;
  myAddress: string;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  id,
  userAddress,
  text,
  votes,
  refreshPosts,
  myAddress,
}: PostPreviewProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [username, setUsername] = useState('');
  const [loadingUsername, setLoadingUsername] = React.useState(true);

  const [loadingUpVote, setLoadingUpVote] = React.useState(false);
  const [loadingDownVote, setLoadingDownVote] = React.useState(false);

  const [showModal, setShowModal] = React.useState(false);
  const [loadingModal, setLoadingModal] = React.useState(false);

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
      } else if (error === 'gas required exceeds allowance') {
        Alert.alert("You don't have enough gas");
      } else Alert.alert('Error', error);
    } else refreshPosts();
  };

  const onDeletePost = async () => {
    setLoadingModal(true);
    const {error} = await deletePost(id);
    setLoadingModal(false);

    if (error) {
      if (error === 'gas required exceeds allowance') {
        Alert.alert("You don't have enough gas");
      } else Alert.alert('Error', error);
    } else {
      refreshPosts();
      setShowModal(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.userImage} />
        <View style={{flex: 1}}>
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
        {myAddress === userAddress ? (
          <TouchableOpacity
            style={styles.threeDots}
            onPress={() => setShowModal(true)}>
            <CustomIcon name="dots-three-horizontal" type="entypo" size={15} />
          </TouchableOpacity>
        ) : null}
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
      {showModal ? (
        <Overlay
          isVisible
          onBackdropPress={
            loadingModal ? () => null : () => setShowModal(false)
          }
          overlayStyle={styles.modal}
          animationType="fade">
          {loadingModal ? (
            <ActivityIndicator
              size="large"
              style={{transform: [{scale: 1.5}]}}
            />
          ) : (
            <TouchableOpacity style={styles.modalButton} onPress={onDeletePost}>
              <TextByScale color={colors.error} bold>
                Delete post
              </TextByScale>
            </TouchableOpacity>
          )}
        </Overlay>
      ) : null}
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
  threeDots: {
    padding: 10,
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
  modal: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#fff0',
  },
  modalButton: {
    borderRadius: 10,
    backgroundColor: colors.background,
    width: DEVICE_WIDTH * 0.8,
    padding: 15,
    alignItems: 'center',
  },
}));
