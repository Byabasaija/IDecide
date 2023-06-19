import { setGlobalState, useGlobalState } from '../store'
import { getUser } from '../Blockchain.services'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios';


const Hero = () => {
  
  const [connectedAccount] = useGlobalState('connectedAccount')
 
  const navigate = useNavigate()

  useEffect(()=>{
  const user_data = localStorage.getItem('user')
  const reg_no = user_data.reg_no ?? ''
  axios.get('http://localhost:1337/api/officials')
  .then((res) => {
    const officials = res.data.data || []; // Access the "data" property of the response

    for (let i = 0; i < officials.length; i++) {
      if (officials[i].attributes.reg_no === reg_no) { // Access the "reg_no" property using dot notation
        setGlobalState('role', officials[i].attributes.role); // Access the "role" property using dot notation
        localStorage.setItem('role', officials[i].attributes.role); // Access the "role" property using dot notation
        break; // Exit the loop once a match is found (optional)
      }
    }
    toast.success('Roles set successfuly 👌')
  })
  
  .catch((error) => {
    toast.error(`${error} 🤯`)
  });
  },[])

  

  const retrieveUser = async (e) =>{
    e.preventDefault()
    if(connectedAccount){
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await getUser()
            .then(() => resolve())
            .catch(() => reject())
        }),
        {
          pending: 'Getting user...',
         
        },
        navigate('/polls')
      )
    }

  }

  return (
    <div className="">
      <h1 className="text-5xl text-black-600 font-bold">
        {' '}
        Let me  <span className="text-green-500">Decide</span>
      </h1>
      <p className="pt-5 text-gray-600 text-xl font-medium">
        {' '}
        Empower your voice and shape your destiny with our revolutionary voting  <strong>DAPP</strong>{' '}
      </p>
      <div className="flex justify-center pt-10">
       
          <>
          <button
            type="button"
            className="inline-block px-6 py-2 border-2 border-green-500 text-white font-medium bg-green-500
            text-xs leading-tight uppercase rounded hover:bg-black  focus:outline-none
            focus:ring-0 transition duration-150 ease-in-out mr-4"
            onClick={retrieveUser}
            disabled={!connectedAccount}
            title={!connectedAccount ? 'Please connect wallet first' : null}
          >
           Access Polls
          </button>
          <button
            type="button"
            className="inline-block px-6 py-2 border-2 border-green-500 text-black-600 font-medium
            text-xs leading-tight uppercase rounded hover:bg-white  focus:outline-none
            focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setGlobalState('contestModal', 'scale-100')}
            disabled={!connectedAccount}
            title={!connectedAccount ? 'Please connect wallet first' : null}
          >
            Register on the Contract
          </button>
        </>
          
      
      </div>
    </div>
  )
}

export default Hero
