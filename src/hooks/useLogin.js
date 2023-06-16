import React, { useEffect, useState } from 'react';
import { setGlobalState, useGlobalState } from '../store';
import { toast } from 'react-toastify';

export const useLogin = () => {
 const [isLogged] = useGlobalState('isLogged')
 

  const projectID = 'IDecideVotingDapp.myapp.in';
  const scope = 'full';
  const redirectURL = 'https://i-decide.vercel.app/';


  const handleLogin = (e) => {
    e.preventDefault();
    
    window.location.href = `https://fire-puzzling-beluga.glitch.me/login?projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}`;
  };

  useEffect(() => {
    async function requestToken() {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            await getAccessToken();
            resolve();
          } catch (error) {
            reject(error);
          }
        }),
        {
          pending: 'Logging in...',
          error: 'Failed to log in 🤯',
        }
      );
    }
  
    requestToken();
  }, [isLogged]);
      
 

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
        toast.success('Logged in successfuly')
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
        localStorage.setItem(
          'user',
          JSON.stringify({
            user_name: jsonData.name,
            logged: true,
            role: jsonData.role,
            voted: false
          })
        );
        setGlobalState('user_data', {
          user_name: jsonData.name,
          logged: true,
          role: jsonData.role,
          voted: false
        } )
        setGlobalState('isLogged', true)
      
     
      })
      .catch((error) => {
        console.log(error);
        // Handle error
      });
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : false;
    if(user){
      setGlobalState('isLogged', user.logged)
      setGlobalState('user_data', user)
       
    }  

}, [isLogged]);

const logout = () => {
  localStorage.removeItem('user')
  setGlobalState('isLogged', false)
 
}

  return { handleLogin, isLogged, logout };
};
