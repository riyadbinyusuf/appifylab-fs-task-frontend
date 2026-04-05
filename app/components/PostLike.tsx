import React, { startTransition, useActionState } from "react";
import { togglePostLikeAction } from "../actions/post";
import { Post, PostLikeActionState } from "../lib/types/post-type";
import useUserInfo from "../hooks/useUserInfo";

interface PostLikeProps {
  post: Post;
  handleOptmisticLike: (
    postId: number,
    userId: number,
    isLiked: boolean,
  ) => void;
}

function PostLike({ post, handleOptmisticLike }: PostLikeProps) {
  const { user } = useUserInfo();
  const postId = post.id;
  const userId = Number(user?._id);

  const isLiked = post.likes?.some((l) => l.userId === userId);

  const [_, dispatchAction] = useActionState<PostLikeActionState, string>(
    togglePostLikeAction,
    {},
  );

  const handleLikeToggle = () => {
    handleOptmisticLike(postId, userId, isLiked);
    startTransition(() => {
      dispatchAction(postId.toString());
    });
  };

  return (
    <button
      type="button"
      onClick={() => handleLikeToggle()}
      className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_reaction_active"
    >
      {isLiked ? "Unlike" : "Like"}
    </button>
  );
}

export default React.memo(PostLike);
