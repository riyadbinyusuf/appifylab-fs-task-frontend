import { API_BASE_URL } from "../configs";

export const loginPath = `${API_BASE_URL}/auth/login`;
export const signUpPath = `${API_BASE_URL}/auth/register`;

export const loginService = (payload: Record<string, any>) => {
  return fetch(loginPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const signupService = (payload: Record<string, any>) => {
  return fetch(signUpPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
