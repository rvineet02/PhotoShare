export type UserType = {
  user_id: number;
  first_name: string;
  last_name: string;
};

export type CommentType = {
  user: string;
  text: string;
};

export type ImageType = {
  photo_id: number;
  filename: string;
  caption: string;
  likes: string[];
  num_likes: number;
  comments: CommentType[];
  num_comments: number;
};

export type AlbumType = {
  album_id: number;
  album_name: string;
  user_id: number;
  user_name: string;
  images: ImageType[];
};

export type FriendType = {
  friend_id: number;
  friend_name: string;
};

export type ContributionType = {
  Final_Contribution: string;
  user_id: number;
  name: string;
};

export type SearchComment = {
  user_id: number;
  user_name: string;
  NoOfComments: number;
}

export type MightLikePhoto = {
  album_id: number;
  photo_location: string;
}

export type MightLikeFriend = {
  fof_id: number;
  fof_name: string;
}

export type SearchTag = {
  album_id: number;
  photo_location: string;
  user_id: number;
}

export type SearchTagResult = {
  mine: SearchTag[];
  others: SearchTag[];
}

export type PopularTag = {
  count: number;
  tag: string;
  tag_id: number;
}
