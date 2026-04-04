"use server";

import { fetchWithAuth } from "../lib/api-client";
import { CreateCommentSchema, CreatePostSchema } from "../lib/definitions";
import { containsScripts } from "../lib/helpers";

export async function createCommentAction(prevState: any, formData: FormData) {
  const imageFile = formData.get("file") as File;
  const text = formData.get("text") as string;
  const postId = formData.get("postId") as string;
  const parentId = formData.get('parentId') as string;

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
    const res = await fetchWithAuth(`/posts/${postId}/create-comment`, {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    });
    const data = await res.json();
    console.log({commentData: data})
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

export async function getFeedPosts(searchParams: string) {
  try {
    const url = `/posts${searchParams ?? ""}`;
    const promiseRes = await fetchWithAuth(url);
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

    const res = await fetchWithAuth("/files/upload-single", {
      method: "POST",
      body: formData,
    }, true);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
