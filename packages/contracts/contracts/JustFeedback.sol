// SPDX-License-Identifier: MIT

// the BTTC network is not supported yet on "the graph" https://github.com/graphprotocol/graph-cli/issues/920
// so the sorting of "trending" posts is done not so efficiently here

pragma solidity 0.8.8;

contract JustFeedback {
  struct Post {
    address author;
    string text;
    mapping(address => bool) upVotes;
    uint256 upVotesCount;
    mapping(address => bool) downVotes;
    uint256 downVotesCount;
  }

  mapping(uint256 => Post) public posts;
  uint256 postIndex;
  mapping(address => string) public addressToUsername;
  mapping(string => address) public usernameToAddress;
  address emptyAddress;

  event CreatePostEvent(uint256 _id);
  event VoteEvent(
    uint256 _postId,
    uint256 _upVotesCount,
    uint256 _downVotesCount
  );
  event UpdateUsernameEvent();

  constructor() {
    postIndex = 0;
    emptyAddress = 0x0000000000000000000000000000000000000000;
  }

  function createPost(string memory _text) public {
    posts[postIndex].author = msg.sender;
    posts[postIndex].text = _text;
    posts[postIndex].upVotesCount = 0;
    posts[postIndex].downVotesCount = 0;

    emit CreatePostEvent(postIndex);

    postIndex += 1;
  }

  function votePost(uint256 _postId, bool _voteIsTypeUp) public {
    require(posts[_postId].author != emptyAddress, "post not created yet");
    require(posts[_postId].author != msg.sender, "the author cannot vote");
    require(
      _voteIsTypeUp
        ? !posts[_postId].upVotes[msg.sender]
        : !posts[_postId].downVotes[msg.sender],
      "only one vote for post"
    );

    if (_voteIsTypeUp) {
      posts[_postId].upVotesCount += 1;
      posts[_postId].upVotes[msg.sender] = true;

      if (posts[_postId].downVotes[msg.sender]) {
        posts[_postId].downVotes[msg.sender] = false;
        posts[_postId].downVotesCount -= 1;
      }
    } else {
      posts[_postId].downVotesCount += 1;
      posts[_postId].downVotes[msg.sender] = true;

      if (posts[_postId].upVotes[msg.sender]) {
        posts[_postId].upVotes[msg.sender] = false;
        posts[_postId].upVotesCount -= 1;
      }
    }

    emit VoteEvent(
      _postId,
      posts[_postId].upVotesCount,
      posts[_postId].downVotesCount
    );
  }

  function updateMyUsername(string memory _text) public {
    require(usernameToAddress[_text] == emptyAddress, "username already used");

    // change of username -> delete previous
    if (bytes(addressToUsername[msg.sender]).length != 0) {
      usernameToAddress[addressToUsername[msg.sender]] = emptyAddress;
    }

    usernameToAddress[_text] = msg.sender;
    addressToUsername[msg.sender] = _text;

    emit UpdateUsernameEvent();
  }
}
