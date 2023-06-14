import { setGlobalState, useGlobalState } from '../store'
import { getUser } from '../Blockchain.services'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'



const Hero = () => {
  const [user] = useGlobalState('user')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const navigate = useNavigate()

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
        Decide on your future with our powerful voting  <strong>DAPP</strong>{' '}
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
