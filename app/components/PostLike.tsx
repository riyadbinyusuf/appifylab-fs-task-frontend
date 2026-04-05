import React, { startTransition, useActionState, useEffect, useOptimistic } from "react";
import { togglePostLikeAction } from "../actions/post";
import {
  PostLikeActionPayload,
  PostLikeActionState,
} from "../lib/types/post-type";
import useUserInfo from "../hooks/useUserInfo";

interface PostLikeProps {
  post: any;
  handleMutate: () => void;
}

function PostLike({ post, handleMutate }: PostLikeProps) {
  const { user } = useUserInfo();
  const isLiked: boolean =
    (post.likes.find((like: any) => like.postId === post.id) &&
      post?.user?.id === user?._id) ??
    false;
  const [actionState, dispatchAction] = useActionState<
    PostLikeActionState,
    string
  >(togglePostLikeAction, { status: false, message: "", isLiked });
  const [optimisticLike, setOptimisticLike] = useOptimistic(isLiked);
  console.log(`p:${post.id}`, {isLiked})

  useEffect(() => {
    handleMutate();
  }, [actionState?.status])

  const handleLikeToggle = () => {
    startTransition(() => {
      setOptimisticLike((prevState) => !prevState);
      dispatchAction(post.id);
    });
  };

  return (
    <button
      type="button"
      onClick={() => handleLikeToggle()}
      className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_reaction_active"
    >
      <span className="_feed_inner_timeline_reaction_link">
        {" "}
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="none"
            viewBox="0 0 19 19"
          >
            <path
              fill="#FFCC4D"
              d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
            ></path>
            <path
              fill="#664500"
              d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
            ></path>
            <path
              fill="#fff"
              d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
            ></path>
            <path
              fill="#664500"
              d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
            ></path>
          </svg>
          {optimisticLike ? "Unlike" : "Like"}
        </span>
      </span>
    </button>
  );
}

export default PostLike;
