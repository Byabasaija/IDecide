import Polls from '../components/Polls'
import { useGlobalState, setGlobalState } from '../store'
import { getPolls } from '../Blockchain.services'
import { toast } from 'react-toastify'
import React, {useEffect} from 'react'

const ViewPolls = () => {
  const [polls] = useGlobalState('polls')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [user] = useGlobalState('user_data')
  const isAdmin = user.role == 'Admin' ? true : false
  console.log(user)
  useEffect(() => {
    if(connectedAccount){
      async function retrievePolls(){
        await toast.promise(
          new Promise(async (resolve, reject) => {
            await getPolls()
              .then(() => resolve())
              .catch(() => reject())
          }),
          {
            pending: 'Getting polls...',    
          },
        )
      }
      retrievePolls()
    }
    
  }, [])
  

  return (
    <div>
        <div className="">
      
          <div className="flex justify-center pt-10">
            {
              isAdmin &&
              <div className="space-x-2">
            <button
              type="button"
              className="inline-block px-6 py-2.5 bg-black text-white font-medium text-xs
              leading-tight uppercase rounded shadow-md hover:bg-green-500 hover:shadow-lg
              focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800
              active:shadow-lg transition duration-150 ease-in-out border border-blue-600"
              onClick={() => setGlobalState('createPollModal', 'scale-100')}
            >
            
              Create Poll
            </button>
          </div>
            }
          
          </div>
          </div>
      <Polls polls={polls.filter((poll) => !poll.deleted)} />
    </div>
  )
}

export default ViewPolls
