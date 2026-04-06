"use client";

import React, { useEffect, useRef, useState } from "react";
import { getFeedPosts } from "../actions/post";
import useSWRInfinite from "swr/infinite";
import { timeAgo } from "../lib/helpers";
import Image from "next/image";
import CreatePost from "./CreatePost";
import CreateComment from "./CreateComment";
import ViewPreviousComments from "./ViewPreviousComments";
import PostLike from "./PostLike";
import { FeedResponse, Post, PostComment } from "../lib/types/post-type";
import CommentLike from "./CommentLike";

const fetcher = async (url: string): Promise<FeedResponse> => {
  const response = await getFeedPosts(url);

  if (!response || !response.posts) {
    throw new Error("Failed to fetch posts");
  }

  return response;
};

export default function FeedTimeline() {
  const getKey = (
    pageIndex: number,
    previousPageData: FeedResponse | null,
  ): string | null => {
    if (previousPageData && !previousPageData.cursor) {
      return null;
    }

    if (pageIndex === 0) {
      return "?limit=10";
    }

    if (previousPageData?.cursor) {
      return `?cursor=${previousPageData.cursor}&limit=10`;
    }

    return null;
  };

  const { data, size, setSize, isValidating, error, mutate } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateAll: true,
      keepPreviousData: true,
      persistSize: true,
      revalidateOnFocus: true,
    },
  );

  const posts = data ? data.flatMap((page) => page.posts) : [];
  const isLoadingMore =
    isValidating || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.posts.length === 0;
  const lastPage = data?.[data.length - 1];
  const isReachingEnd = isEmpty || !lastPage?.cursor;

  const triggerPointRef = useRef<HTMLDivElement>(null);

  const loadMore = () => {
    setSize(size + 1);
  };

  useEffect(() => {
    const triggerPoint = triggerPointRef.current;
    if (!triggerPoint) return;
    const scrollContainer = document.querySelector("._layout_middle_wrap");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !isReachingEnd) {
          loadMore();
        }
      },
      {
        root: scrollContainer,
        rootMargin: "0px 0px 300px 0px",
        threshold: 0,
      },
    );

    observer.observe(triggerPoint);
    return () => observer.disconnect();
  }, [isLoadingMore, isReachingEnd, loadMore]);

  const handleOptmisticLike = (
    postId: number,
    userId: number,
    isLiked: boolean,
  ) => {
    mutate((prev) => {
      if (!prev) return prev;

      const updatedData = prev.map((page) => ({
        ...page,
        posts: page.posts.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((l) => l.userId !== userId)
              : [...post.likes, { userId }],
          };
        }),
      }));

      return updatedData;
    }, false);
  };

  const handleOptmisticCommentLike = (
    comment: PostComment,
    userId: number,
    isLiked: boolean,
  ) => {
    mutate((prev) => {
      if (!prev) return prev;

      const updatedData = prev.map((page) => ({
        ...page,
        posts: page.posts.map((post) => {
          if (post.id !== comment.postId) return post;
          return {
            ...post,
            comments: post.comments.map((cmt: PostComment) => {
              if (comment.id !== cmt.id) return cmt;
              return {
                ...cmt,
                likes: isLiked
                  ? cmt.likes.filter((l) => l.userId !== userId)
                  : [...cmt.likes, { userId }],
                totalLikes: isLiked ? cmt.totalLikes - 1 : cmt.totalLikes + 1,
              };
            }),
          };
        }),
      }));

      return updatedData;
    }, false);
  };

  return (
    <>
      <CreatePost handleMutate={() => mutate()} />

      {posts.map((post: Post) => {
        return (
          <React.Fragment key={post.id}>
            {/* Newer */}
            <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
              <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                <div className="_feed_inner_timeline_post_top">
                  <div className="_feed_inner_timeline_post_box">
                    <div className="_feed_inner_timeline_post_box_image">
                      <img
                        src="assets/images/post_img.png"
                        alt=""
                        className="_post_img"
                      />
                    </div>
                    <div className="_feed_inner_timeline_post_box_txt">
                      <h4 className="_feed_inner_timeline_post_box_title">
                        {post.user?.firstName ?? ""} {post.user?.lastName ?? ""}
                      </h4>
                      <p className="_feed_inner_timeline_post_box_para">
                        {timeAgo(post.createdAt)} .
                        <a href="#0">{post.visibility}</a>
                      </p>
                    </div>
                  </div>
                  <div className="_feed_inner_timeline_post_box_dropdown">
                    <div className="_feed_timeline_post_dropdown">
                      <button className="_feed_timeline_post_dropdown_link">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="4"
                          height="17"
                          fill="none"
                          viewBox="0 0 4 17"
                        >
                          <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                          <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                          <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                        </svg>
                      </button>
                    </div>
                    {/* <!--Dropdown--> */}
                    <div className="_feed_timeline_dropdown">
                      <ul className="_feed_timeline_dropdown_list">
                        <li className="_feed_timeline_dropdown_item">
                          <a href="#0" className="_feed_timeline_dropdown_link">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="#1890FF"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.2"
                                  d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"
                                />
                              </svg>
                            </span>
                            Save Post
                          </a>
                        </li>
                        <li className="_feed_timeline_dropdown_item">
                          <a href="#0" className="_feed_timeline_dropdown_link">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="22"
                                fill="none"
                                viewBox="0 0 20 22"
                              >
                                <path
                                  fill="#377DFF"
                                  fillRule="evenodd"
                                  d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            Turn On Notification
                          </a>
                        </li>
                        <li className="_feed_timeline_dropdown_item">
                          <a href="#0" className="_feed_timeline_dropdown_link">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="#1890FF"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.2"
                                  d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"
                                />
                              </svg>
                            </span>
                            Hide
                          </a>
                        </li>
                        <li className="_feed_timeline_dropdown_item">
                          <a href="#0" className="_feed_timeline_dropdown_link">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="#1890FF"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.2"
                                  d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
                                />
                                <path
                                  stroke="#1890FF"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.2"
                                  d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
                                />
                              </svg>
                            </span>
                            Edit Post
                          </a>
                        </li>
                        <li className="_feed_timeline_dropdown_item">
                          <a href="#0" className="_feed_timeline_dropdown_link">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="#1890FF"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.2"
                                  d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
                                />
                              </svg>
                            </span>
                            Delete Post
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <h4 className="_feed_inner_timeline_post_title">{post.text}</h4>
                <div className="_feed_inner_timeline_image">
                  {post.media?.length > 0 ? (
                    <Image
                      src={post.media?.[0].url}
                      alt="Image"
                      width={588}
                      height={388}
                      className="_time_img"
                    />
                  ) : null}
                </div>
              </div>
              <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div className="_feed_inner_timeline_total_reacts_image">
                  <img
                    src="assets/images/react_img1.png"
                    alt="Image"
                    className="_react_img1"
                  />
                  <img
                    src="assets/images/react_img2.png"
                    alt="Image"
                    className="_react_img"
                  />
                  <img
                    src="assets/images/react_img3.png"
                    alt="Image"
                    className="_react_img _rect_img_mbl_none"
                  />
                  <img
                    src="assets/images/react_img4.png"
                    alt="Image"
                    className="_react_img _rect_img_mbl_none"
                  />
                  <img
                    src="assets/images/react_img5.png"
                    alt="Image"
                    className="_react_img _rect_img_mbl_none"
                  />
                  <p className="_feed_inner_timeline_total_reacts_para">9+</p>
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                  <p className="_feed_inner_timeline_total_reacts_para1">
                    <span>{post.totalComments}</span> Comments
                  </p>
                  <p className="_feed_inner_timeline_total_reacts_para2">
                    <span>122</span> Share
                  </p>
                </div>
              </div>
              <div className="_feed_inner_timeline_reaction">
                <PostLike
                  post={post}
                  handleOptmisticLike={handleOptmisticLike}
                />
                <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
                  <span className="_feed_inner_timeline_reaction_link">
                    {" "}
                    <span>
                      <svg
                        className="_reaction_svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        fill="none"
                        viewBox="0 0 21 21"
                      >
                        <path
                          stroke="#000"
                          d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                        ></path>
                        <path
                          stroke="#000"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.938 9.313h7.125M10.5 14.063h3.563"
                        ></path>
                      </svg>
                      Comment
                    </span>
                  </span>
                </button>
                <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                  <span className="_feed_inner_timeline_reaction_link">
                    {" "}
                    <span>
                      <svg
                        className="_reaction_svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="21"
                        fill="none"
                        viewBox="0 0 24 21"
                      >
                        <path
                          stroke="#000"
                          strokeLinejoin="round"
                          d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
                        ></path>
                      </svg>
                      Share
                    </span>
                  </span>
                </button>
              </div>
              {/* Create Comment Form */}
              <CreateComment postId={post.id} handleMutate={() => mutate()} />
              <div className="_timline_comment_main">
                {post.comments?.length > 0 ? (
                  <>
                    {post.comments?.length > 1 && (
                      <ViewPreviousComments
                        post={post}
                        handleMutate={() => mutate()}
                        handleOptmisticCommentLike={handleOptmisticCommentLike}
                      />
                    )}
                    {post.comments.slice(0, 1).map((comment: PostComment) => {
                      return (
                        <React.Fragment key={comment.id}>
                          <div className="_comment_main">
                            <div className="_comment_image">
                              <a
                                href="profile.html"
                                className="_comment_image_link"
                              >
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
                                    <span>{comment?.commentText}</span>
                                  </p>
                                  {comment.media?.length > 0 ? (
                                    <div
                                      className=""
                                      style={{ width: "200px" }}
                                    >
                                      <Image
                                        src={post.comments?.[0].media?.[0].url}
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
                                  <span className="_total">
                                    {comment.totalLikes}
                                  </span>
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
                                        <span>Reply.</span>
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
                              <div className="_feed_inner_comment_box">
                                <CreateComment
                                  postId={comment.postId}
                                  parentId={comment.parentId}
                                  handleMutate={() => mutate()}
                                />
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </>
                ) : null}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div ref={triggerPointRef} style={{ height: 10 }} />

      {(isValidating || isLoadingMore) && (
        <div className="_padd_24 _text_center">Loading...</div>
      )}

      {isReachingEnd && !isLoadingMore && (
        <div className="_padd_24 _text_center">No more posts to load</div>
      )}

      {error && (
        <div className="_padd_24 _text_center _color_red">
          Error loading posts. Please try again.
        </div>
      )}
    </>
  );
}
