import { useState, useEffect, useEffectEvent } from 'react';
import { getUserInfo } from '../actions/auth';// Requires npm install js-cookie

interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function UserInfo() {
  const [user, setUser] = useState<UserData | null>(null);

  const getUser = useEffectEvent(async () => {
    return await getUserInfo();
  });

  // useEffect(() => {
  //   const userInfoString = Cookies.get('user_info');
  //   if (userInfoString) {
  //     try {
  //       const userData = JSON.parse(userInfoString);
  //       setUser(userData);
  //     } catch (e) {
  //       console.error("Error parsing user info cookie:", e);
  //     }
  //   }
  // }, []);

  return { user }
}