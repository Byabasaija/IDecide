import { useGlobalState, setGlobalState } from '../store'
import React, { useEffect, useState} from 'react'

 export const useLogin = () => {
    const [isLogged] =  useGlobalState('isLogged')
    const [loggedIn, setLoggedIn] = useState(false)
   const [loading, setLoading] = useState(false)

   const projectID = 'IDecideVotingApp.myapp.in'
   const scope = 'full'
   const redirectURL = 'http://localhost:3000'
 
  

   useEffect(() => {
      const user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : false;
      if(user){
          setLoggedIn(true)
          setGlobalState('user_name', user.user_name);
          setGlobalState('role', user.role);
      }        
  }, []);
 
   const handleLogin = (e) =>{
    e.preventDefault()
    setLoading(true)
    window.location.href = `http://localhost:5000/login?projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}`
    
   }

   useEffect(() => {
     getAccessToken()
   }, [loading])

   function getAccessToken() {
     const projectSecret = '07299f8e04034332e72602fc39dea446ac4fb604b06e14a900262a61bb9ecc8e';
     const search = window.location.search + `&projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}&projectSecret=${projectSecret}`;
     
     fetch('http://localhost:5000/api/oauth/token' + search, {
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
 
     fetch('http://localhost:5000/api/oauth/userinfo' + search, {
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
        console.log(jsonData), 'yaa'  
         sessionStorage.setItem('user', JSON.stringify({
          'user_name': jsonData.name,
          'logged': true,
          'role': jsonData.role
        }));
        setLoading(false)
       })
       .catch((error) => {
         console.log(error);
         // Handle error
       });
   }

   return {handleLogin, loggedIn, }
}

