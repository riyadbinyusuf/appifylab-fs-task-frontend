"use client";

import { useState, useEffect } from "react";
import { getUserInfo } from "../actions/auth";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function useUserInfo() {

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {

    async function loadUser() {

      const userInfo = await getUserInfo();

      setUser(userInfo);

    }

    loadUser();

  }, []);

  return { user };
}