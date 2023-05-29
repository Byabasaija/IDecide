import React, { useEffect, useState } from 'react';

export const useLogin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const projectID = 'IDecideVotingDapp.myapp.in';
  const scope = 'full';
  const redirectURL = 'https://i-decide.vercel.app';


  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    window.location.href = `https://fire-puzzling-beluga.glitch.me/login?projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}`;
  };

  useEffect(() => {
    getAccessToken();
  }, [loggedIn]);

  function getAccessToken() {
    const projectSecret = 'a6a7edcbd61fe04ee445c9d4a904b05bd785b7bb9c1f4f5bf3a6ea229ba86f49';
    const search =
      window.location.search +
      `&projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}&projectSecret=${projectSecret}`;

    fetch('https://fire-puzzling-beluga.glitch.me/api/oauth/token' + search, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to get access token');
        }
      })
      .then((jsonData) => {
        getUserInfo(jsonData.access_token);
      })
      .catch((error) => {
        console.log(error);
        // Handle error
      });
  }

  function getUserInfo(access_token) {
    const search = `?access_token=${access_token}`;

    fetch('https://fire-puzzling-beluga.glitch.me//api/oauth/userinfo' + search, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to get user info');
        }
      })
      .then((jsonData) => {
        sessionStorage.setItem(
          'user',
          JSON.stringify({
            user_name: jsonData.name,
            logged: true,
            role: jsonData.role,
          })
        );
        setLoggedIn(true);
        setUser({
          user_name: jsonData.name,
          logged: true,
          role: jsonData.role,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // Handle error
      });
  }

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : false;
    if(user){
        setLoggedIn(user.logged)
        setUser(user)
        console.log('i rannnnn on logg chh')
    }  

}, [loggedIn]);

const logout = () => {
  sessionStorage.removeItem('user')
  setLoggedIn(false)
  console.log('i rannnnn')
}

  return { handleLogin, loggedIn, user, logout };
};
