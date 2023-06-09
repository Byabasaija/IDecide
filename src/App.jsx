import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { getPolls, getUser, isWallectConnected } from './Blockchain.services'
import { ToastContainer } from 'react-toastify'
import CreatePoll from './components/CreatePoll'
import DeletePoll from './components/DeletePoll'
import Footer from './components/Footer'
import Header from './components/Header'
import Register from './components/Register'
import UpdatePoll from './components/UpdatePoll'
import Home from './views/Home'
import Vote from './views/Vote'
import ViewPolls from './views/Polls'

const App = () => {


  return (
    <div className="min-h-screen">
      {/* <WagmiConfig client={client}> */}
        
        {/* {loaded ? ( */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/polls/:id" element={<Vote />} />
            <Route path="/polls" element={<ViewPolls/>} />
          </Routes>
        {/* ) : null} */}

        <Register />
        <DeletePoll />
        <CreatePoll />
        <UpdatePoll />
       {/* <div>
       <Footer />
       </div> */}
      {/* </WagmiConfig> */}

      {/* <Web3Modal
        projectId="7101921d84ad9726b009f44fc01ebf3f"
        ethereumClient={ethereumClient}
      /> */}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App