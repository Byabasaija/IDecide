import React, {useState, useEffect} from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useWeb3ModalTheme, Web3Modal } from '@web3modal/react'

import { setGlobalState, useGlobalState } from './store'

import App from './App'
 



function Container() {
    
    const { setTheme } = useWeb3ModalTheme()
   
    const [user_data] = useGlobalState('user_data')

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : false;
      if(user){
        setGlobalState('isLogged', user.logged)
        setGlobalState('user_data', user)
         
      }  
  
  }, []);
  
    const { address, isConnected } = useAccount()

      const { connect } = useConnect({
        connector: new InjectedConnector(),
        
      })

    if (address) {
      setGlobalState('connectedAccount', address)
    }

  
    setTheme({
      themeColor: 'blue',
      themeMode: 'light',
      themeBackground: 'themeColor',
    })
  return (
      <div className=''>
        
        {isConnected ? 
         <App/>:
         <>
         <h2 className="text-3xl text-black-600 font-bold">
         Welcome <span className="text-green-500">{user_data.user_name} 🤗</span>
       </h2>
       <h1 className="text-5xl text-black-600 font-bold">
         Connect to your <span className="text-green-500">wallet</span>
       </h1>
       <p className="pt-5 text-gray-600 text-xl font-medium">
         {' '}
        To continue with the voting process, you need to connect your wallet below 👇
       </p>
         <button  type="button"
         className="inline-block px-6 py-2 border-2 text-white font-medium bg-green-500
         text-xs leading-tight uppercase rounded hover:bg-black focus:outline-none
         focus:ring-0 transition duration-150 ease-in-out mr-4 mt-5" onClick={() => connect()}>Connect Wallet</button></>
        }
      </div> 
    
  )
}

export default Container