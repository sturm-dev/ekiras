/* eslint-disable react-hooks/exhaustive-deps */

import React, {useState} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Jazzicon from 'react-native-jazzicon';

import {CustomIcon, TextByScale} from '_atoms';
import {
  themedStyleSheet,
  MyThemeInterfaceColors,
  shortAccountId,
  DEVICE_WIDTH,
  getPercentageInHex,
} from '_utils';
import {
  compareTwoAddress,
  deletePost,
  getDownVote,
  getUpVote,
  PostInterface,
  vote,
} from '_db';
import {LoaderFullScreen, Overlay} from '_molecules';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {CUSTOM_FONT} from 'src/config/constants';
dayjs.extend(relativeTime);

interface PostPreviewProps {
  post: PostInterface;
  myAddress: string;
  setVoteInProgress?: (value: boolean) => void;
  voteInProgress?: boolean;
  updateLocalPost?: (post: PostInterface) => void;
  removeLocalPost?: (post: PostInterface) => void;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  post,
  myAddress,
  setVoteInProgress,
  voteInProgress,
  updateLocalPost,
  removeLocalPost,
}: PostPreviewProps) => {
  const styles = useStyles();
  const colors = useTheme().colors as unknown as MyThemeInterfaceColors;

  const [loadingUpVote, setLoadingUpVote] = useState(false);
  const [upVote, setUpVote] = useState(false);
  const [loadingDownVote, setLoadingDownVote] = useState(false);
  const [downVote, setDownVote] = useState(false);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [loadingOptionsModal, setLoadingOptionsModal] = useState(false);

  React.useEffect(() => {
    // delete this - is for not showing error of unused vars
    if (!colors) console.log();

    getAndPaintUpVote();
    getAndPaintDownVote();
  }, []);

  const getAndPaintUpVote = async () => {
    if (myAddress) {
      setLoadingUpVote(true);
      const {upVote: _upVote, error} = await getUpVote(post.id, myAddress);
      setLoadingUpVote(false);

      if (error) Alert.alert('Error', error);
      else setUpVote(_upVote);
    }
  };

  const getAndPaintDownVote = async () => {
    if (myAddress) {
      setLoadingDownVote(true);
      const {downVote: _downVote, error} = await getDownVote(
        post.id,
        myAddress,
      );
      setLoadingDownVote(false);

      if (error) Alert.alert('Error', error);
      else setDownVote(_downVote);
    }
  };

  const onVote = async (type: 'up' | 'down') => {
    if (compareTwoAddress(myAddress, post.author.id)) {
      Alert.alert('Error', "You can't vote for your own post");
    } else if (voteInProgress) {
      Alert.alert('Error', 'Vote in progress');
    } else {
      type === 'up' ? setLoadingUpVote(true) : setLoadingDownVote(true);
      setVoteInProgress && setVoteInProgress(true);

      const {error} = await vote({
        post,
        voteIsTypeUp: type === 'up',
        userAddress: myAddress,
      });
      type === 'up' ? setLoadingUpVote(false) : setLoadingDownVote(false);
      setVoteInProgress && setVoteInProgress(false);

      if (error) {
        if (error === 'tx is too expensive') {
        } else if (error === 'no mnemonic found') {
          Alert.alert('You need to log-in to interact with the app');
        } else if (error === 'gas required exceeds allowance') {
          Alert.alert("You don't have enough gas");
        } else Alert.alert('Error', error);
      } else {
        const updatedPost = {
          ...post,
          ...(type === 'up'
            ? {
                upVotesCount: post.upVotesCount + 1,
                downVotesCount: post.downVotesCount + (downVote ? -1 : 0),
              }
            : {
                downVotesCount: post.downVotesCount + 1,
                upVotesCount: post.upVotesCount + (upVote ? -1 : 0),
              }),
        };

        getAndPaintUpVote();
        getAndPaintDownVote();

        updateLocalPost && updateLocalPost(updatedPost);
      }
    }
  };

  const onDeletePost = async () => {
    setLoadingOptionsModal(true);
    const {error} = await deletePost({postId: post.id, userAddress: myAddress});
    setLoadingOptionsModal(false);

    if (error) {
      if (error === 'gas required exceeds allowance') {
        Alert.alert("You don't have enough gas");
      } else Alert.alert('Error', error);
    } else {
      setShowOptionsModal(false);

      removeLocalPost && removeLocalPost(post);
    }
  };

  const canPressUpVote = !(loadingUpVote || loadingDownVote || upVote);
  const canPressDownVote = !(loadingUpVote || loadingDownVote || downVote);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Jazzicon
          size={30}
          address={post.author.id}
          containerStyle={{marginRight: 10}}
        />
        <View style={{flex: 1}}>
          {post.author.username ? (
            <TextByScale
              style={{
                fontFamily: CUSTOM_FONT.BOLD,
                letterSpacing: 0.3,
              }}>
              {post.author.username}
            </TextByScale>
          ) : null}
          <TextByScale
            scale={post.author.username ? 'caption' : 'body1'}
            color={post.author.username ? colors.text2 : colors.text}
            style={{
              ...(post.author.username
                ? {}
                : {
                    fontFamily: CUSTOM_FONT.BOLD,
                    letterSpacing: 0.3,
                  }),
            }}>
            {shortAccountId(post.author.id)}
          </TextByScale>
        </View>
        <View style={styles.dateContainer}>
          <TextByScale
            scale="caption"
            color={colors.text2}
            style={{backgroundColor: colors.background, paddingHorizontal: 2}}>
            {dayjs(dayjs.unix(post.createdDate)).fromNow()}
          </TextByScale>
        </View>
      </View>
      <View style={styles.body}>
        <TextByScale
          style={{
            fontFamily: CUSTOM_FONT.LIGHT,
            letterSpacing: 0.5,
          }}>
          {post.text}
        </TextByScale>
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
                {`${post.upVotesCount}`}
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
                {`${post.downVotesCount}`}
              </TextByScale>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.optionButtonContainer}>
          {compareTwoAddress(myAddress, post.author.id) ? (
            <TouchableOpacity
              style={styles.threeDots}
              onPress={() => setShowOptionsModal(true)}>
              <CustomIcon
                name="dots-three-horizontal"
                type="entypo"
                size={15}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/* ────────────────────────────────────────────────────────────────────────────────  */}
      {showOptionsModal ? (
        <Overlay
          isVisible
          onBackdropPress={
            loadingOptionsModal ? () => null : () => setShowOptionsModal(false)
          }
          overlayStyle={styles.optionsModal}
          animationType="fade">
          {loadingOptionsModal ? (
            <ActivityIndicator
              size="large"
              style={{transform: [{scale: 1.5}]}}
            />
          ) : (
            <TouchableOpacity
              style={styles.optionsModalButton}
              onPress={onDeletePost}>
              <TextByScale color={colors.error} bold>
                Delete post
              </TextByScale>
            </TouchableOpacity>
          )}
        </Overlay>
      ) : null}
      {/* ────────────────────────────────────────────────────────────────────────────────  */}
      {voteInProgress ? <LoaderFullScreen /> : null}
    </View>
  );
};

const useStyles = themedStyleSheet((colors: MyThemeInterfaceColors) => ({
  mainContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingLeft: 10,
    paddingRight: 5,
  },
  dateContainer: {
    marginRight: 5,
  },
  body: {
    padding: 10,
    marginVertical: 20,
  },
  footer: {
    flexDirection: 'row',
  },
  button: {
    flex: 0.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    margin: 5,
  },
  upVote: {
    backgroundColor: colors.success + getPercentageInHex(20),
    borderColor: '#0000',
  },
  downVote: {
    backgroundColor: colors.error + getPercentageInHex(20),
    borderColor: '#0000',
  },
  optionButtonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  threeDots: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  optionsModal: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#fff0',
  },
  optionsModalButton: {
    borderRadius: 10,
    backgroundColor: colors.background,
    width: DEVICE_WIDTH * 0.8,
    padding: 15,
    alignItems: 'center',
  },
}));
