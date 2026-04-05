import { fetchWithAuth } from "../api-client";

export const postCreatePath = "/posts/create";
export const commentCreatePath = (postId: string) =>
  `/posts/${postId}/create-comment`;
export const postsPath = "/posts";
export const singleFileUpload = "/files/upload-single";

export const createPostService = (payload: Record<string, any>) => {
  return fetchWithAuth(postCreatePath, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const fetchPostService = (searchParams: string) => {
  const url = `${postsPath}${searchParams ?? ""}`;
  return fetchWithAuth(url);
};

export const uploadSignleFileService = (formData: FormData) => {
  return fetchWithAuth(
    singleFileUpload,
    {
      method: "POST",
      body: formData,
    },
    true,
  );
};

export const createCommentService = (
  postId: string,
  payload: Record<string, any>,
) => {
  const path = commentCreatePath(postId);
  return fetchWithAuth(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const togglePostLikeService = (postId: string) => {
  const path = `/posts/${postId}/like`;
  return fetchWithAuth(path, {
    method: "POST",
  });
};

export const toggleCommentLikeService = (commentId: string) => {
  const path = `/comments/${commentId}/like`;
  return fetchWithAuth(path, {
    method: "POST",
  });
};
