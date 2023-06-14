import React, { useEffect, useState} from 'react'


import Container from './Container'
import Header from './components/Header'
import { useLogin } from './hooks/useLogin'
import Footer from './components/Footer'


 
function Login() {
   const {isLogged, handleLogin} = useLogin()
   
  return (
    <div className='flex flex-col min-h-screen'><Header />
     <main className="flex-1">
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
        Where your decision is respected. <br/>
        Login to decide on your next leader now!
       </p>
         <button  type="button"
         className="inline-block px-6 py-2 border-2 text-white font-medium bg-green-500
         text-xs leading-tight uppercase rounded hover:bg-black focus:outline-none
         focus:ring-0 transition duration-150 ease-in-out mr-4 mt-5" onClick={handleLogin}>{'Login with Ndejje University'}</button></>
    }
      </div> 
     </main>
      <Footer/>
    </div>
     
    
  )
}

export default Login