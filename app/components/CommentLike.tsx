import React, { startTransition, useActionState } from "react";
import { toggleCommentLikeAction, togglePostLikeAction } from "../actions/post";
import { Post, PostComment, PostLikeActionState } from "../lib/types/post-type";
import useUserInfo from "../hooks/useUserInfo";

interface CommentLikeProps {
  comment: PostComment;
  handleOptmisticCommentLike: (
    comment: PostComment,
    userId: number,
    isLiked: boolean,
  ) => void;
}

function CommentLike({
  comment,
  handleOptmisticCommentLike,
}: CommentLikeProps) {
  const { user } = useUserInfo();
  const commentId = comment.id;
  const userId = Number(user?._id);

  const isLiked = comment.likes?.some((l) => l.userId === userId);

  const [_, dispatchAction] = useActionState<PostLikeActionState, string>(
    toggleCommentLikeAction,
    {},
  );

  const handleLikeToggle = () => {
    handleOptmisticCommentLike(comment, userId, isLiked);
    startTransition(() => {
      dispatchAction(commentId.toString());
    });
  };

  return (
    <span
      role="button"
      onClick={() => handleLikeToggle()}
    >
      {isLiked ? "Unlike" : "Like"}
    </span>
  );
}

export default React.memo(CommentLike);
