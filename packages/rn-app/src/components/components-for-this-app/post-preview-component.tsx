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
  getPercentageInHex,
} from '_utils';
import {
  deletePost,
  getDownVote,
  getUpVote,
  getUsername,
  PostInterface,
  vote,
} from '_db';
import {Overlay} from '_molecules';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface PostPreviewProps {
  post: PostInterface;
  refreshPosts?: () => void;
  myAddress: string;
  setVoteInProgress?: (value: boolean) => void;
  voteInProgress?: boolean;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  post: {id, author, createdDate, text, downVotesCount, upVotesCount},
  refreshPosts,
  myAddress,
  setVoteInProgress,
  voteInProgress,
}: PostPreviewProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [username, setUsername] = useState('');
  const [loadingUsername, setLoadingUsername] = useState(true);

  const [loadingUpVote, setLoadingUpVote] = useState(false);
  const [upVote, setUpVote] = useState(false);
  const [loadingDownVote, setLoadingDownVote] = useState(false);
  const [downVote, setDownVote] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    getAndSetUsername();
    getAndSetUpVote();
    getAndSetDownVote();
  }, []);

  const getAndSetUsername = async () => {
    const {username: _username, error} = await getUsername(author);
    setLoadingUsername(false);

    if (error) Alert.alert('Error', error);
    else setUsername(_username);
  };

  const getAndSetUpVote = async () => {
    if (myAddress) {
      setLoadingUpVote(true);
      const {upVote: _upVote, error} = await getUpVote(id, myAddress);
      setLoadingUpVote(false);

      if (error) Alert.alert('Error', error);
      else setUpVote(_upVote);
    }
  };

  const getAndSetDownVote = async () => {
    if (myAddress) {
      setLoadingDownVote(true);
      const {downVote: _downVote, error} = await getDownVote(id, myAddress);
      setLoadingDownVote(false);

      if (error) Alert.alert('Error', error);
      else setDownVote(_downVote);
    }
  };

  const onVote = async (type: 'up' | 'down') => {
    if (myAddress === author) {
      Alert.alert('Error', "You can't vote for your own post");
    } else if (voteInProgress) {
      Alert.alert('Error', 'Vote in progress');
    } else {
      type === 'up' ? setLoadingUpVote(true) : setLoadingDownVote(true);
      setVoteInProgress && setVoteInProgress(true);

      const {error} = await vote(id, type === 'up');
      type === 'up' ? setLoadingUpVote(false) : setLoadingDownVote(false);
      setVoteInProgress && setVoteInProgress(false);

      if (error) {
        if (error === 'no mnemonic found') {
          Alert.alert('You need to log-in to interact with the app');
        } else if (error === 'gas required exceeds allowance') {
          Alert.alert("You don't have enough gas");
        } else Alert.alert('Error', error);
      } else {
        refreshPosts && refreshPosts();
        getAndSetUpVote();
        getAndSetDownVote();
      }
    }
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
      refreshPosts && refreshPosts();
      setShowModal(false);
    }
  };

  const canPressUpVote = !(loadingUpVote || loadingDownVote || upVote);
  const canPressDownVote = !(loadingUpVote || loadingDownVote || downVote);

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
                {shortAccountId(author)}
              </TextByScale>
            </>
          )}
        </View>
        {myAddress === author ? (
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
          style={{...styles.button, ...(upVote ? styles.upVote : {})}}
          onPress={canPressUpVote ? () => onVote('up') : () => null}
          activeOpacity={canPressUpVote ? 0.8 : 1}>
          {loadingUpVote ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <CustomIcon name="thumbs-up" type="feather" />
              <TextByScale
                style={{marginLeft: 10}}
                scale="caption"
                color={colors.text2}>
                {`${upVotesCount}`}
              </TextByScale>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.button, ...(downVote ? styles.downVote : {})}}
          onPress={canPressDownVote ? () => onVote('down') : () => null}
          activeOpacity={canPressDownVote ? 0.8 : 1}>
          {loadingDownVote ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <CustomIcon name="thumbs-down" type="feather" />
              <TextByScale
                style={{marginLeft: 10}}
                scale="caption"
                color={colors.text2}>
                {`${downVotesCount}`}
              </TextByScale>
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.dateContainer}>
        <TextByScale
          scale="body2"
          color={colors.text2}
          style={{backgroundColor: colors.background, paddingHorizontal: 2}}>
          {dayjs(dayjs.unix(createdDate)).fromNow()}
        </TextByScale>
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
  upVote: {
    backgroundColor: colors.success + getPercentageInHex(20),
  },
  downVote: {
    backgroundColor: colors.error + getPercentageInHex(20),
  },
  dateContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 5,
    paddingTop: 2,
    marginBottom: -20,
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
