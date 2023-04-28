import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
import Container from './Container'
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import Login from './Login'
 
const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})
 

ReactDOM.render(
  <BrowserRouter>
    {/* <App /> */}
    <WagmiConfig client={client}>
    {/* <Container/> */}
    <Login/>
    </WagmiConfig>
   
  </BrowserRouter>,
  document.getElementById('root'),
)
