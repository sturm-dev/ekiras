import { CreatePostEvent as CreatePostEventEvent } from "../generated/JustFeedback/JustFeedback";
import {
  Post,
  // User
} from "../generated/schema";

// export function handleCreatePostEvent(event: CreatePostEventEvent): void {
//   let entity = new CreatePostEvent(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   );
//   entity._id = event.params._id;
//   entity.save();
// }

export function handleCreatePostEvent(event: CreatePostEventEvent): void {
  let post = Post.load(event.params._id.toString());

  if (post == null) {
    post = new Post(event.params._id.toString());
    // post.text = "asd";
  }
  // post.author = event.params._id.toHexString();
  post.save();

  // let user = User.load(event.params.to.toHexString());
  // if (!user) {
  //   user = new User(event.params.to.toHexString());
  //   user.save();
  // }
}

// TODO: watch another video of how to configure a subgraph
