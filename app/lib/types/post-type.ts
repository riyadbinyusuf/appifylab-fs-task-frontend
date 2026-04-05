export interface FeedResponse {
  posts: Post[];
  cursor?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PostMedia {
  commentId: number | null;
  createdAt: string;
  id: number;
  postId: number;
  type: string;
  url: string;
}
export interface Post {
  id: number;
  text: string;
  media: PostMedia[];
  videoUrl: any;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  isPublished: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments: PostComment[];
  visibility: string;
  likes: any[];
  totalLikes: number;
  totalComments: number;
}

export interface PostLikeActionState {
  status?: boolean;
  message?: string;
}

export interface PostLikeActionPayload {
  postId: string;
}

export interface PostComment {
  commentText: string;
  createdAt: string;
  depth: number;
  id: number;
  isLiked?: boolean;
  likes: any[];
  media: PostMedia[];
  parentId: number | null;
  postId: number;
  totalLikes: number;
  updatedAt: string;
  userId: number;
  user: User;
}
