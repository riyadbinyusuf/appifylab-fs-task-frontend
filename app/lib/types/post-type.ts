export interface PostLikeActionState {
  status: boolean;
  message: string;
  isLiked?: boolean;
  data?: any
}

export interface PostLikeActionPayload {
  postId: string;
}
