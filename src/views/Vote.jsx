import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { getPoll, contest, listContestants, vote } from '../Blockchain.services'
import { useGlobalState, setGlobalState, truncate } from '../store'
import Identicon from 'react-identicons'

const Vote = () => {
  const { id } = useParams()
  const [poll] = useGlobalState('poll')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [contestants] = useGlobalState('contestants')
  const [user] = useGlobalState('user')
  const navigate = useNavigate()
  // const [winner, setWinner] = useState(null);
  const [user_data] = useGlobalState('user_data')

  const role = localStorage.getItem('role')
  const isCandidate = role.toUpperCase() != 'CANDIDATE'


  useEffect(() =>{
     const user_data =JSON.parse(localStorage.getItem('user'));
     const block_user = JSON.parse(localStorage.getItem('block_user'))
     setGlobalState('user_data', user_data)
     setGlobalState('user', block_user)
  }, [])

  const handleContest = async () => {
    if (!user) {
      toast('Please, register on the smart contract first...')
      navigate('/')
      return
    }
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await contest(id)
          .then(() => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Approving transaction...',
        
      },
    )
}

  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const day = date.toLocaleString('en-us', { weekday: 'short' })
    const month = date.toLocaleString('en-us', { month: 'short' })
    const year = date.getFullYear()
    const dayOfMonth = date.getDate()
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day} ${dayOfMonth} ${month}, ${year} ${hours}:${minutes}`
    
  }

  useEffect(async () => {
    await getPoll(id)
    await listContestants(id)
  }, [])

  const winner = contestants.length > 0 &&contestants.reduce((prev, current) =>
    prev.votes > current.votes ? prev : prev.votes == current.votes ? 'Tie' : current
  );

  const leaderboard = winner.fullname ? `${winner.fullname} takes the lead!` : 'Its a tie!'

  return (
    <div className="w-full md:w-4/5 mx-auto p-4">
      <div className="text-center my-5">
        <img
          className="w-full h-40 object-cover mb-4"
          src={poll?.image}
          alt={poll?.title}
        />
        <h1 className="text-5xl text-black-600 font-bold">{poll?.title}</h1>
        <p className="pt-5 text-gray-600 text-xl font-medium">
          {poll?.description}
        </p>

        {poll?.startsAt ? (
          <div className="flex justify-center items-center space-x-2 my-2 text-sm">
            <span>{convertTimestamp(poll?.startsAt)}</span>
            <span> - </span>
            <span>{convertTimestamp(poll?.endsAt)}</span>
          </div>
        ) : null}

        <div className="flex justify-center items-center space-x-2 text-sm">
          <Identicon
            string={poll?.director}
            size={25}
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="font-bold">
            {poll?.director ? truncate(poll?.director, 4, 4, 11) : '...'}
          </span>
        </div>

        <div className="flex justify-center items-center space-x-2 my-2 text-sm">
          <span className="text-gray-500">{poll?.votes} Votes</span>
          <span className="text-gray-500">{poll?.contestants} Contestants</span>
        </div>

        <div className="flex justify-center my-3">
          <div className="flex space-x-2">
            {connectedAccount.toLowerCase() == poll?.director ? null :  Date.now() > poll?.startsAt? null: isCandidate ?
            <button
            type="button"
            className="inline-block px-6 py-2 border-2 border-green-500 text-green-500
              font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5
              focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={handleContest}
          >
            Contest
          </button>
            : null}
            
       
            {connectedAccount.toLowerCase() == poll?.director && !poll?.deleted && Date.now() < poll?.startsAt? (
              <>
                <button
                  type="button"
                  className="inline-block px-6 py-2 border-2 border-gray-600 text-gray-600
                 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5
                 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                  onClick={() => setGlobalState('updatePollModal', 'scale-100')}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-block px-6 py-2 border-2 border-red-600 text-red-600
                 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5
                 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                  onClick={() => setGlobalState('deletePollModal', 'scale-100')}
                >
                  Delete
                </button>
              </>
            ) : !poll?.deleted && Date.now() > poll?.startsAt && Date.now() < poll?.endsAt  ? <h4 className="text-4xl text-black-500 font-bold">{leaderboard}</h4>: <h4 className="text-4xl text-black-500 font-bold">The winner is {winner.fullname} </h4>}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full lg:w-3/4 mx-auto">
        <div className="flex flex-col items-center">
          {contestants.length > 0 && !Date.now() > poll?.endsAt ? (
            <h4 className="text-lg font-medium uppercase mt-6 mb-3">
              Contestants
            </h4>
          ) : contestants.length > 0 && Date.now() > poll?.endsAt ? (
            <h4 className="text-lg font-medium uppercase mt-6 mb-3">
              Results 
            </h4>
          ): null}

        

          {contestants.map((contestant, i) => (
            <Votee key={i} contestant={contestant} poll={poll} />
          ))}
          
        </div>
      </div>
    </div>
  )
}

const Votee = ({ contestant, poll }) => {
  const [user] = useGlobalState('user')
  const [contestss] = useGlobalState('contestss')
  const navigate = useNavigate()
  const [user_data] = useGlobalState('user_data')
  const role = localStorage.getItem('role')
  const isNotAdmin = role.toUpperCase() != 'ADMIN'

  useEffect(() =>{
     const user_data =JSON.parse(localStorage.getItem('user'));
     const block_user = JSON.parse(localStorage.getItem('block_user'))
     setGlobalState('user_data', user_data)
     setGlobalState('user', block_user)
  }, [])

  const handleVote = async (id, cid) => {
    if (!user) {
      toast.info('Please register on the smart contract first...');
      navigate('/');
      return;
    }
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await vote(id, cid)
          .then(() => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Approving transaction...',
        // success: 'Polls retrieved successfully 👌',
        // error: 'Encountered error 🤯',
      },
    )
  }



  return (
    <div className="flex justify-start w-full mx-auto rounded-lg bg-white shadow-lg my-2">
      <div>
        <img
          className="w-40 h-full object-cover rounded-lg md:rounded-none"
          src={contestant?.image}
          alt={contestant?.fullname}
        />
      </div>

      <div className="p-6 flex flex-col justify-start ">
        <p className="text-gray-700 text-base font-bold">
          {contestant?.fullname}
        </p>

        <div className="flex justify-start items-center space-x-2 text-sm my-2">
          <Identicon
            string={contestant?.voter}
            size={20}
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="font-bold">
            {truncate(contestant?.voter, 4, 4, 11)}
          </span>
        </div>

        <div className="flex justify-start items-center">
          {Date.now() > poll?.startsAt && poll?.endsAt > Date.now() ?
          <span className="text-gray-600 text-sm">
            {contestant?.votes} votes
          </span>:poll?.endsAt < Date.now() ?
          <span className="text-gray-600 text-sm">
            {contestant?.votes} votes
          </span>:
          <span className="text-gray-600 text-sm">
          Poll hasn't started
        </span>}
          {Date.now() > poll?.startsAt && poll?.endsAt > Date.now() && !user_data.voted? (
            
            <button
              type="button"
              className="inline-block px-3 py-1 border-2 border-gray-800 text-gray-800
                  font-medium text-xs leading-tight uppercase rounded-full hover:bg-black
                  hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150
                  ease-in-out ml-8"
              onClick={() => handleVote(poll?.id, contestant?.id)}
            >
              Vote
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Vote
