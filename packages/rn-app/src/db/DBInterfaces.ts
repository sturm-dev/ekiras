export type PostInterface = {
  id: number;
  createdDate: number; // unix timestamp
  author: string;
  text: string;
  upVotesCount: number;
  downVotesCount: number;
};
