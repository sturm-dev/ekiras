import {
  AddTransactionIdEvent as AddTransactionIdEventEvent,
  CreatePostEvent as CreatePostEventEvent,
  DeletePostEvent as DeletePostEventEvent,
  UpdateUsernameEvent as UpdateUsernameEventEvent,
  VoteEvent as VoteEventEvent
} from "../generated/JustFeedback/JustFeedback"
import {
  AddTransactionIdEvent,
  CreatePostEvent,
  DeletePostEvent,
  UpdateUsernameEvent,
  VoteEvent
} from "../generated/schema"

export function handleAddTransactionIdEvent(
  event: AddTransactionIdEventEvent
): void {
  let entity = new AddTransactionIdEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._transactionId = event.params._transactionId
  entity.save()
}

export function handleCreatePostEvent(event: CreatePostEventEvent): void {
  let entity = new CreatePostEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._id = event.params._id
  entity.save()
}

export function handleDeletePostEvent(event: DeletePostEventEvent): void {
  let entity = new DeletePostEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._id = event.params._id
  entity.save()
}

export function handleUpdateUsernameEvent(
  event: UpdateUsernameEventEvent
): void {
  let entity = new UpdateUsernameEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._userAddress = event.params._userAddress
  entity.save()
}

export function handleVoteEvent(event: VoteEventEvent): void {
  let entity = new VoteEvent(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._postId = event.params._postId
  entity._upVotesCount = event.params._upVotesCount
  entity._downVotesCount = event.params._downVotesCount
  entity.save()
}
