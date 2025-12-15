import { Routes, Route, Link } from "react-router-dom"

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { CircleUserRound, Award } from 'lucide-react';

export function GoogleSignIn({ children }) {
const [username, setUsername] = useState(localStorage.getItem('username'));
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {

      // tokenResponse.access_token is what we need to fetch the user's info
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const data = await res.json();
        setUsername(data.email.split("@")[0]);
        localStorage.setItem('username', data.email.split("@")[0]);

        // data.email is the user's email
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    },
    onError: (err) => console.error("Login failed", err),
    scope: 'openid email profile', // request email and profile
    auto_select: true
  });

  if(username){
      return (
                            <div>{username}</div>

  );
  }

  return (
    <div className="a" onClick={() => login()} style={{ cursor: 'pointer' }}>
      <CircleUserRound /> Login
    </div>
  );
}
