import React, { useEffect, useState} from 'react'

import { useGlobalState, setGlobalState } from './store'
import Container from './Container'
import Header from './components/Header'


 
function Login() {
   const [isLogged] =  useGlobalState('isLogged')
   const [loading, setLoading] = useState(false)
   const projectID = 'IDecideVotingApp.myapp.in'
   const scope = 'full'
   const redirectURL = 'http://localhost:3000'
 
  const user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : false;

   useEffect(() => {
    
      if(user && user.logged){
          setGlobalState('isLogged', true);
          setGlobalState('user_name', user.user_name);
          setGlobalState('role', user.role);
      }      
          getAccessToken();
  
  }, []);
 
   const handleLogin = (e) =>{
    
    window.location.href = `http://localhost:5000/login?projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}`
    
    
   }

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
         setGlobalState('role', jsonData.role)
         setGlobalState('user_name', jsonData.name)
         setGlobalState('isLogged',true)
         setIsLogged(true)
         sessionStorage.setItem('user', JSON.stringify({
          'user_name': jsonData.name,
          'logged': true,
          'role': jsonData.role
        }));
       })
       .catch((error) => {
         console.log(error);
         // Handle error
       });
   }


 
  return (
    <><Header />
     <div className='text-center mt-10 p-4'>
        {isLogged ? 
        <Container/> :
       
         <>
         <h1 className="text-5xl text-black-600 font-bold">
         {' '}
         Welcome to <span className="text-green-500">IDecide</span>
       </h1>
       <p className="pt-5 text-gray-600 text-xl font-medium">
         {' '}
        Where your decision is respected. Login to decide on your future now!
       </p>
         <button  type="button"
         className="inline-block px-6 py-2 border-2 text-white font-medium bg-green-500
         text-xs leading-tight uppercase rounded hover:bg-black focus:outline-none
         focus:ring-0 transition duration-150 ease-in-out mr-4 mt-5" onClick={handleLogin}>Login with Ndejje University</button></>
    }
      </div> 
    </>
     
    
  )
}

export default Login