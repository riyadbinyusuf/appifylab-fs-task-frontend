"use server";

import { fetchWithAuth } from "../lib/api-client";
import { CreatePostSchema } from "../lib/definitions";
import { containsScripts } from "../lib/helpers";

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
      console.log({ fileData });
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
      errors: validatedFields.error.flatten().fieldErrors,
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  console.log({ data: validatedFields.data, imageFile, imageUrl });

  try {
    const res = await fetchWithAuth("/posts/create", {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    });
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

export async function getFeedPosts(searchParams: string) {
  try {
    const url = `/posts${searchParams ?? ""}`;
    const promiseRes = await fetchWithAuth(url);
    // console.log({promiseRes})
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

    const res = await fetchWithAuth(
      "/files/upload-single",
      {
        method: "POST",
        body: formData,
      },
      true,
    );

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
