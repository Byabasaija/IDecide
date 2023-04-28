import Hero from '../components/Hero'
import Polls from '../components/Polls'
import { useGlobalState } from '../store'
import { getPolls } from '../Blockchain.services'
import { toast } from 'react-toastify'
import React, {useEffect} from 'react'


const Home = () => {
  const [polls] = useGlobalState('polls')
  const [connectedAccount] = useGlobalState('connectedAccount')
  
  

  return (
    <div>
      <Hero />
    </div>
  )
}

export default Home
