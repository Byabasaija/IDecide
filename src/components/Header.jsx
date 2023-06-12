import { Link } from 'react-router-dom'
import { connectWallet } from '../Blockchain.services'
import { truncate, useGlobalState } from '../store'
import ConnectButton from './ConnectButton'

import {useLogin} from '../hooks/useLogin'

const Header = () => {
  const [isLogged] = useGlobalState('isLogged')
  const [user] = useGlobalState('user')
  const {handleLogin, logout} = useLogin()

  return (
    <div className=" flex justify-between items-center p-5 shadow-md shadow-gray-300 ">
      <Link to="/" className="font-bold text-2xl">
       I<span className="text-green-500">Decide</span>
      </Link>


      {isLogged ? (
        <button
          type="button"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium
          text-xs leading-tight rounded shadow-md hover:bg-blue-700
          hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none
          focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={logout}
        >
          {user.user_name? user.user_name: ''}
        </button>
      ) : (
        <button
          type="button"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium
          text-xs leading-tight rounded shadow-md hover:bg-blue-700
          hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none
          focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={handleLogin}
        >
         Login
        </button>
      )}
    </div>
  )
}

export default Header
