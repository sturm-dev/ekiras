export type PostInterface = {
  id: number;
  createdDate: number; // unix timestamp
  author: {
    id: string;
    username: string;
  };
  text: string;
  upVotesCount: number;
  downVotesCount: number;
};
