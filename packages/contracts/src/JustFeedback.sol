// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract JustFeedback {
    struct Post {
        string id;
        address author;
        string text;
        address[] upvotes;
        address[] downvotes;
    }

    Post[] public posts;

    function createPost() public {
        // params ->
        // - text
    }

    function getPosts() public view returns (Post[] memory) {
        // returns ->
        // - allPosts
    }

    function votePost() public {
        // author cannot vote on his own post
        // users can vote on only one post at a time
        // ─────────────────────────────────────────────────────────────────
        // params ->
        // - postId
        // - upvote
    }
}
