import React, {useState, useEffect} from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useWeb3ModalTheme, Web3Modal } from '@web3modal/react'

import { useGlobalState, setGlobalState } from './store'
import Container from './Container'
import Header from './components/Header'

 
function Login() {
   const [isLogged] = useGlobalState('isLogged')
   const [userInfo, setUserInfo] = useState({ name: '', email: '', _id: '' });
   const projectID = 'IDecideVotingApp.myapp.in'
   const scope = 'full'
   const redirectURL = 'http://localhost:3000'

   const handleLogin = () =>{
    window.location.href = `http://localhost:5000/login?projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}`
   }



   useEffect(() => {
     getAccessToken();
   }, []);
 
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
         setUserInfo(jsonData);
         console.log(jsonData.name)
         setGlobalState('role', jsonData.role)
         setGlobalState('user_name', jsonData.name)
         setGlobalState('isLogged',true)
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