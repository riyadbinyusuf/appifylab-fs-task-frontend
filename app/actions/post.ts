"use server";

import {
  createCommentService,
  createPostService,
  fetchPostService,
  toggleCommentLikeService,
  togglePostLikeService,
  uploadSignleFileService,
} from "../lib/clients/post-client";
import { CreateCommentSchema, CreatePostSchema } from "../lib/definitions";
import { containsScripts } from "../lib/helpers";
import * as z from "zod";
import {
  PostLikeActionPayload,
  PostLikeActionState,
} from "../lib/types/post-type";

export async function getFeedPosts(searchParams: string) {
  try {
    const promiseRes = await fetchPostService(searchParams);
    if (!promiseRes.ok) {
      return null;
    }
    const res = await promiseRes.json();

    return res.data;
  } catch (err) {
    console.error("Error: getting posts", err);
  }
}

export async function uploadFile(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadSignleFileService(formData);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createPostAction(prevState: any, formData: FormData) {
  const imageFile = formData.get("file") as File;
  const text = formData.get("text") as string;
  const visibility = formData.get("visibility") as string;

  if (containsScripts(text)) {
    return {
      errors: {
        text: ["Invalid text"],
      },
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  let imageUrl = undefined;
  if (imageFile) {
    try {
      const fileData = await uploadFile(imageFile);

      if (fileData?.url) {
        imageUrl = fileData.url;
      }
    } catch (err) {
      return {
        errors: {
          imageUrl: ["Failed to upload image"],
        },
        inputs: Object.fromEntries(formData.entries()),
      };
    }
  }

  const validatedFields = CreatePostSchema.safeParse({
    text,
    imageUrl,
    visibility,
  });

  if (!validatedFields.success) {
    return {
      status: false,
      errors: z.flattenError(validatedFields.error),
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  try {
    const res = await createPostService(validatedFields.data);
    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: "Post created successfully",
      };
    } else {
      return {
        errors: {
          server: [data.message || "Failed to create post"],
        },
        inputs: Object.fromEntries(formData.entries()),
      };
    }
  } catch (error) {
    return {
      message: "Failed to create post",
    };
  }
}

export async function createCommentAction(prevState: any, formData: FormData) {
  const imageFile = formData.get("file") as File;
  const text = formData.get("text") as string;
  const postId = formData.get("postId") as string;
  const parentId = formData.get("parentId") as string;

  if (containsScripts(text)) {
    return {
      errors: {
        text: ["Invalid text"],
      },
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  let imageUrl = undefined;
  if (imageFile) {
    try {
      const fileData = await uploadFile(imageFile);
      if (fileData?.url) imageUrl = fileData.url;
    } catch (err) {
      return {
        errors: {
          imageUrl: ["Failed to upload image"],
        },
        inputs: Object.fromEntries(formData.entries()),
      };
    }
  }

  const validatedFields = CreateCommentSchema.safeParse({
    commentText: text,
    imageUrl,
    parentId: parentId ? Number(parentId) : undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  try {
    const res = await createCommentService(postId, validatedFields.data);
    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
        message: "Comment created successfully",
      };
    } else {
      return {
        errors: {
          server: [data.message || "Failed to create comment"],
        },
        inputs: Object.fromEntries(formData.entries()),
      };
    }
  } catch (error) {
    return {
      message: "Failed to create comment",
    };
  }
}

export async function togglePostLikeAction(
  _: PostLikeActionState,
  postId: string,
) {
  if (postId === undefined || postId === null) {
    return {
      status: false,
      message: "Invalid post id",
    };
  }

  try {
    const res = await togglePostLikeService(postId);
    const data = await res.json();
    return {
      status: true,
      message: data?.message ?? "Success",
    };
  } catch (error) {
    return {
      status: false,
      message: "failed to toggle like",
    };
  }
}


export async function toggleCommentLikeAction(
  _: PostLikeActionState,
  commentId: string,
) {
  if (commentId === undefined || commentId === null) {
    return {
      status: false,
      message: "Invalid post id",
    };
  }

  try {
    const res = await toggleCommentLikeService(commentId);
    const data = await res.json();
    return {
      status: true,
      message: data?.message ?? "Success",
    };
  } catch (error) {
    return {
      status: false,
      message: "failed to toggle like",
    };
  }
}
