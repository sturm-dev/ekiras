import {
  CreatePostEvent as CreatePostEventEvent,
  VoteEvent as VoteEventEvent,
} from "../generated/JustFeedback/JustFeedback";
import { Post, User } from "../generated/schema";

export function handleCreatePostEvent(event: CreatePostEventEvent): void {
  const post = new Post(event.params._id.toString());

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

export function handleVoteEvent(event: VoteEventEvent): void {
  let post = Post.load(event.params._postId.toString());

  if (post != null) {
    post.upVotesCount = event.params._upVotesCount;
    post.downVotesCount = event.params._downVotesCount;
    post.save();
  }
}
