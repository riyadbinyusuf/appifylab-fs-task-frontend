"use server";

import {
  SignupFormSchema,
  FormState,
  LoginFormState,
  LoginFormSchema,
} from "@/app/lib/definitions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as z from 'zod'

export async function signupAction(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    accept: formData.get("accept"),
  });

  if (!validatedFields.success) {
    return {
      status: false,
      errors: z.flattenError(validatedFields.error),
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  // Call the provider or db to create a user...
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedFields.data),
  });
  const data = await res.json();

  if (res.ok) {
    redirect("/login");
  } else {
    return {
      status: false,
      message: data?.message || "Signup failed. Please try again.",
      inputs: Object.fromEntries(formData.entries()),
      errors: data.errors,
    };
  }
}

export async function loginAction(state: LoginFormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  
  if (!validatedFields.success) {
    return {
      status: false,
      message: "Invalid credentials",
      inputs: Object.fromEntries(formData.entries()),
    };
  }

  const resPromise = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    },
  );

  const res = await resPromise.json();

  if (res.status === "error") {
    return {
      ...res,
      status: false,
      inputs: {},
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("session_token", res.data?.accessToken || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  cookieStore.set("user_info", JSON.stringify(res.data?.user || {}), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  redirect("/feed");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  cookieStore.delete("user_info");
  redirect("/login");
}

export async function getUserInfo() {
  const cookieStore = await cookies();
  const userInfoString = cookieStore.get("user_info")?.value || null;
  if (userInfoString) {
    try {
      const userData = JSON.parse(userInfoString);
      return userData;
    } catch (e) {
      console.error("Error parsing user info cookie:", e);
      return null;
    }
  }
  return null;
}
