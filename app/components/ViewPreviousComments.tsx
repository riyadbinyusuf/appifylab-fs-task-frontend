import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Post, PostComment } from "../lib/types/post-type";
import CreateComment from "./CreateComment";
import { timeAgo } from "../lib/helpers";
import CommentLike from "./CommentLike";
import Image from "next/image";

interface ViewPreviousCommentsProps {
  post: Post;
  handleMutate: () => void;
  handleOptmisticCommentLike: (
    comment: PostComment,
    userId: number,
    isLiked: boolean,
  ) => void;
}

function ViewPreviousComments({
  post,
  handleMutate,
  handleOptmisticCommentLike,
}: ViewPreviousCommentsProps) {
  const comments = post.comments;
  const [show, setShow] = useState(false);
  const [selectedComment, setSelectedComment] = useState<PostComment | null>(
    null,
  );
  const commentBoxRef = useRef<HTMLDivElement>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const totalCommentsToView =
    post?.totalComments > 1 ? post.totalComments - 1 : 0;

  const handleReply = (comment: PostComment) => {
    setSelectedComment(comment);
    commentBoxRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="_previous_comment">
      {totalCommentsToView > 0 ? (
        <button
          type="button"
          className="_previous_comment_txt"
          data-bs-toggle="modal"
          data-bs-target="#previousCommentsModal"
          onClick={handleShow}
        >
          View {totalCommentsToView} previous comments
        </button>
      ) : null}

      <Modal
        show={show}
        onHide={() => {
          handleClose();
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        // backdrop={false}
        backdropClassName="rbs-modal-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>More comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {comments.map((comment: PostComment) => {
            return (
              <React.Fragment key={comment.id}>
                <div className="_comment_main">
                  <div className="_comment_image">
                    <a href="profile.html" className="_comment_image_link">
                      <img
                        src="assets/images/txt_img.png"
                        alt=""
                        className="_comment_img1"
                      />
                    </a>
                  </div>
                  <div className="_comment_area">
                    <div
                      className="_comment_details mt-3"
                      style={{ minWidth: "100%" }}
                    >
                      <div className="_comment_details_top">
                        <div className="_comment_name">
                          <a href="profile.html ">
                            <h4 className="_comment_name_title">
                              {comment?.user?.firstName +
                                " " +
                                comment?.user?.lastName}
                            </h4>
                          </a>
                        </div>
                      </div>
                      <div className="_comment_status">
                        <p className="_comment_status_text">
                          <span>{comment?.commentText ?? ""}</span>
                        </p>
                        {comment.media?.length > 0 ? (
                          <div className="" style={{width: "200px"}}>
                            <Image
                              src={comment.media?.[0].url}
                              alt="Image"
                              width={200}
                              height={200}
                              className="_time_img"
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className="_total_reactions">
                        <div className="_total_react">
                          <span className="_reaction_like">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-thumbs-up"
                            >
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                          </span>
                          <span className="_reaction_heart">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-heart"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </span>
                        </div>
                        <span className="_total">{comment.totalLikes}</span>
                      </div>
                      <div className="_comment_reply">
                        <div className="_comment_reply_num">
                          <ul className="_comment_reply_list">
                            <li>
                              <CommentLike
                                comment={comment}
                                handleOptmisticCommentLike={
                                  handleOptmisticCommentLike
                                }
                              />
                              {/* <span>Like.</span> */}
                            </li>
                            <li>
                              <span
                                role="buttone"
                                onClick={() => handleReply(comment)}
                              >
                                Reply.
                              </span>
                            </li>
                            <li>
                              <span>Share</span>
                            </li>
                            <li>
                              <span className="_time_link">
                                .{timeAgo(comment.createdAt)}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div className="_feed_inner_comment_box" ref={commentBoxRef}>
            <CreateComment
              postId={selectedComment?.postId as number}
              parentId={selectedComment?.parentId}
              handleMutate={() => handleMutate()}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewPreviousComments;
