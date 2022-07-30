import { store } from "@graphprotocol/graph-ts";
import {
  CreatePostEvent,
  VoteEvent,
  DeletePostEvent,
  UpdateUsernameEvent,
} from "../generated/JustFeedback/JustFeedback";
import { Post, User } from "../generated/schema";

export function handleCreatePostEvent(event: CreatePostEvent): void {
  let post = Post.load(event.params._id.toString());

  if (post == null) {
    post = new Post(event.params._id.toString());
    post.createdDate = event.params._createdDate;
    post.text = event.params._text;
    post.upVotesCount = event.params._upVotesCount;
    post.downVotesCount = event.params._downVotesCount;
    post.author = event.params._author.toHexString();
    post.save();

    let user = User.load(event.params._author.toHexString());
    if (!user) {
      user = new User(event.params._author.toHexString());
      user.save();
    }
  }
}

export function handleVoteEvent(event: VoteEvent): void {
  let post = Post.load(event.params._postId.toString());

  if (post != null) {
    post.upVotesCount = event.params._upVotesCount;
    post.downVotesCount = event.params._downVotesCount;
    post.save();
  }
}

// https://thegraph.com/docs/en/developing/assemblyscript-api/#removing-entities-from-the-store
export function handleDeletePostEvent(event: DeletePostEvent): void {
  store.remove("Post", event.params._id.toString());
}

export function handleUpdateUsernameEvent(event: UpdateUsernameEvent): void {
  let user = User.load(event.params._userAddress.toHexString());
  if (!user) user = new User(event.params._userAddress.toHexString());

  user.username = event.params._text;
  user.save();
}
