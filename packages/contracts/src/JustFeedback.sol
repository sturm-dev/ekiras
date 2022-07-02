// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

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

    constructor() {
        postIndex = 0;
    }

    function createPost(string memory text) public {
        posts[postIndex].author = msg.sender;
        posts[postIndex].text = text;
        posts[postIndex].upVotesCount = 0;
        posts[postIndex].downVotesCount = 0;

        postIndex += 1;
    }

    function votePost(uint256 postId, bool voteIsTypeUp) public {
        require(
            posts[postId].author != 0x0000000000000000000000000000000000000000,
            "post not created yet"
        );
        require(posts[postId].author != msg.sender, "the author cannot vote");
        require(
            voteIsTypeUp
                ? !posts[postId].upVotes[msg.sender]
                : !posts[postId].downVotes[msg.sender],
            "only one vote for post"
        );

        if (voteIsTypeUp) {
            posts[postId].upVotesCount += 1;
            posts[postId].upVotes[msg.sender] = true;

            if (posts[postId].downVotes[msg.sender]) {
                posts[postId].downVotes[msg.sender] = false;
                posts[postId].downVotesCount -= 1;
            }
        } else {
            posts[postId].downVotesCount += 1;
            posts[postId].downVotes[msg.sender] = true;

            if (posts[postId].upVotes[msg.sender]) {
                posts[postId].upVotes[msg.sender] = false;
                posts[postId].upVotesCount -= 1;
            }
        }
    }
}
